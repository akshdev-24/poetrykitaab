import json
import re
from datetime import datetime, timezone

from .config import GEMINI_API_KEY, GEMINI_MODEL, LANGUAGE, SITE_NAME
from .utils import http_json


def _extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.I)
    text = re.sub(r"\s*```$", "", text)
    match = re.search(r"\{.*\}", text, flags=re.S)
    if not match:
        raise ValueError("Gemini did not return a JSON object")
    return json.loads(match.group(0))


def generate_post(topic: dict) -> dict:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    prompt = f"""
You are the original editorial writer for {SITE_NAME}.
Create ONE original short poetry/status post for a general Indian audience.

Category: {topic['category_name']}
Topic: {topic['topic']}
Tone: {topic.get('tone', 'emotional and thoughtful')}
Language: {LANGUAGE}

Rules:
- Write completely original text. Do not reproduce or imitate a known poem, quote, song lyric, or web text.
- Prefer natural Hindi/Hinglish suitable for social sharing.
- Avoid keyword stuffing.
- Keep the main text meaningful and concise: 4-10 lines.
- Return ONLY valid JSON. No markdown.

JSON schema:
{{
  "text": "...",
  "title": "...",
  "description": "...",
  "tags": ["..."],
  "image_keywords": ["...", "..."]
}}
""".strip()

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.9,
            "responseMimeType": "application/json",
        },
    }
    data = http_json(url, method="POST", payload=payload)
    try:
        raw = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError(f"Unexpected Gemini response: {type(exc).__name__}") from exc

    result = _extract_json(raw)
    result["category"] = topic["category"]
    result["created_at"] = datetime.now(timezone.utc).isoformat()
    return result
