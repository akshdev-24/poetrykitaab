from .utils import slugify


def build_seo(post: dict) -> dict:
    title = str(post["title"]).strip()
    description = str(post["description"]).strip()
    slug = slugify(title)
    return {
        "slug": slug,
        "title": title[:120],
        "description": description[:160],
    }
