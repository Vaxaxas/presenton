"""
Antigravity Client for LLM generation via Google Antigravity OAuth Gateway.
Routes requests to the internal Cloud Code / Antigravity PredictionService gateway
(https://daily-cloudcode-pa.googleapis.com/v1internal:generateContent and streamGenerateContent)
using the user's Antigravity OAuth Bearer token.
"""
from __future__ import annotations

import json
import logging
from typing import Any, Iterator, Literal, Optional

from google.genai import types
import httpx
from llmai.google.client import GoogleClient
from llmai.shared import BaseClientConfig
from llmai.shared.base import BaseClient
import llmai

LOGGER = logging.getLogger(__name__)

PRIMARY_GATEWAY_URL = "https://daily-cloudcode-pa.googleapis.com/v1internal"
FALLBACK_GATEWAY_URL = "https://cloudcode-pa.googleapis.com/v1internal"

# Known model aliases mapping to Antigravity internal model names
MODEL_ALIASES: dict[str, str] = {
    "gemini-3-pro-high": "gemini-pro-agent",
    "gemini-3.1-pro-high": "gemini-pro-agent",
    "gemini-3-pro-low": "gemini-3.1-pro-low",
    "claude-sonnet": "claude-sonnet-4-6",
    "claude-opus": "claude-opus-4-6-thinking",
    "gemini-flash": "gemini-2.5-flash",
    "gemini-pro": "gemini-2.5-pro",
}


def normalize_antigravity_model(model: str) -> str:
    """Map friendly model names to the exact model IDs expected by Antigravity."""
    clean_model = (model or "").strip()
    return MODEL_ALIASES.get(clean_model, clean_model)


class AntigravityClientConfig(BaseClientConfig):
    provider: Literal["antigravity"] = "antigravity"
    access_token: str
    project_id: Optional[str] = "rising-fact-p41fc"
    base_url: Optional[str] = None


class AntigravityModelsAdapter:
    """Adapter implementing generate_content and generate_content_stream for Antigravity Gateway."""

    def __init__(
        self,
        *,
        access_token: str,
        project_id: Optional[str] = None,
        base_url: Optional[str] = None,
    ):
        self.access_token = access_token
        self.project_id = project_id or "rising-fact-p41fc"
        self.base_url = (base_url or PRIMARY_GATEWAY_URL).rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "User-Agent": "antigravity/1.18.3 windows/amd64",
        }

    def _build_payload(
        self,
        model: str,
        contents: Any,
        config: Optional[types.GenerateContentConfig] = None,
    ) -> dict[str, Any]:
        target_model = normalize_antigravity_model(model)

        serialized_contents: list[dict[str, Any]] = []
        if isinstance(contents, (list, tuple)):
            for item in contents:
                if hasattr(item, "model_dump"):
                    serialized_contents.append(item.model_dump(by_alias=True, exclude_none=True))
                elif isinstance(item, dict):
                    serialized_contents.append(item)
                else:
                    serialized_contents.append({"role": "user", "parts": [{"text": str(item)}]})
        elif hasattr(contents, "model_dump"):
            serialized_contents.append(contents.model_dump(by_alias=True, exclude_none=True))
        elif isinstance(contents, dict):
            serialized_contents.append(contents)
        else:
            serialized_contents.append({"role": "user", "parts": [{"text": str(contents)}]})

        request_body: dict[str, Any] = {"contents": serialized_contents}

        if config is not None:
            cfg_dump = (
                config.model_dump(by_alias=True, exclude_none=True)
                if hasattr(config, "model_dump")
                else {}
            )

            gen_config: dict[str, Any] = {}
            for k in [
                "temperature",
                "maxOutputTokens",
                "responseMimeType",
                "responseSchema",
                "thinkingConfig",
                "topP",
                "topK",
                "stopSequences",
            ]:
                if k in cfg_dump:
                    gen_config[k] = cfg_dump[k]
            if gen_config:
                request_body["generationConfig"] = gen_config

            if "systemInstruction" in cfg_dump:
                si = cfg_dump["systemInstruction"]
                if isinstance(si, str):
                    request_body["systemInstruction"] = {"parts": [{"text": si}]}
                elif isinstance(si, dict):
                    request_body["systemInstruction"] = si
                elif hasattr(si, "model_dump"):
                    request_body["systemInstruction"] = si.model_dump(
                        by_alias=True, exclude_none=True
                    )

            if "tools" in cfg_dump:
                request_body["tools"] = cfg_dump["tools"]

        return {
            "project": self.project_id,
            "model": target_model,
            "request": request_body,
        }

    def _post(self, endpoint: str, payload: dict[str, Any], *, timeout: float = 60.0) -> httpx.Response:
        url = f"{self.base_url}{endpoint}"
        try:
            res = httpx.post(url, headers=self.headers, json=payload, timeout=timeout)
            if res.status_code < 400:
                return res
            # If 404 or host issue on daily, fallback to primary cloudcode-pa
            if res.status_code in (404, 502, 503) and self.base_url == PRIMARY_GATEWAY_URL:
                fallback_url = f"{FALLBACK_GATEWAY_URL}{endpoint}"
                LOGGER.info("Falling back to %s", fallback_url)
                res = httpx.post(fallback_url, headers=self.headers, json=payload, timeout=timeout)
            return res
        except httpx.RequestError as exc:
            if self.base_url == PRIMARY_GATEWAY_URL:
                fallback_url = f"{FALLBACK_GATEWAY_URL}{endpoint}"
                LOGGER.warning("Request failed on %s (%s), trying fallback %s", url, exc, fallback_url)
                return httpx.post(fallback_url, headers=self.headers, json=payload, timeout=timeout)
            raise

    def generate_content(
        self,
        *,
        model: str,
        contents: Any,
        config: Optional[types.GenerateContentConfig] = None,
    ) -> types.GenerateContentResponse:
        payload = self._build_payload(model, contents, config)
        res = self._post(":generateContent", payload, timeout=60.0)
        if res.status_code >= 400:
            raise RuntimeError(
                f"Antigravity API request failed [{res.status_code}]: {res.text[:300]}"
            )
        data = res.json()
        resp_payload = data.get("response", {})
        return types.GenerateContentResponse.model_validate(resp_payload)

    def generate_content_stream(
        self,
        *,
        model: str,
        contents: Any,
        config: Optional[types.GenerateContentConfig] = None,
    ) -> Iterator[types.GenerateContentResponse]:
        payload = self._build_payload(model, contents, config)
        url = f"{self.base_url}:streamGenerateContent?alt=sse"

        def _stream(target_url: str):
            with httpx.stream("POST", target_url, headers=self.headers, json=payload, timeout=90.0) as res:
                if res.status_code >= 400:
                    raise RuntimeError(
                        f"Antigravity stream failed [{res.status_code}]: {res.read().decode('utf-8', errors='ignore')[:300]}"
                    )
                for line in res.iter_lines():
                    if line.startswith("data: "):
                        raw_data = line[6:].strip()
                        if not raw_data or raw_data == "[DONE]":
                            continue
                        try:
                            line_json = json.loads(raw_data)
                            resp_dict = line_json.get("response", {})
                            if resp_dict:
                                yield types.GenerateContentResponse.model_validate(resp_dict)
                        except json.JSONDecodeError:
                            continue

        try:
            yield from _stream(url)
        except Exception as exc:
            if self.base_url == PRIMARY_GATEWAY_URL:
                fallback_url = f"{FALLBACK_GATEWAY_URL}:streamGenerateContent?alt=sse"
                LOGGER.warning("Stream failed on %s (%s), trying fallback", url, exc)
                yield from _stream(fallback_url)
            else:
                raise


class MockGenAIClient:
    def __init__(
        self,
        *,
        access_token: str,
        project_id: Optional[str] = None,
        base_url: Optional[str] = None,
    ):
        self.models = AntigravityModelsAdapter(
            access_token=access_token,
            project_id=project_id,
            base_url=base_url,
        )


class AntigravityClient(GoogleClient):
    PROVIDER_NAME = "antigravity"

    def __init__(
        self,
        *,
        config: AntigravityClientConfig,
        logger=None,
    ):
        BaseClient.__init__(self, logger=logger, generation_defaults=config.generation)
        self.config = config
        self._client = MockGenAIClient(
            access_token=config.access_token,
            project_id=config.project_id,
            base_url=config.base_url,
        )


import sys
import llmai.client

_original_get_client = llmai.client.get_client
_original_supports_thinking = getattr(llmai, "supports_thinking", None)


def _antigravity_get_client(*, config, logger=None):
    if getattr(config, "provider", None) == "antigravity":
        return AntigravityClient(config=config, logger=logger)
    return _original_get_client(config=config, logger=logger)


def _antigravity_supports_thinking(model: str, *, provider: Optional[str] = None):
    if provider == "antigravity":
        provider = "google"
    if _original_supports_thinking is not None:
        return _original_supports_thinking(model, provider=provider)
    return False


def register_antigravity_client():
    """Patch llmai.get_client, llmai.client.get_client, and all imported modules to support provider == 'antigravity'."""
    llmai.get_client = _antigravity_get_client
    llmai.client.get_client = _antigravity_get_client
    llmai.supports_thinking = _antigravity_supports_thinking

    # Patch any modules that have already imported get_client via `from llmai import get_client`
    for mod in list(sys.modules.values()):
        if mod and hasattr(mod, "get_client"):
            current = getattr(mod, "get_client")
            if current is not _antigravity_get_client and callable(current):
                mod_name = getattr(current, "__module__", "")
                if "llmai" in mod_name or getattr(current, "__name__", "") == "get_client":
                    try:
                        setattr(mod, "get_client", _antigravity_get_client)
                    except Exception:
                        pass
