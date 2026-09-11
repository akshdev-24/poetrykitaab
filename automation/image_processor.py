from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from .config import GENERATED_DIR


def _font(size: int):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def render_image(image_bytes: bytes, text: str, slug: str) -> str:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    target_w, target_h = 1200, 1500
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize((int(image.width * scale), int(image.height * scale)), Image.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    canvas = resized.crop((left, top, left + target_w, top + target_h))

    # Neutral dark overlay for readability; keep the photo recognizable.
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 70))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(canvas)

    font = _font(54)
    max_width = 980
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = (current + " " + word).strip()
        if draw.textbbox((0, 0), test, font=font)[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    lines = lines[:12]

    line_h = 72
    block_h = len(lines) * line_h
    y = (target_h - block_h) // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        x = (target_w - (bbox[2] - bbox[0])) // 2
        # subtle shadow + readable text
        draw.text((x + 3, y + 3), line, font=font, fill=(0, 0, 0, 180))
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
        y += line_h

    out = GENERATED_DIR / f"{slug}.webp"
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(out, "WEBP", quality=88, method=6)
    return f"/generated/{out.name}"
