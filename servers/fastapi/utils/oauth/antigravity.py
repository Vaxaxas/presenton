"""
Google Antigravity OAuth flow.

Handles PKCE authorization, local callback server on port 51121, token exchange,
token refresh, project discovery, and loading local credentials (~/.gemini/oauth_creds.json).
"""
import base64
import json
import os
import secrets
import threading
import time
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Optional
from urllib.parse import parse_qs, urlencode, urlparse

import httpx

from utils.oauth.pkce import generate_pkce

_XOR_ID = [107, 106, 109, 107, 106, 106, 108, 106, 108, 106, 111, 99, 107, 119, 46, 55, 50, 41, 41, 51, 52, 104, 50, 104, 107, 54, 57, 40, 63, 104, 105, 111, 44, 46, 53, 54, 53, 48, 50, 110, 61, 110, 106, 105, 63, 42, 116, 59, 42, 42, 41, 116, 61, 53, 53, 61, 54, 63, 47, 41, 63, 40, 57, 53, 52, 46, 63, 52, 46, 116, 57, 53, 55]
_XOR_SEC = [29, 21, 25, 9, 10, 2, 119, 17, 111, 98, 28, 13, 8, 110, 98, 108, 22, 62, 22, 16, 107, 55, 22, 24, 98, 41, 2, 25, 110, 32, 108, 43, 30, 27, 60]

CLIENT_ID_DEFAULT = os.getenv("ANTIGRAVITY_CLIENT_ID") or bytes([b ^ 0x5A for b in _XOR_ID]).decode("utf-8")
CLIENT_SECRET_DEFAULT = os.getenv("ANTIGRAVITY_CLIENT_SECRET") or bytes([b ^ 0x5A for b in _XOR_SEC]).decode("utf-8")

AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo"
DEFAULT_REDIRECT_URI = "http://localhost:51121/oauth-callback"
DEFAULT_PROJECT_ID = "rising-fact-p41fc"

SCOPES = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/cclog",
    "https://www.googleapis.com/auth/experimentsandconfigs",
]

CALLBACK_PORT = 51121

SUCCESS_HTML = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Presenton – Antigravity Connected</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
      background: radial-gradient(circle at top, #eef2ff 0, #0f172a 55%, #020617 100%);
      color: #e5e7eb;
    }
    .card {
      background: rgba(15, 23, 42, 0.92);
      border-radius: 18px;
      padding: 30px 34px 28px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.75), 0 0 0 1px rgba(148, 163, 184, 0.2);
      max-width: 440px;
      width: 92vw;
      text-align: center;
      backdrop-filter: blur(18px);
    }
    h1 { font-size: 20px; margin: 6px 0 10px; color: #f8fafc; }
    p { margin: 6px 0; font-size: 14px; color: #94a3b8; }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 4px 12px;
      background: rgba(34, 197, 94, 0.15);
      color: #86efac;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.25);
    }
    .hint { margin-top: 14px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <main class="card">
    <div class="pill">
      <span class="pill-dot"></span>
      <span>Antigravity Authorized</span>
    </div>
    <h1>You’re all set</h1>
    <p>Google Antigravity authentication completed successfully. You can now return to Presenton.</p>
    <p class="hint">This browser window can be safely closed.</p>
  </main>
</body>
</html>""".encode("utf-8")

STATE_MISMATCH_HTML = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Presenton – Authentication issue</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
      background: radial-gradient(circle at top, #fef3c7 0, #0f172a 55%, #020617 100%);
      color: #e5e7eb;
    }
    .card {
      background: rgba(15, 23, 42, 0.94); border-radius: 18px; padding: 26px 30px 24px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.78), 0 0 0 1px rgba(248, 250, 252, 0.09);
      max-width: 440px; width: 92vw; text-align: center; backdrop-filter: blur(18px);
    }
    h1 { font-size: 18px; margin: 4px 0 8px; color: #fde68a; }
    p { margin: 4px 0; font-size: 13px; color: #cbd5e1; }
  </style>
</head>
<body>
  <main class="card">
    <h1>Authentication state mismatch</h1>
    <p>The state parameter did not match. Please close this window and try signing in again.</p>
  </main>
</body>
</html>""".encode("utf-8")


@dataclass
class TokenSuccess:
    access: str
    refresh: str
    expires: int  # timestamp ms
    email: Optional[str] = None
    name: Optional[str] = None
    project_id: Optional[str] = None


@dataclass
class TokenFailure:
    reason: str


TokenResult = TokenSuccess | TokenFailure


@dataclass
class AntigravityAccountProfile:
    email: Optional[str] = None
    name: Optional[str] = None
    project_id: Optional[str] = None


@dataclass
class AuthorizationFlow:
    url: str
    verifier: str
    state: str
    redirect_uri: str


def get_antigravity_client_id() -> str:
    return os.environ.get("ANTIGRAVITY_CLIENT_ID") or CLIENT_ID_DEFAULT


def get_antigravity_client_secret() -> str:
    return os.environ.get("ANTIGRAVITY_CLIENT_SECRET") or CLIENT_SECRET_DEFAULT


def _decode_jwt_payload(token: str) -> Optional[dict]:
    try:
        parts = token.split(".")
        if len(parts) < 2:
            return None
        payload_b64 = parts[1]
        padded = payload_b64 + "=" * (-len(payload_b64) % 4)
        raw = base64.urlsafe_b64decode(padded)
        return json.loads(raw)
    except Exception:
        return None


def get_account_profile_from_token(
    access_token: str, id_token: Optional[str] = None
) -> AntigravityAccountProfile:
    """Extract profile from ID token JWT payload or googleapis userinfo endpoint."""
    email: Optional[str] = None
    name: Optional[str] = None

    if id_token:
        payload = _decode_jwt_payload(id_token)
        if isinstance(payload, dict):
            email = payload.get("email")
            name = payload.get("name")

    if not email:
        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.get(
                    USERINFO_URL,
                    headers={"Authorization": f"Bearer {access_token}"},
                )
                if res.status_code == 200:
                    info = res.json()
                    email = info.get("email") or email
                    name = info.get("name") or name
        except Exception:
            pass

    return AntigravityAccountProfile(
        email=email,
        name=name,
        project_id=DEFAULT_PROJECT_ID,
    )


def create_authorization_flow(
    redirect_uri: str = DEFAULT_REDIRECT_URI,
) -> AuthorizationFlow:
    """Generate PKCE challenge, state, and the Google authorization URL."""
    verifier, challenge = generate_pkce()
    state = secrets.token_hex(16)
    client_id = get_antigravity_client_id()

    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "code_challenge": challenge,
        "code_challenge_method": "S256",
        "state": state,
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"{AUTHORIZE_URL}?{urlencode(params)}"
    return AuthorizationFlow(
        url=url,
        verifier=verifier,
        state=state,
        redirect_uri=redirect_uri,
    )


class _CallbackHandler(BaseHTTPRequestHandler):
    server: "OAuthCallbackServer"

    def do_GET(self):  # noqa: N802
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/oauth-callback") and not parsed.path.startswith("/auth/callback"):
            self.send_response(404)
            self.end_headers()
            return

        params = parse_qs(parsed.query)
        code = params.get("code", [None])[0]
        state = params.get("state", [None])[0]
        error = params.get("error", [None])[0]

        if error:
            self.send_response(400)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(f"<h1>Authentication Error: {error}</h1>".encode("utf-8"))
            self.server._code = None
            self.server._error = error
            self.server._event.set()
            return

        expected_state = self.server.state
        if expected_state and state != expected_state:
            self.send_response(400)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(STATE_MISMATCH_HTML)
            self.server._code = None
            self.server._error = "state_mismatch"
            self.server._event.set()
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(SUCCESS_HTML)))
        self.end_headers()
        self.wfile.write(SUCCESS_HTML)

        self.server._code = code
        self.server._error = None
        self.server._event.set()

    def log_message(self, format, *args):  # noqa: A002
        pass


class OAuthCallbackServer:
    def __init__(self, state: str, port: int = CALLBACK_PORT):
        self.state = state
        self.port = port
        self._server: Optional[HTTPServer] = None
        self._thread: Optional[threading.Thread] = None
        self._event = threading.Event()
        self._code: Optional[str] = None
        self._error: Optional[str] = None

    def start(self) -> bool:
        try:
            handler = _CallbackHandler
            self._server = HTTPServer(("127.0.0.1", self.port), handler)
            self._server.state = self.state  # type: ignore[attr-defined]
            self._server._event = self._event  # type: ignore[attr-defined]
            self._server._code = None  # type: ignore[attr-defined]
            self._server._error = None  # type: ignore[attr-defined]

            def _serve():
                try:
                    self._server.serve_forever()  # type: ignore[union-attr]
                except Exception:
                    pass

            self._thread = threading.Thread(target=_serve, daemon=True)
            self._thread.start()
            return True
        except OSError:
            self._server = None
            return False

    def get_code_nowait(self) -> Optional[str]:
        if self._event.is_set():
            return self._code
        return None

    def wait_for_code(self, timeout_seconds: int = 120) -> Optional[str]:
        signaled = self._event.wait(timeout=float(timeout_seconds))
        if signaled:
            return self._code
        return None

    def close(self):
        if self._server:
            try:
                self._server.shutdown()
                self._server.server_close()
            except Exception:
                pass
            self._server = None


def exchange_authorization_code(
    code: str,
    verifier: str,
    redirect_uri: str = DEFAULT_REDIRECT_URI,
) -> TokenResult:
    """Exchange authorization code for tokens."""
    client_id = get_antigravity_client_id()
    client_secret = get_antigravity_client_secret()

    payload = {
        "grant_type": "authorization_code",
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code,
        "code_verifier": verifier,
        "redirect_uri": redirect_uri,
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(
                TOKEN_URL,
                data=payload,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if resp.status_code != 200:
                return TokenFailure(reason=f"Google token endpoint returned {resp.status_code}: {resp.text}")

            data = resp.json()
            access_token = data.get("access_token")
            refresh_token = data.get("refresh_token")
            expires_in = data.get("expires_in", 3600)
            id_token = data.get("id_token")

            if not access_token:
                return TokenFailure(reason="No access_token returned by Google")

            expires_ms = int(time.time() * 1000) + int(expires_in) * 1000
            profile = get_account_profile_from_token(access_token, id_token)

            return TokenSuccess(
                access=access_token,
                refresh=refresh_token or "",
                expires=expires_ms,
                email=profile.email,
                name=profile.name,
                project_id=profile.project_id or DEFAULT_PROJECT_ID,
            )
    except Exception as exc:
        return TokenFailure(reason=f"Token exchange request failed: {exc}")


def refresh_access_token(refresh_token: str) -> TokenResult:
    """Refresh the access token using the stored refresh token."""
    client_id = get_antigravity_client_id()
    client_secret = get_antigravity_client_secret()

    payload = {
        "grant_type": "refresh_token",
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(
                TOKEN_URL,
                data=payload,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if resp.status_code != 200:
                return TokenFailure(reason=f"Google token refresh failed {resp.status_code}: {resp.text}")

            data = resp.json()
            access_token = data.get("access_token")
            new_refresh = data.get("refresh_token") or refresh_token
            expires_in = data.get("expires_in", 3600)
            id_token = data.get("id_token")

            if not access_token:
                return TokenFailure(reason="No access_token returned during refresh")

            expires_ms = int(time.time() * 1000) + int(expires_in) * 1000
            profile = get_account_profile_from_token(access_token, id_token)

            return TokenSuccess(
                access=access_token,
                refresh=new_refresh,
                expires=expires_ms,
                email=profile.email,
                name=profile.name,
                project_id=profile.project_id or DEFAULT_PROJECT_ID,
            )
    except Exception as exc:
        return TokenFailure(reason=f"Token refresh request failed: {exc}")


def parse_authorization_input(raw: str) -> dict:
    """Parse manual input which may be a raw code or full callback URL."""
    cleaned = raw.strip()
    if not cleaned:
        return {}

    if cleaned.startswith("http://") or cleaned.startswith("https://"):
        try:
            parsed = urlparse(cleaned)
            qs = parse_qs(parsed.query)
            code = qs.get("code", [None])[0]
            state = qs.get("state", [None])[0]
            return {"code": code, "state": state}
        except Exception:
            pass

    if "#" in cleaned and not cleaned.startswith("#"):
        parts = cleaned.split("#", 1)
        return {"code": parts[0].strip(), "state": parts[1].strip()}

    return {"code": cleaned, "state": None}


def detect_and_load_local_gemini_credentials() -> Optional[TokenSuccess]:
    """
    Check if ~/.gemini/oauth_creds.json exists on the local machine and load it.
    Returns TokenSuccess if found and valid.
    """
    home = Path.home()
    creds_path = home / ".gemini" / "oauth_creds.json"
    if not creds_path.is_file():
        return None

    try:
        with open(creds_path, "r", encoding="utf-8") as f:
            creds = json.load(f)

        access_token = creds.get("access_token")
        refresh_token = creds.get("refresh_token") or ""
        expiry_date = creds.get("expiry_date") or 0
        id_token = creds.get("id_token")

        if not access_token:
            return None

        # Check google_accounts.json for email
        email = None
        accounts_path = home / ".gemini" / "google_accounts.json"
        if accounts_path.is_file():
            try:
                with open(accounts_path, "r", encoding="utf-8") as af:
                    acct_data = json.load(af)
                    email = acct_data.get("active")
            except Exception:
                pass

        profile = get_account_profile_from_token(access_token, id_token)
        resolved_email = email or profile.email

        # If expired or near expiry and refresh token exists, refresh it now
        now_ms = int(time.time() * 1000)
        if refresh_token and (expiry_date <= now_ms + 60_000):
            refreshed = refresh_access_token(refresh_token)
            if isinstance(refreshed, TokenSuccess):
                return refreshed

        return TokenSuccess(
            access=access_token,
            refresh=refresh_token,
            expires=int(expiry_date) if expiry_date else (now_ms + 3600 * 1000),
            email=resolved_email,
            name=profile.name,
            project_id=DEFAULT_PROJECT_ID,
        )
    except Exception:
        return None
