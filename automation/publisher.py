import json
from pathlib import Path

from .config import CONTENT_DIR, DATA_DIR, LOG_FILE
from .utils import read_json, write_json


def publish(post: dict):
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    path = CONTENT_DIR / f"{post['slug']}.json"
    if path.exists():
        raise RuntimeError(f"Slug already exists: {post['slug']}")
    path.write_text(json.dumps(post, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return path


def audit(post: dict, status: str, failure_reason: str | None = None):
    logs = read_json(LOG_FILE, [])
    logs.append({
        "id": post.get("id"),
        "slug": post.get("slug"),
        "category": post.get("category"),
        "generated_at": post.get("created_at"),
        "image_provider": post.get("image_provider"),
        "source_image_id": post.get("source_image_id"),
        "status": status,
        "failure_reason": failure_reason,
    })
    write_json(LOG_FILE, logs[-500:])
