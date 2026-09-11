import re
from difflib import SequenceMatcher
from pathlib import Path

from .config import CONTENT_DIR


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def existing_texts():
    texts = []
    if not CONTENT_DIR.exists():
        return texts
    for path in CONTENT_DIR.glob("*.json"):
        try:
            import json
            data = json.loads(path.read_text(encoding="utf-8"))
            if data.get("text"):
                texts.append(normalize(str(data["text"])))
        except Exception:
            continue
    return texts


def validate(post: dict, threshold: float = 0.82):
    required = ["text", "title", "description", "tags", "image_keywords", "category"]
    if any(not post.get(key) for key in required):
        return False, "missing_required_field"
    text = str(post["text"]).strip()
    if len(text) < 45 or len(text) > 1200:
        return False, "text_length_out_of_range"
    if len(post["tags"]) < 2 or len(post["image_keywords"]) < 1:
        return False, "insufficient_metadata"
    if len(set(normalize(text).split())) < 8:
        return False, "low_information_content"

    normalized = normalize(text)
    for old in existing_texts():
        if normalized == old:
            return False, "exact_duplicate"
        if SequenceMatcher(None, normalized, old).ratio() >= threshold:
            return False, "near_duplicate"

    # Simple guard against accidental lyric/quote framing.
    blocked = ["lyrics", "song lyrics", "source:", "via pinterest"]
    lower = text.lower()
    if any(x in lower for x in blocked):
        return False, "possible_copied_content"
    return True, "ok"
