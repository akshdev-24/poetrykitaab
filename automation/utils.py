import json
import re
import time
import unicodedata
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

from .config import MAX_RETRIES, REQUEST_TIMEOUT


def http_json(url: str, *, method: str = "GET", headers=None, payload=None) -> dict:
    body = None
    request_headers = {"User-Agent": "PoetryKitaab-Automation/1.0"}
    if headers:
        request_headers.update(headers)
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        request_headers.setdefault("Content-Type", "application/json")

    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            req = Request(url, data=body, headers=request_headers, method=method)
            with urlopen(req, timeout=REQUEST_TIMEOUT) as response:
                return json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            if attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"HTTP request failed after retries: {last_error}")


def http_bytes(url: str) -> bytes:
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            req = Request(url, headers={"User-Agent": "PoetryKitaab-Automation/1.0"})
            with urlopen(req, timeout=REQUEST_TIMEOUT) as response:
                return response.read()
        except (HTTPError, URLError, TimeoutError) as exc:
            last_error = exc
            if attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"Image download failed after retries: {last_error}")


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"^-+|-+$", "", value)[:90] or "poetrykitaab-post"


def read_json(path: Path, default: Any):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def write_json(path: Path, data: Any):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
