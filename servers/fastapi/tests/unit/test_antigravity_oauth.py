from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.v1.ppt.endpoints.antigravity_auth import ANTIGRAVITY_AUTH_ROUTER
from enums.image_provider import ImageProvider
from enums.llm_provider import LLMProvider
from enums.web_search_provider import WebSearchProvider
from utils.image_provider import is_antigravity_image_selected
from utils.llm_provider import is_antigravity_selected
from utils.oauth.antigravity import (
    CLIENT_ID_DEFAULT,
    DEFAULT_REDIRECT_URI,
    create_authorization_flow,
    parse_authorization_input,
)
from utils.web_search import supports_native_web_search


def test_create_authorization_flow():
    flow = create_authorization_flow()
    assert flow.url.startswith("https://accounts.google.com/o/oauth2/auth")
    assert f"client_id={CLIENT_ID_DEFAULT}" in flow.url
    assert "redirect_uri=http%3A%2F%2Flocalhost%3A51121%2Foauth-callback" in flow.url
    assert "code_challenge=" in flow.url
    assert "code_challenge_method=S256" in flow.url
    assert flow.verifier is not None
    assert len(flow.verifier) > 20
    assert flow.state is not None


def test_parse_authorization_input():
    # 1. Plain code
    parsed = parse_authorization_input("4/0AeanS0...")
    assert parsed["code"] == "4/0AeanS0..."

    # 2. Redirect URL
    url = f"http://localhost:51121/oauth-callback?code=my_auth_code_123&state=state_abc"
    parsed_url = parse_authorization_input(url)
    assert parsed_url["code"] == "my_auth_code_123"
    assert parsed_url["state"] == "state_abc"

    # 3. Fragment / query combination
    parsed_fragment = parse_authorization_input("my_code#state_123")
    assert parsed_fragment["code"] == "my_code"
    assert parsed_fragment["state"] == "state_123"


def test_antigravity_provider_checks(monkeypatch):
    from utils import image_provider, llm_provider

    monkeypatch.setattr(llm_provider, "get_llm_provider_env", lambda: "antigravity")
    assert is_antigravity_selected() is True

    monkeypatch.setattr(image_provider, "get_image_provider_env", lambda: "antigravity")
    assert is_antigravity_image_selected() is True

    assert supports_native_web_search(LLMProvider.ANTIGRAVITY) is True


def test_antigravity_auth_status_endpoint():
    app = FastAPI()
    app.include_router(ANTIGRAVITY_AUTH_ROUTER)
    client = TestClient(app)
    response = client.get("/antigravity/auth/status")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "local_creds_available" in data
