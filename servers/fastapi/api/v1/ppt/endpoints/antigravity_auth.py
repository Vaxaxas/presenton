"""
Google Antigravity OAuth endpoints.

Flow:
  1. POST /antigravity/auth/initiate       — start the flow, returns an auth URL + session_id
  2. Browser opens the URL, user authenticates with Google
  3. Google redirects to http://localhost:51121/oauth-callback (captured by local server)
  4. GET  /antigravity/auth/status/{session_id} — poll until code captured; exchanges and stores tokens
  5. POST /antigravity/auth/exchange       — manual fallback if browser callback didn't fire
  6. POST /antigravity/auth/refresh        — refresh a stored token
  7. POST /antigravity/auth/import-local   — import from ~/.gemini/oauth_creds.json
  8. GET  /antigravity/auth/status         — check stored token validity
  9. POST /antigravity/auth/logout         — clear stored credentials
"""
import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from utils.oauth.antigravity import (
    AntigravityAccountProfile,
    OAuthCallbackServer,
    TokenSuccess,
    create_authorization_flow,
    detect_and_load_local_gemini_credentials,
    exchange_authorization_code,
    get_account_profile_from_token,
    parse_authorization_input,
    refresh_access_token,
)
from utils.get_env import (
    get_antigravity_access_token_env,
    get_antigravity_email_env,
    get_antigravity_name_env,
    get_antigravity_project_id_env,
    get_antigravity_refresh_token_env,
    get_antigravity_token_expires_env,
)
from utils.set_env import (
    set_antigravity_access_token_env,
    set_antigravity_email_env,
    set_antigravity_model_env,
    set_antigravity_name_env,
    set_antigravity_project_id_env,
    set_antigravity_refresh_token_env,
    set_antigravity_token_expires_env,
)
from utils.user_config import save_antigravity_tokens_to_user_config

ANTIGRAVITY_AUTH_ROUTER = APIRouter(prefix="/antigravity/auth", tags=["Antigravity OAuth"])
ANTIGRAVITY_AUTH_REQUIRED_HEADERS = {"X-Presenton-Auth-Action": "antigravity-reauth"}
ANTIGRAVITY_AUTH_REQUIRED_PREFIX = "ANTIGRAVITY_AUTH_REQUIRED:"

_sessions: dict[str, dict] = {}


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class InitiateResponse(BaseModel):
    session_id: str
    url: str
    instructions: str


class StatusResponse(BaseModel):
    status: str  # "pending" | "success" | "failed" | "authenticated" | "not_authenticated" | "expired"
    email: Optional[str] = None
    name: Optional[str] = None
    project_id: Optional[str] = None
    detail: Optional[str] = None
    local_creds_available: Optional[bool] = None


class ExchangeRequest(BaseModel):
    session_id: str
    code: str  # raw code OR full redirect URL OR code#state shorthand


class ExchangeResponse(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    project_id: Optional[str] = None


class RefreshResponse(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    project_id: Optional[str] = None
    detail: str


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _store_token(result: TokenSuccess) -> AntigravityAccountProfile:
    """Persist token fields in env vars and userConfig.json. Returns parsed profile."""
    set_antigravity_access_token_env(result.access)
    set_antigravity_refresh_token_env(result.refresh)
    set_antigravity_token_expires_env(str(result.expires))

    profile = get_account_profile_from_token(result.access)
    email = result.email or profile.email or ""
    name = result.name or profile.name or ""
    project_id = result.project_id or profile.project_id or "rising-fact-p41fc"

    set_antigravity_email_env(email)
    set_antigravity_name_env(name)
    set_antigravity_project_id_env(project_id)

    save_antigravity_tokens_to_user_config()
    return AntigravityAccountProfile(email=email, name=name, project_id=project_id)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@ANTIGRAVITY_AUTH_ROUTER.post("/initiate", response_model=InitiateResponse)
async def initiate_antigravity_auth():
    """
    Start the Google Antigravity OAuth flow.

    Returns an authorization URL to open in the browser and a session_id to use
    when polling /status or calling /exchange. A local HTTP server is started
    on port 51121 to receive the redirect automatically.
    """
    flow = create_authorization_flow()
    server = OAuthCallbackServer(state=flow.state, port=51121)
    server_started = server.start()

    session_id = str(uuid.uuid4())
    _sessions[session_id] = {
        "verifier": flow.verifier,
        "state": flow.state,
        "server": server,
        "server_started": server_started,
    }

    instructions = (
        "Open the URL in your browser and complete the Google login. "
        + (
            "The callback will be captured automatically on port 51121."
            if server_started
            else "Port 51121 could not be bound — paste the redirect URL or code into /exchange."
        )
    )

    return InitiateResponse(
        session_id=session_id,
        url=flow.url,
        instructions=instructions,
    )


@ANTIGRAVITY_AUTH_ROUTER.get("/status/{session_id}", response_model=StatusResponse)
async def poll_antigravity_auth_status(session_id: str):
    """
    Poll for the result of an ongoing OAuth flow.
    """
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or already consumed")

    server: OAuthCallbackServer = session["server"]
    code = server.get_code_nowait() if session.get("server_started") else None

    if code is None:
        return StatusResponse(status="pending")

    verifier: str = session["verifier"]
    result = exchange_authorization_code(code, verifier)

    server.close()
    _sessions.pop(session_id, None)

    if not isinstance(result, TokenSuccess):
        return StatusResponse(status="failed", detail=result.reason)

    profile = _store_token(result)
    return StatusResponse(
        status="success",
        email=profile.email,
        name=profile.name,
        project_id=profile.project_id,
    )


@ANTIGRAVITY_AUTH_ROUTER.post("/exchange", response_model=ExchangeResponse)
async def exchange_antigravity_code(body: ExchangeRequest):
    """
    Manual code exchange fallback.
    """
    session = _sessions.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or already consumed")

    parsed = parse_authorization_input(body.code)
    code = parsed.get("code")
    incoming_state = parsed.get("state")

    if not code:
        raise HTTPException(status_code=400, detail="Could not extract authorization code from input")

    if incoming_state and incoming_state != session["state"]:
        raise HTTPException(status_code=400, detail="State mismatch — possible CSRF")

    verifier: str = session["verifier"]
    server: OAuthCallbackServer = session["server"]

    result = exchange_authorization_code(code, verifier)

    server.close()
    _sessions.pop(body.session_id, None)

    if not isinstance(result, TokenSuccess):
        raise HTTPException(status_code=502, detail=f"Token exchange failed: {result.reason}")

    profile = _store_token(result)
    return ExchangeResponse(
        email=profile.email,
        name=profile.name,
        project_id=profile.project_id,
    )


@ANTIGRAVITY_AUTH_ROUTER.post("/refresh", response_model=RefreshResponse)
async def refresh_antigravity_token():
    """
    Refresh the stored Antigravity OAuth access token.
    """
    refresh_token = get_antigravity_refresh_token_env()
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail=(
                f"{ANTIGRAVITY_AUTH_REQUIRED_PREFIX} Antigravity authentication is required. "
                "Please sign in again from Settings."
            ),
            headers=ANTIGRAVITY_AUTH_REQUIRED_HEADERS,
        )

    result = refresh_access_token(refresh_token)
    if not isinstance(result, TokenSuccess):
        raise HTTPException(
            status_code=401,
            detail=(
                f"{ANTIGRAVITY_AUTH_REQUIRED_PREFIX} Your Antigravity session expired. "
                "Please sign in again from Settings."
            ),
            headers=ANTIGRAVITY_AUTH_REQUIRED_HEADERS,
        )

    profile = _store_token(result)
    return RefreshResponse(
        email=profile.email,
        name=profile.name,
        project_id=profile.project_id,
        detail="Token refreshed successfully",
    )


@ANTIGRAVITY_AUTH_ROUTER.post("/import-local", response_model=StatusResponse)
async def import_local_antigravity_credentials():
    """
    Detect and import credentials from ~/.gemini/oauth_creds.json if available.
    """
    result = detect_and_load_local_gemini_credentials()
    if not result:
        raise HTTPException(
            status_code=404,
            detail="No local Antigravity credentials found in ~/.gemini/oauth_creds.json",
        )

    profile = _store_token(result)
    return StatusResponse(
        status="authenticated",
        email=profile.email,
        name=profile.name,
        project_id=profile.project_id,
        detail="Imported local Antigravity credentials successfully",
    )


@ANTIGRAVITY_AUTH_ROUTER.get("/status", response_model=StatusResponse)
async def get_antigravity_auth_status():
    """
    Return whether a valid Antigravity OAuth token is currently stored,
    and whether local ~/.gemini/oauth_creds.json credentials exist.
    """
    import time
    from pathlib import Path

    local_available = (Path.home() / ".gemini" / "oauth_creds.json").is_file()

    access_token = get_antigravity_access_token_env()
    if not access_token:
        return StatusResponse(
            status="not_authenticated",
            detail="No access token stored",
            local_creds_available=local_available,
        )

    expires_str = get_antigravity_token_expires_env()
    if expires_str:
        try:
            expires_ms = int(expires_str)
            now_ms = int(time.time() * 1000)
            if now_ms >= expires_ms:
                return StatusResponse(
                    status="expired",
                    detail="Access token has expired — call /refresh",
                    local_creds_available=local_available,
                )
        except (ValueError, TypeError):
            pass

    return StatusResponse(
        status="authenticated",
        email=get_antigravity_email_env(),
        name=get_antigravity_name_env(),
        project_id=get_antigravity_project_id_env() or "rising-fact-p41fc",
        local_creds_available=local_available,
    )


@ANTIGRAVITY_AUTH_ROUTER.post("/logout")
async def logout_antigravity():
    """
    Clear all stored Antigravity OAuth credentials from environment variables and userConfig.json.
    """
    set_antigravity_access_token_env("")
    set_antigravity_refresh_token_env("")
    set_antigravity_token_expires_env("")
    set_antigravity_email_env("")
    set_antigravity_name_env("")
    set_antigravity_project_id_env("")
    set_antigravity_model_env("")
    save_antigravity_tokens_to_user_config(include_model=True)
    return {"detail": "Logged out successfully"}
