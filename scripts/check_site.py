"""Validate local page links and assets: python scripts/check_site.py."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

sys.dont_write_bytecode = True
from check_images import check

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = []
        self.refs = []
        self.errors = []
        self.headings = 0
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "h1":
            self.headings += 1
        if tag == "img" and not attrs.get("alt"):
            self.errors.append("image has no description")
        for key in ("href", "src", "data-audio"):
            if key in attrs:
                self.refs.append(attrs[key])


pages = {p.resolve(): Page(p) for p in [*ROOT.glob("*.html"), *ROOT.glob("compare/*.html")]}
errors = []
references = 0
for path, page in pages.items():
    if len(page.ids) != len(set(page.ids)):
        page.errors.append("duplicate element IDs")
    if page.headings != 1:
        page.errors.append("expected one main heading")
    for ref in page.refs:
        parts = urlsplit(ref)
        if parts.scheme or parts.netloc:
            continue
        target = (path.parent / unquote(parts.path)).resolve() if parts.path else path
        if parts.path:
            problem = check(path, ref)
            if problem:
                page.errors.append(f"{problem}: {ref}")
        if parts.fragment and target in pages and parts.fragment not in pages[target].ids:
            page.errors.append(f"missing anchor: {ref}")
        references += 1
    errors.extend(f"{path.name}: {error}" for error in page.errors)
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"PASS: {len(pages)} pages, {references} local references; unique IDs, anchors, image descriptions and headings.")
