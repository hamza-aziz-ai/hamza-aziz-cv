"""Pre-merge checks for the static CV site; exits 1 on any failure.

1. index.html tags balance (every opened element is closed, in order).
2. Every relative href/src in index.html points at a file in the repo.
3. sitemap.xml is well-formed XML.

Run from the repo root: python .github/scripts/check_site.py
"""
import pathlib
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

ROOT = pathlib.Path(__file__).resolve().parents[2]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "source", "track", "wbr"}
URL_ATTRS = {"href", "src"}


class Checker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.errors, self.refs = [], [], []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in URL_ATTRS and value:
                self.refs.append((self.getpos()[0], value))
        if tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_startendtag(self, tag, attrs):
        # <x/> opens and closes in one go, so only its URLs matter.
        for name, value in attrs:
            if name in URL_ATTRS and value:
                self.refs.append((self.getpos()[0], value))

    def handle_endtag(self, tag):
        line = self.getpos()[0]
        if tag in VOID:
            return
        if not self.stack or self.stack[-1][0] != tag:
            opened = f"<{self.stack[-1][0]}> from line {self.stack[-1][1]}" if self.stack else "nothing"
            self.errors.append(f"index.html:{line}: </{tag}> closes {opened}")
            # Recover if the tag is open further down, so one slip is one error.
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break
            return
        self.stack.pop()


def local_path(url):
    """The repo file a relative URL points at, or None for external/root/anchor links."""
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or url.startswith(("/", "#")):
        return None
    return unquote(parts.path) or None


def main():
    errors = []
    checker = Checker()
    checker.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    checker.close()
    errors += checker.errors
    errors += [f"index.html:{line}: <{tag}> never closed" for tag, line in checker.stack]

    for line, url in checker.refs:
        path = local_path(url)
        if path and not (ROOT / path).is_file():
            errors.append(f"index.html:{line}: {url} -> missing file {path}")

    try:
        ET.parse(ROOT / "sitemap.xml")
    except ET.ParseError as e:
        errors.append(f"sitemap.xml: {e}")

    for e in errors:
        print(f"::error::{e}")
    print(f"{len(errors)} problem(s); {len(checker.refs)} URLs checked")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
