#!/usr/bin/env python3
"""Builds catalog.json (the hub's list) from the crawl in ref/. English pages only (no /xx/ language prefix)."""
import glob, html, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, "ref")
SITE = "https://www.onworks.net"
LANG = re.compile(r"^[a-z]{2}(-[A-Za-z]{2,4})?$")

def kind_of(rel):
    p = rel.split("/")
    if p[0] == "os-distributions":
        if len(p) == 4: return ("Programs" if p[1] == "programs" else "OS: " + p[1].replace("-", " ").title())
    if p[0] == "software" and len(p) == 4: return "Software: " + p[1].title()
    return None

def parse(text, rel):
    title = re.search(r"<title>(.*?)</title>", text, re.S)
    title = html.unescape(title.group(1)).strip() if title else rel.split("/")[-2]
    title = re.sub(r"\s*[-|]\s*Online in the Cloud.*$", "", title).strip()
    title = re.sub(r"\s+download for (Linux|Windows)\s*$", "", title, flags=re.I)
    desc = re.search(r'<meta name="description" content="(.*?)"', text, re.S)
    img = re.search(r'"@type":\s*"Product".*?"image":\s*"([^"]+)"', text, re.S)
    slug = re.search(r"[?&;]os=([A-Za-z0-9._\-]+)", text)
    return {
        "id": rel.split("/")[-2],
        "name": title,
        "kind": kind_of(rel),
        "desc": html.unescape(desc.group(1)).strip()[:200] if desc else "",
        "icon": img.group(1) if img else "",
        "page": SITE + "/" + "/".join(rel.split("/")[:-1]) + "/",
        "os": slug.group(1) if slug else "",
    }

def build(ref=REF):
    items, seen = [], set()
    for f in sorted(glob.glob(os.path.join(ref, "*", "*", "*", "index.html"))):
        rel = os.path.relpath(f, ref).replace(os.sep, "/")
        if LANG.match(rel.split("/")[0]) or not kind_of(rel): continue
        it = parse(open(f, errors="ignore").read(), rel)
        if it["id"] in seen or it["id"] in ("index",): continue
        seen.add(it["id"]); items.append(it)
    return sorted(items, key=lambda x: (x["kind"], x["name"].lower()))

if __name__ == "__main__":
    items = build()
    json.dump({"site": SITE, "items": items}, open(os.path.join(ROOT, "catalog.json"), "w"), indent=1)
    print(f"{len(items)} items -> catalog.json")
