import json
from pathlib import Path

from .config import DATA_DIR


def load_topics():
    path = DATA_DIR / "topics.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return data.get("topics", [])


def load_categories():
    path = DATA_DIR / "categories.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return data.get("categories", [])


def select_topics(count: int):
    topics = load_topics()
    categories = load_categories()
    if not topics:
        raise RuntimeError("data/topics.json contains no topics")

    selected = []
    for i in range(count):
        item = topics[i % len(topics)].copy()
        category = categories[i % len(categories)] if categories else {"id": "quotes", "name": "Quotes"}
        item["category"] = category["id"]
        item["category_name"] = category["name"]
        selected.append(item)
    return selected
