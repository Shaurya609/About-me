"""Rebuild web images from preserved originals. Requires Pillow.

Run: python scripts/optimize_images.py
The manifest records source files, output sizes and encoder settings.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "Images/optimized/manifest.json"


def build(entry):
    with Image.open(ROOT / entry["source"]) as source:
        image = ImageOps.exif_transpose(source)
        if entry["max_edge"]:
            image.thumbnail((entry["max_edge"], entry["max_edge"]), Image.Resampling.LANCZOS)
        image = image.convert("RGBA" if "A" in image.getbands() or "transparency" in image.info else "RGB")
        output = ROOT / entry["output"]
        output.parent.mkdir(parents=True, exist_ok=True)
        if output.suffix == ".png":
            image.save(output, optimize=True)
        else:
            image.save(output, "WEBP", quality=84, method=6)
        entry.update(width=image.width, height=image.height,
                     original_bytes=(ROOT / entry["source"]).stat().st_size,
                     optimized_bytes=output.stat().st_size)


if __name__ == "__main__":
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for entry in entries:
        build(entry)
    MANIFEST.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")
    print(f"Built {len(entries)} optimized images.")
