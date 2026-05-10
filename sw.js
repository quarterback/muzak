// Put Me On — service worker.
// Strategy: precache the app shell, network-first for the world-atlas TopoJSON
// (so map updates flow through), cache-first for everything else same-origin.
// Bump CACHE_VERSION when shipping changes.

const CACHE_VERSION = "putmeon-v3";
const SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest",
  "./logo.svg",
  "./icon.svg",
  "./icon-maskable.svg",
  "./social-card.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Network-first for the world atlas (small file, but updates matter)
  if (url.host === "unpkg.com" && url.pathname.includes("world-atlas")) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Cache-first for same-origin shell + assets
  if (sameOrigin) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Stale-while-revalidate for cross-origin libs (d3, topojson-client)
  event.respondWith(staleWhileRevalidate(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    // offline fallback to the shell index
    const fallback = await caches.match("./index.html");
    if (fallback) return fallback;
    throw err;
  }
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    const cached = await caches.match(req);
    if (cached) return cached;
    throw err;
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}
