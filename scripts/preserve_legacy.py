"""Build the frozen legacy site once, or verify its recorded contents."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib
import json
import posixpath
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "legacy"
COMMIT = "728fc8b4c3a27221ee279235027589345b15c916"
URL = re.compile(r"url\(\s*['\"]?(.*?)['\"]?\s*\)")


def references(name, data, allow_current_links=False):
    refs = []
    class Parser(HTMLParser):
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            refs.extend(attrs[k] for k in ("src", "href") if attrs.get(k))
            refs.extend(URL.findall(attrs.get("style", "")))
    if name.endswith(".html"):
        Parser().feed(data.decode("utf-8"))
    elif name.endswith(".css"):
        refs.extend(URL.findall(re.sub(r"/\*.*?\*/", "", data.decode("utf-8"), flags=re.S)))
    local, external = [], []
    for ref in refs:
        parsed = urlsplit(ref)
        if parsed.scheme or parsed.netloc:
            if parsed.scheme in ("http", "https"):
                external.append(ref)
            continue
        if not parsed.path:
            continue
        path = posixpath.normpath(posixpath.join(posixpath.dirname(name), unquote(parsed.path)))
        # Approved footer navigation is the only dependency outside the archive.
        if allow_current_links and name.endswith(".html") and path == "../" + name:
            if not (ROOT / name).is_file():
                raise ValueError(f"Missing current portfolio page: {name}")
            continue
        if path.startswith(("/", "../")):
            raise ValueError(f"Unsafe path: {name}: {ref}")
        local.append(path)
    return local, external


def verify():
    manifest = json.loads((ARCHIVE / "snapshot.json").read_text(encoding="utf-8"))
    errors = []
    amendments_path = ARCHIVE / "amendments.json"
    amendments = json.loads(amendments_path.read_text(encoding="utf-8"))["files"] if amendments_path.exists() else {}
    for name, amendment in amendments.items():
        if name not in manifest["files"] or amendment["original_sha256"] != manifest["files"][name]["sha256"]:
            errors.append(f"Amendment has no matching original snapshot: {name}")
    for name, metadata in manifest["files"].items():
        path = ARCHIVE / name
        if not path.is_file():
            errors.append(f"Missing: {name}")
            continue
        data = path.read_bytes()
        expected = amendments.get(name, metadata)
        if hashlib.sha256(data).hexdigest() != expected["sha256"]:
            errors.append(f"Changed: {name}")
        for ref in references(name, data, allow_current_links=True)[0]:
            if ref not in manifest["files"]:
                errors.append(f"Unpreserved dependency: {name}: {ref}")
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"PASS: {len(manifest['files'])} legacy files and their local dependencies, including {len(amendments)} documented amendments.")


if __name__ == "__main__":
    if "--verify" in sys.argv:
        verify()
    else:
        if ARCHIVE.exists():
            raise SystemExit("Archive already exists. Use --verify; do not overwrite the snapshot.")
        names = subprocess.check_output(["git", "ls-tree", "--name-only", COMMIT], cwd=ROOT).decode().splitlines()
        pending = [n for n in names if n.endswith(".html")]
        files, external = {}, set()
        while pending:
            name = pending.pop()
            if name in files:
                continue
            data = subprocess.check_output(["git", "show", f"{COMMIT}:{name}"], cwd=ROOT)
            target = ARCHIVE / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            files[name] = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
            dependencies, urls = references(name, data)
            pending.extend(dependencies)
            external.update(urls)
        manifest = {"source_commit": COMMIT, "description": "Original design after image repairs and performance improvements, before the redesign.", "files": dict(sorted(files.items())), "external_urls": sorted(external)}
        (ARCHIVE / "snapshot.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        verify()
