/* Hangeul Lab service worker: works offline once opened online.
   The page is network-first so updates arrive as soon as you're online; audio,
   icons and fonts are cache-first. Bump CACHE when audio/ is regenerated so the
   new clips are precached for offline use. */
var CACHE = "hangeullab-v1";
var SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(cache){
    return cache.addAll(SHELL).then(function(){
      return fetch("audio/index.json", {cache:"no-cache"}).then(function(r){ return r.json(); }).then(function(idx){
        var urls = Object.keys(idx.clips).map(function(h){ return "audio/" + h + ".mp3"; });
        /* One missing clip shouldn't block install, so add them individually. */
        return Promise.all(urls.map(function(u){ return cache.add(u).catch(function(){}); }));
      }).catch(function(){});
    });
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

function cacheFirst(req){
  return caches.match(req).then(function(hit){
    return hit || fetch(req).then(function(res){
      if(res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
      return res;
    });
  });
}
function networkFirst(req){
  return fetch(req).then(function(res){
    if(res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
    return res;
  }).catch(function(){
    return caches.match(req).then(function(hit){ return hit || caches.match("index.html"); });
  });
}

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);
  if(url.origin === location.origin){
    if(req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith(".webmanifest")) e.respondWith(networkFirst(req));
    else e.respondWith(cacheFirst(req));
  } else if(url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"){
    e.respondWith(cacheFirst(req));
  }
});
