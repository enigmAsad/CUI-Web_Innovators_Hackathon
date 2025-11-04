# Voice Assistant Microservice

Language-first assistant for Pakistani farmers that accepts spoken questions, reasons with OpenAI GPT-5 models, and replies with synthesized speech. Built with FastAPI, LangGraph, and the OpenAI Python SDK.

## Features
- Urdu-first voice loop: Whisper speech-to-text, GPT-5 reasoning, and OpenAI TTS.
- Stateless FastAPI endpoint (`/v1/voice-interact`) returning transcript, text reply, and base64 audio.
- Modular LangGraph workflow so additional tools (market prices, weather) can be slotted in later.
- Typed configuration via Pydantic settings with sensible defaults.

## Quickstart
```bash
cd @voice-assistant
python -m venv .venv
.\.venv\Scripts\activate   # Windows PowerShell
pip install -e .[dev]        # or pip install -r requirements.txt once generated

uvicorn app.main:app --reload
```

### Environment variables
Create `.env` (or configure your secrets manager):

```
OPENAI_API_KEY=sk-...
DEFAULT_LANGUAGE=ur
LLM_MODEL=gpt-5-mini
STT_MODEL=whisper-1
TTS_MODEL=gpt-4o-mini-tts
TTS_VOICE=alloy
```

## Example Request
```bash
curl -X POST "http://localhost:8001/v1/voice-interact?language=ur" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@sample.wav;type=audio/wav"
```

Response:
```json
{
  "language": "ur",
  "transcript": "آج ٹماٹر کا ریٹ کیا ہے؟",
  "response_text": "آج لاہور کی منڈی میں ٹماٹر تقریباً 220 روپے فی کلو فروخت ہو رہا ہے...",
  "audio_base64": "<base64-encoded-mp3>",
  "metadata": {
    "stt_model": "whisper-1",
    "tts_model": "gpt-4o-mini-tts",
    "confidence": 0.89
  }
}
```

## Project Layout
```
app/
  main.py              # FastAPI entry and router wiring
  routes.py            # API endpoints
  config.py            # Pydantic settings
  schemas.py           # Pydantic request/response models
  services/
    openai_client.py   # Thin OpenAI client wrapper
  graph/
    voice_graph.py     # LangGraph workflow definition
tests/
  test_graph.py        # Mocked pipeline sanity checks
```

## Next Steps
- Integrate with core backend via internal HTTP call.
- Add caching for frequent price questions.
- Persist opt-in farmer profiles for personalization.


