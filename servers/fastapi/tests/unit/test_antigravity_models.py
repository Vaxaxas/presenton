import pytest

from constants.llm import DEFAULT_ANTIGRAVITY_MODEL, SUPPORTED_ANTIGRAVITY_MODELS
from enums.llm_provider import LLMProvider
from utils import llm_provider


@pytest.mark.parametrize(
    "model",
    [
        "gemini-3-pro-high",
        "gemini-3-pro-low",
        "claude-sonnet-4-6",
        "claude-opus-4-6-thinking",
        "gemini-2.5-flash",
        "gemini-2.5-pro",
    ],
)
def test_antigravity_model_is_preserved(monkeypatch, model):
    monkeypatch.setattr(llm_provider, "get_llm_provider", lambda: LLMProvider.ANTIGRAVITY)
    monkeypatch.setattr(llm_provider, "get_antigravity_model_env", lambda: model)

    assert model in SUPPORTED_ANTIGRAVITY_MODELS
    assert llm_provider.get_model() == model


@pytest.mark.parametrize("model", ["unknown-model-xyz", "random-llm"])
def test_antigravity_unsupported_model_falls_back_to_default(monkeypatch, model):
    monkeypatch.setattr(llm_provider, "get_llm_provider", lambda: LLMProvider.ANTIGRAVITY)
    monkeypatch.setattr(llm_provider, "get_antigravity_model_env", lambda: model)

    assert DEFAULT_ANTIGRAVITY_MODEL == "gemini-3-pro-high"
    assert model not in SUPPORTED_ANTIGRAVITY_MODELS
    assert llm_provider.get_model() == DEFAULT_ANTIGRAVITY_MODEL


def test_normalize_antigravity_model():
    from utils.antigravity_client import normalize_antigravity_model

    assert normalize_antigravity_model("gemini-3-pro-high") == "gemini-pro-agent"
    assert normalize_antigravity_model("gemini-3.1-pro-high") == "gemini-pro-agent"
    assert normalize_antigravity_model("gemini-3-pro-low") == "gemini-3.1-pro-low"
    assert normalize_antigravity_model("claude-sonnet") == "claude-sonnet-4-6"
    assert normalize_antigravity_model("claude-opus") == "claude-opus-4-6-thinking"
    assert normalize_antigravity_model("gemini-2.5-flash") == "gemini-2.5-flash"


def test_antigravity_models_adapter_build_payload():
    from google.genai import types
    from utils.antigravity_client import AntigravityModelsAdapter

    adapter = AntigravityModelsAdapter(access_token="test-token", project_id="test-proj")
    contents = [types.Content(role="user", parts=[types.Part(text="Hello Antigravity")])]
    config = types.GenerateContentConfig(
        temperature=0.3,
        max_output_tokens=100,
        system_instruction="You are a helpful assistant.",
        response_mime_type="application/json",
    )

    payload = adapter._build_payload("gemini-3-pro-high", contents, config)
    assert payload["project"] == "test-proj"
    assert payload["model"] == "gemini-pro-agent"
    req = payload["request"]
    assert req["contents"][0]["role"] == "user"
    assert req["contents"][0]["parts"][0]["text"] == "Hello Antigravity"
    assert req["generationConfig"]["temperature"] == 0.3
    assert req["generationConfig"]["maxOutputTokens"] == 100
    assert req["generationConfig"]["responseMimeType"] == "application/json"
    assert req["systemInstruction"] == {"parts": [{"text": "You are a helpful assistant."}]}

