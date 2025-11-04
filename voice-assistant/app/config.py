"""Pydantic settings module for the voice assistant service."""

from __future__ import annotations

from functools import lru_cache
from typing import Tuple

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide configuration loaded from the environment."""

    openai_api_key: str = Field(..., alias="OPENAI_API_KEY")

    default_language: str = Field(
        "ur",
        alias="DEFAULT_LANGUAGE",
        description="ISO 639-1 code for the default interaction language.",
    )
    llm_model: str = Field(
        "gpt-5-mini",
        alias="LLM_MODEL",
        description="Text generation model used for reasoning.",
    )
    stt_model: str = Field(
        "whisper-1",
        alias="STT_MODEL",
        description="Speech-to-text (Whisper) model identifier.",
    )
    tts_model: str = Field(
        "gpt-4o-mini-tts",
        alias="TTS_MODEL",
        description="Text-to-speech model identifier.",
    )
    tts_voice: str = Field(
        "alloy",
        alias="TTS_VOICE",
        description="Preferred OpenAI voice preset for TTS output.",
    )
    tts_format: str = Field(
        "mp3",
        alias="TTS_FORMAT",
        description="Audio container/codec for synthesized speech.",
    )

    max_audio_seconds: int = Field(
        90,
        alias="MAX_AUDIO_SECONDS",
        description="Hard cap on incoming audio duration (seconds).",
    )
    allowed_audio_mime_types: Tuple[str, ...] = Field(
        (
            "audio/wav",
            "audio/x-wav",
            "audio/webm",
            "audio/mpeg",
            "audio/mp3",
            "audio/ogg",
            "audio/flac",
        ),
        alias="ALLOWED_AUDIO_MIME_TYPES",
        description="Accepted MIME types for uploaded farmer audio clips.",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance."""

    return Settings()  # type: ignore[call-arg]


