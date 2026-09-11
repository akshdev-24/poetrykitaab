from urllib.parse import quote

from .config import PEXELS_API_KEY
from .utils import http_bytes, http_json


def search_pexels(keywords: list[str]) -> dict:
    if not PEXELS_API_KEY:
        raise RuntimeError("PEXELS_API_KEY is not configured")
    query = " ".join(keywords[:4])
    url = "https://api.pexels.com/v1/search?query=" + quote(query) + "&per_page=10&orientation=portrait"
    data = http_json(url, headers={"Authorization": PEXELS_API_KEY})
    photos = data.get("photos") or []
    if not photos:
        raise RuntimeError("Pexels returned no usable images")
    photo = photos[0]
    return {
        "provider": "Pexels",
        "source_image_id": str(photo.get("id")),
        "source_url": photo.get("url", ""),
        "download_url": photo.get("src", {}).get("original") or photo.get("src", {}).get("large2x"),
        "license": "Pexels License — verify current provider terms before commercial redistribution",
        "attribution": f"Photo via Pexels (ID {photo.get('id')})",
    }


def download_image(source: dict) -> bytes:
    if not source.get("download_url"):
        raise RuntimeError("Image source has no download URL")
    return http_bytes(source["download_url"])
