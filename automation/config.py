import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "posts"
GENERATED_DIR = ROOT / "public" / "generated"
DATA_DIR = ROOT / "data"
LOG_FILE = DATA_DIR / "generated-log.json"

POSTS_PER_RUN = int(os.getenv("POSTS_PER_RUN", "10"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "").strip()

SITE_NAME = "PoetryKitaab"
SITE_URL = os.getenv("SITE_URL", "https://poetrykitaab.pages.dev").rstrip("/")
LANGUAGE = os.getenv("CONTENT_LANGUAGE", "hi").strip().lower()
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))
