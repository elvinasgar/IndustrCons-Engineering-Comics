/* ============================================================
   IndustrCons Engineering Comics — Service Worker
   Caches the app shell so the whole experience works offline
   after the first visit. Bump CACHE_NAME whenever files change
   so returning visitors get the fresh version.
   ============================================================ */
const CACHE_NAME = "industrcons-comics-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./illustrations.js",
  "./data.js",
  "./data-extra.js",
  "./app.js",
  "./assets/logo.png",
  "./assets/logo-og.jpg"
];

self.addEventListener("install", (event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event)=>{
  if(event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if(networkResponse && networkResponse.status === 200){
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(()=> cached);
      return cached || fetchPromise;
    })
  );
});
