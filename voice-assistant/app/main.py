"""FastAPI application factory for the voice assistant microservice."""

from __future__ import annotations

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routes import router as voice_router


logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """Instantiate and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="Voice Assistant Service",
        description="Voice-first assistant for Pakistani farmers powered by OpenAI Whisper and GPT-5.",
        version="0.1.0",
        contact={
            "name": "CUI Web Innovators",
            "email": "support@example.com",
        },
    )

    # Allow the core web app and local tools to call this service.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(voice_router)

    @app.on_event("startup")
    async def _startup() -> None:  # pragma: no cover - logging path only
        logger.info(
            "Voice assistant service booting with LLM=%s, STT=%s, TTS=%s",
            settings.llm_model,
            settings.stt_model,
            settings.tts_model,
        )

    return app


app = create_app()


