// In-tab OnWorks host: fetches pages through the libcurl/Wisp proxy and renders them into THIS document
// (document.open/write) - no iframes. fetch / XHR / WebSocket made by the page are tunnelled through the
// proxy, links and forms navigate in-tab, and embedded frames are inlined as plain elements.
import { getProxy } from "./proxy/proxy.mjs";

const HOME = location.origin + location.pathname;
const OWN = location.origin;
const AD = /googletagservices|googlesyndication|a-ads\.com|adsbygoogle|doubleclick|cloudflareinsights|pagead|adsterra|popads|propeller/i;
let px = null, cur = "";

const abs = (u, b) => { try { return new URL(u, b || cur || location.href).href; } catch { return null; } };
const rewriteLoc = (t) => t
  .replace(/\b(?:window\.|top\.|self\.|document\.)?location(?:\.href)?\s*=(?!=)\s*([^;\n]+)/g, "__svm.go($1)")
  .replace(/\blocation\.(?:replace|assign)\(/g, "__svm.go(");

function say(t, ms) {
  let e = document.getElementById("svm-ld");
  if (!e) {
    e = document.createElement("div"); e.id = "svm-ld";
    e.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#171a22;color:#e8eaf0;border:1px solid #262b38;padding:10px 16px;border-radius:12px;font:14px system-ui,sans-serif;z-index:2147483647;max-width:90vw";
    (document.body || document.documentElement).append(e);
  }
  e.textContent = t;
  if (ms) setTimeout(() => e.remove(), ms);
}

function absolutize(doc, base) {
  doc.querySelectorAll("[src],[href],[action],[poster],[data-src]").forEach((n) => {
    for (const a of ["src", "href", "action", "poster", "data-src"]) {
      const v = n.getAttribute(a);
      if (!v || /^(#|javascript:|data:|mailto:|tel:|blob:|about:)/i.test(v)) continue;
      const u = abs(v, base); if (u) n.setAttribute(a, u);
    }
  });
}

function clean(doc) {
  doc.querySelectorAll("script[src]").forEach((s) => { if (AD.test(s.getAttribute("src"))) s.remove(); });
  doc.querySelectorAll("iframe,frame").forEach((f) => {
    const s = f.getAttribute("src") || "";
    if (!s || AD.test(s) || /^(about:|javascript:)/i.test(s)) { f.remove(); return; }
    const d = doc.createElement("div");
    d.setAttribute("data-svm-frame", s); d.className = f.className; if (f.id) d.id = f.id;
    d.setAttribute("style", f.getAttribute("style") || ""); f.replaceWith(d);
  });
  doc.querySelectorAll("embed,object").forEach((n) => n.remove());
  doc.querySelectorAll("script:not([src])").forEach((s) => { s.textContent = rewriteLoc(s.textContent); });
}

const revive = (s) => {
  const n = document.createElement("script");
  [...s.attributes].forEach((a) => n.setAttribute(a.name, a.value));
  n.textContent = s.textContent; s.replaceWith(n);
};

async function inlineFrames() {
  for (const d of [...document.querySelectorAll("div[data-svm-frame]")]) {
    try {
      const src = d.getAttribute("data-svm-frame");
      const r = await px.libcurl.fetch(src, { headers: { Accept: "text/html" } });
      const doc = new DOMParser().parseFromString(await r.text(), "text/html");
      const b = r.url || src; absolutize(doc, b); clean(doc);
      const frag = document.createDocumentFragment();
      doc.head.querySelectorAll("style,link[rel=stylesheet],script").forEach((n) => frag.append(document.importNode(n, true)));
      [...doc.body.childNodes].forEach((n) => frag.append(document.importNode(n, true)));
      d.removeAttribute("data-svm-frame"); d.replaceChildren(frag);
      d.querySelectorAll("script").forEach(revive);
      inlineFrames();
    } catch (e) { d.textContent = "Couldn't load embedded view: " + (e && e.message || e); }
  }
}

function XHRShim() {
  this._h = {}; this._l = {}; this._rh = new Headers(); this.readyState = 0; this.status = 0; this.statusText = "";
  this.responseText = ""; this.response = ""; this.responseType = ""; this.responseURL = ""; this.timeout = 0; this.withCredentials = false; this.upload = {};
}
Object.assign(XHRShim.prototype, {
  open(m, u) { this._m = m; this._u = abs(u, document.baseURI); this.readyState = 1; this._ev("readystatechange"); },
  setRequestHeader(k, v) { this._h[k] = v; },
  overrideMimeType() {}, getResponseHeader(k) { return this._rh.get(k); },
  getAllResponseHeaders() { let s = ""; this._rh.forEach((v, k) => { s += k + ": " + v + "\r\n"; }); return s; },
  addEventListener(t, f) { (this._l[t] ||= []).push(f); }, removeEventListener(t, f) { this._l[t] = (this._l[t] || []).filter((x) => x !== f); },
  abort() { this._ab = true; },
  _ev(t) { const e = { type: t, target: this, currentTarget: this }; const h = this["on" + t]; if (h) h.call(this, e); (this._l[t] || []).forEach((f) => f.call(this, e)); },
  send(body) {
    const lc = px.libcurl;
    const init = { method: this._m, headers: this._h }; if (body != null && !/^(GET|HEAD)$/i.test(this._m)) init.body = body;
    lc.fetch(this._u, init).then(async (r) => {
      if (this._ab) return;
      this.status = r.status; this.statusText = r.statusText || ""; this._rh = r.headers; this.responseURL = r.url || this._u;
      this.readyState = 2; this._ev("readystatechange");
      const rt = this.responseType;
      if (rt === "arraybuffer") this.response = await r.arrayBuffer();
      else if (rt === "blob") this.response = await r.blob();
      else { this.responseText = await r.text(); this.response = rt === "json" ? JSON.parse(this.responseText) : this.responseText; }
      this.readyState = 4; this._ev("readystatechange"); this._ev("load"); this._ev("loadend");
    }).catch(() => { this.readyState = 4; this._ev("readystatechange"); this._ev("error"); this._ev("loadend"); });
  },
});

export function patch() {
  const lc = px && px.libcurl; if (!lc) return;
  const nf = (window.__svmFetch ||= window.fetch.bind(window));
  window.fetch = async (i, init) => {
    const isReq = typeof Request !== "undefined" && i instanceof Request;
    const u = abs(isReq ? i.url : String(i), document.baseURI);
    if (!u || u.startsWith(OWN)) return nf(i, init);
    if (isReq && !init) init = { method: i.method, headers: i.headers, body: /^(GET|HEAD)$/i.test(i.method) ? undefined : await i.arrayBuffer() };
    return lc.fetch(u, init);
  };
  window.XMLHttpRequest = XHRShim;
  const W = function (u, p) { return new lc.WebSocket(abs(u, document.baseURI), p); };
  Object.assign(W, { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }); W.prototype = lc.WebSocket.prototype;
  window.WebSocket = W;
  window.open = (u) => { if (u && !AD.test(u)) go(abs(u, document.baseURI)); return null; };
}

function listeners() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.button) return;
    const h = a.getAttribute("href");
    if (/^(javascript:|mailto:|tel:|blob:|data:)/i.test(h)) return;
    e.preventDefault();
    if (h.startsWith("#")) { const t = document.getElementById(h.slice(1)); if (t) t.scrollIntoView(); return; }
    go(a.href);
  });
  document.addEventListener("submit", (e) => {
    const f = e.target; if (e.defaultPrevented) return; e.preventDefault();
    const m = (f.getAttribute("method") || "get").toLowerCase();
    const act = abs(f.getAttribute("action") || "", document.baseURI) || cur;
    const fd = new FormData(f); if (e.submitter && e.submitter.name) fd.append(e.submitter.name, e.submitter.value);
    const qs = new URLSearchParams([...fd].filter(([, v]) => typeof v === "string"));
    if (m === "post") go(act, { init: { method: "POST", body: qs.toString(), headers: { "Content-Type": "application/x-www-form-urlencoded" } } });
    else { const u = new URL(act); qs.forEach((v, k) => u.searchParams.set(k, v)); go(u.href); }
  });
  window.addEventListener("popstate", (e) => { if (e.state && e.state.u) go(e.state.u, { push: false }); else location.reload(); });
}

function bar() {
  const b = document.createElement("div");
  b.style.cssText = "position:fixed;right:10px;bottom:10px;display:flex;gap:6px;z-index:2147483646;opacity:.85";
  const mk = (t, f) => { const x = document.createElement("button"); x.textContent = t; x.onclick = f; x.style.cssText = "border:1px solid #262b38;background:#171a22;color:#e8eaf0;border-radius:9px;padding:6px 10px;font:13px system-ui,sans-serif;cursor:pointer"; return x; };
  b.append(mk("Hub", () => { location.href = HOME; }), mk("Reload", () => go(cur, { push: false })));
  document.body.append(b);
}

function render(html, url, push) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const ref = doc.querySelector('meta[http-equiv="refresh" i]');
  absolutize(doc, url); clean(doc);
  const base = doc.createElement("base"); base.href = url;
  const shim = doc.createElement("script"); shim.textContent = "window.__svm&&window.__svm.patch()";
  doc.head.prepend(shim); doc.head.prepend(base);
  cur = url;
  const full = HOME + "?u=" + encodeURIComponent(url);
  if (push) history.pushState({ u: url }, "", full); else history.replaceState({ u: url }, "", full);
  document.open(); document.write("<!DOCTYPE html>" + doc.documentElement.outerHTML); document.close();
  listeners(); bar(); inlineFrames();
  const m = ref && /url\s*=\s*['"]?([^'"\s;]+)/i.exec(ref.getAttribute("content") || "");
  if (m) setTimeout(() => go(abs(m[1], url)), 1000);
}

export async function go(url, { push = true, init } = {}) {
  url = abs(url); if (!url) return;
  try {
    say("Loading " + new URL(url).host + "…");
    px = await getProxy({ say });
    const r = await px.libcurl.fetch(url, { ...init, headers: { Accept: "text/html,*/*", ...(init && init.headers) } });
    const fin = r.url || url, type = r.headers.get("content-type") || "";
    if (type && !/html|xml/i.test(type)) {
      const a = document.createElement("a"); a.href = URL.createObjectURL(await r.blob());
      a.download = fin.split("?")[0].split("/").pop() || "download"; a.click(); say("Downloading…", 3000); return;
    }
    render(await r.text(), fin, push);
  } catch (e) { say("Couldn’t load that through the proxy: " + (e && e.message || e), 7000); }
}

window.__svm = { go, patch };
