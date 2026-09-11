import argparse
import sys
from datetime import datetime, timezone

from .ai_engine import generate_post
from .config import CONTENT_DIR, DATA_DIR, GENERATED_DIR, POSTS_PER_RUN
from .image_engine import download_image, search_pexels
from .image_processor import render_image
from .publisher import audit, publish
from .quality_filter import validate
from .seo_engine import build_seo
from .topic_engine import select_topics


def make_post(topic):
    for attempt in range(3):
        draft = generate_post(topic)
        ok, reason = validate(draft)
        if not ok:
            if attempt == 2:
                raise RuntimeError(f"quality check failed: {reason}")
            continue
        seo = build_seo(draft)
        source = search_pexels(draft["image_keywords"])
        image_bytes = download_image(source)
        image_path = render_image(image_bytes, draft["text"], seo["slug"])
        post = {
            "id": f"pk-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}",
            "slug": seo["slug"],
            "category": draft["category"],
            "text": draft["text"].strip(),
            "title": seo["title"],
            "description": seo["description"],
            "tags": list(dict.fromkeys([draft["category"].lower()] + [str(x).strip().lower() for x in draft["tags"]]))[:12],
            "image_path": image_path,
            "source_image_id": source["source_image_id"],
            "source_url": source["source_url"],
            "license": source["license"],
            "attribution": source["attribution"],
            "created_at": draft["created_at"],
            "image_provider": source["provider"],
        }
        return post
    raise RuntimeError("Unable to generate a valid post")


def main():
    parser = argparse.ArgumentParser(description="Generate PoetryKitaab content")
    parser.add_argument("--dry-run", action="store_true", help="Generate and validate without writing files")
    parser.add_argument("--count", type=int, default=POSTS_PER_RUN)
    args = parser.parse_args()

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)

    topics = select_topics(max(1, args.count))
    success = 0
    failures = 0
    for topic in topics:
        try:
            post = make_post(topic)
            if args.dry_run:
                print(f"DRY RUN: {post['slug']}")
                audit(post, "dry_run")
            else:
                publish(post)
                audit(post, "published")
                print(f"PUBLISHED: {post['slug']}")
            success += 1
        except Exception as exc:
            failures += 1
            print(f"FAILED [{topic.get('topic')}]: {exc}", file=sys.stderr)
    print(f"Finished: {success} successful, {failures} failed")
    if failures and success == 0:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
