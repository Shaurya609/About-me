"""Check image references without third-party packages: python scripts/check_images.py."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
URL = re.compile(r"url\(\s*['\"]?(.*?)['\"]?\s*\)")


def references():
    found = []

    class Images(HTMLParser):
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            if tag == "img":
                found.append((self.file, self.getpos()[0], attrs.get("src", "")))
            if tag == "link" and "icon" in attrs.get("rel", "").split():
                found.append((self.file, self.getpos()[0], attrs.get("href", "")))
            for match in URL.finditer(attrs.get("style", "")):
                found.append((self.file, self.getpos()[0], match[1]))

    for file in sorted(ROOT.glob("*.html")):
        parser = Images()
        parser.file = file
        parser.feed(file.read_text(encoding="utf-8"))
    for file in sorted(ROOT.glob("*.css")):
        text = re.sub(r"/\*.*?\*/", lambda m: "\n" * m[0].count("\n"),
                      file.read_text(encoding="utf-8"), flags=re.S)
        for match in URL.finditer(text):
            found.append((file, text[:match.start()].count("\n") + 1, match[1]))
    return found


def check(file, url):
    if not url.strip():
        return "empty image reference"
    parts = urlsplit(url)
    if parts.scheme == "data":
        return None
    if parts.scheme or parts.netloc:
        return "external image dependency; save the image locally"
    if parts.path.startswith("/"):
        return "root-relative image breaks GitHub Pages project hosting"
    path = file.parent / unquote(parts.path)
    if not path.resolve().is_relative_to(ROOT):
        return "image outside the website directory"
    if not path.is_file():
        return "missing image file"
    # Windows accepts mismatched case; GitHub Pages does not.
    current = ROOT
    for part in path.relative_to(ROOT).parts:
        if part == "..":
            current = current.parent
            continue
        if part not in {child.name for child in current.iterdir()}:
            return "filename case does not match the file on disk"
        current /= part
    if path.stat().st_size == 0:
        return "empty image file"
    return None


def main():
    refs = references()
    failures = []
    for file, line, url in refs:
        problem = check(file, url)
        if problem:
            failures.append(f"{file.name}:{line}: {problem}: {url!r}")
    if failures:
        print("\n".join(failures))
        return 1
    print(f"PASS: {len(refs)} image, favicon, and background references across "
          f"{len(list(ROOT.glob('*.html')))} pages resolve to local files with matching case.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
