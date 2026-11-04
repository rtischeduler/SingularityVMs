#!/usr/bin/env python3
"""
Crawls CRAWL_URL (default https://www.onworks.net) and everything it references on the same
site (www/non-www treated as one origin) into ref/, keeping every file's path.
Writes ref/_manifest.json (url -> file path, type, size) and ref/_paths.txt (one path per line).
"""
import json, os, re, sys, time, urllib.request, urllib.parse, urllib.error, hashlib
from html.parser import HTMLParser
from collections import deque

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "ref")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
MAX_FILES = int(os.environ.get("MAX_FILES") or 2000)
DELAY = float(os.environ.get("DELAY") or 0.2)
CRAWL_URL = (os.environ.get("CRAWL_URL") or "https://www.onworks.net").strip()
_u = urllib.parse.urlparse(CRAWL_URL)
if _u.scheme not in ("http", "https") or not _u.netloc:
    sys.exit(f"CRAWL_URL must be a full http(s) URL, got {CRAWL_URL!r}")
HOST = _u.netloc.lower().removeprefix("www.")

def same_site(url):
    p = urllib.parse.urlparse(url)
    return p.scheme in ("http", "https") and p.netloc.lower().removeprefix("www.") == HOST

def http(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.geturl(), r.headers.get("Content-Type", ""), r.read()

class Links(HTMLParser):
    def __init__(self): super().__init__(); self.urls = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for k in ("src", "href", "data-src", "poster", "content"):
            v = a.get(k)
            if v and (k != "content" or v.startswith(("/", "./", "http"))): self.urls.append(v)
        if a.get("srcset"):
            self.urls += [p.strip().split()[0] for p in a["srcset"].split(",") if p.strip()]

EXT = r"(?:js|mjs|css|json|wasm|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|otf|mp3|mp4|webm|txt|xml|map|zip|gz|bz2|xz|7z|iso|img|ova|vmdk|qcow2|deb|rpm|exe|msi)"
STR_RE = re.compile(r"""["'`]((?:\.{0,2}/)?[\w\-./@%~+]+\.""" + EXT + r""")(?:\?[^"'`\s]*)?["'`]""")
CSS_URL = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)")
CSS_IMP = re.compile(r"@import\s+['\"]([^'\"]+)['\"]")

def local_path(url, ctype=""):
    p = urllib.parse.urlparse(url)
    path = p.path
    if path.endswith("/") or path == "": path += "index.html"
    elif "html" in ctype.lower() and not os.path.splitext(path)[1]: path += "/index.html"
    path = path.lstrip("/")
    if p.query:
        stem, ext = os.path.splitext(path)
        path = f"{stem}__{hashlib.md5(p.query.encode()).hexdigest()[:8]}{ext}"
    return os.path.normpath(os.path.join(OUT, path))

def norm(u):
    p = urllib.parse.urlparse(u)
    return urllib.parse.urlunparse(p._replace(fragment=""))

def crawl(start):
    seen, manifest, q = set(), [], deque([start])
    while q and len(manifest) < MAX_FILES:
        url = q.popleft(); key = norm(url)
        if key in seen: continue
        seen.add(key)
        try: final, ctype, data = http(url)
        except Exception as e:
            print(f"  skip {key}: {e}", file=sys.stderr); continue
        if not same_site(final): continue
        dest = local_path(norm(final), ctype)
        if not dest.startswith(OUT): continue
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "wb").write(data)
        manifest.append({"url": key, "file": os.path.relpath(dest, ROOT), "type": ctype, "bytes": len(data)})
        print(f"  saved {key} ({len(data)} B)")
        time.sleep(DELAY)
        c = ctype.lower()
        if not (any(t in c for t in ("html", "javascript", "css", "json", "text", "xml")) or dest.endswith((".js", ".css", ".html", ".json", ".xml"))):
            continue
        text = data.decode("utf-8", "ignore")
        found = []
        if "html" in c:
            lp = Links(); lp.feed(text); found += lp.urls
        found += CSS_URL.findall(text) + CSS_IMP.findall(text) + STR_RE.findall(text)
        for f in found:
            if f.startswith(("data:", "blob:", "javascript:", "mailto:", "tel:", "#")): continue
            nu = urllib.parse.urljoin(final, f.strip())
            if same_site(nu) and norm(nu) not in seen: q.append(nu)
    return manifest

if __name__ == "__main__":
    print(f"crawling {CRAWL_URL} (site {HOST}, max {MAX_FILES})")
    os.makedirs(OUT, exist_ok=True)
    manifest = crawl(CRAWL_URL)
    if not manifest:
        sys.exit(f"nothing saved: could not fetch {CRAWL_URL}")
    json.dump({"site": HOST, "start": CRAWL_URL, "files": manifest}, open(os.path.join(OUT, "_manifest.json"), "w"), indent=2)
    open(os.path.join(OUT, "_paths.txt"), "w").write("\n".join(sorted(m["file"] for m in manifest)) + "\n")
    print(f"done: {len(manifest)} files -> ref/")
