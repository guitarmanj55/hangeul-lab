/* Hangeul Lab service worker: works offline once opened online.
   The page, data.js, srs.js and korean.js are network-first so updates arrive as soon as you're online; audio,
   icons and fonts are cache-first. Bump CACHE when audio/ is regenerated so the
   new clips are precached for offline use. */
var CACHE = "hangeullab-v10";
/* Vendored Google Fonts (fonts/fonts.css), precached so text looks right offline. */
var FONTS = ["fonts/fonts.css","fonts/Fraunces-0.woff2","fonts/Fraunces-1.woff2","fonts/IBMPlexMono-2.woff2","fonts/IBMPlexMono-3.woff2","fonts/IBMPlexMono-4.woff2","fonts/IBMPlexMono-5.woff2","fonts/IBMPlexMono-6.woff2","fonts/IBMPlexMono-7.woff2","fonts/NotoSansKR-8.woff2","fonts/NotoSansKR-9.woff2","fonts/NotoSansKR-10.woff2","fonts/NotoSansKR-11.woff2","fonts/NotoSansKR-12.woff2","fonts/NotoSansKR-13.woff2","fonts/NotoSansKR-14.woff2","fonts/NotoSansKR-15.woff2","fonts/NotoSansKR-16.woff2","fonts/NotoSansKR-17.woff2","fonts/NotoSansKR-18.woff2","fonts/NotoSansKR-19.woff2","fonts/NotoSansKR-20.woff2","fonts/NotoSansKR-21.woff2","fonts/NotoSansKR-22.woff2","fonts/NotoSansKR-23.woff2","fonts/NotoSansKR-24.woff2","fonts/NotoSansKR-25.woff2","fonts/NotoSansKR-26.woff2","fonts/NotoSansKR-27.woff2","fonts/NotoSansKR-28.woff2","fonts/NotoSansKR-29.woff2","fonts/NotoSansKR-30.woff2","fonts/NotoSansKR-31.woff2","fonts/NotoSansKR-32.woff2","fonts/NotoSansKR-33.woff2","fonts/NotoSansKR-34.woff2","fonts/NotoSansKR-35.woff2","fonts/NotoSansKR-36.woff2","fonts/NotoSansKR-37.woff2","fonts/NotoSansKR-38.woff2","fonts/NotoSerifKR-39.woff2","fonts/NotoSerifKR-40.woff2","fonts/NotoSerifKR-41.woff2","fonts/NotoSerifKR-42.woff2","fonts/NotoSerifKR-43.woff2","fonts/NotoSerifKR-44.woff2","fonts/NotoSerifKR-45.woff2","fonts/NotoSerifKR-46.woff2","fonts/NotoSerifKR-47.woff2","fonts/NotoSerifKR-48.woff2","fonts/NotoSerifKR-49.woff2","fonts/NotoSerifKR-50.woff2","fonts/NotoSerifKR-51.woff2","fonts/NotoSerifKR-52.woff2","fonts/NotoSerifKR-53.woff2","fonts/NotoSerifKR-54.woff2","fonts/NotoSerifKR-55.woff2","fonts/NotoSerifKR-56.woff2","fonts/NotoSerifKR-57.woff2","fonts/NotoSerifKR-58.woff2","fonts/NotoSerifKR-59.woff2","fonts/NotoSerifKR-60.woff2","fonts/NotoSerifKR-61.woff2","fonts/NotoSerifKR-62.woff2","fonts/NotoSerifKR-63.woff2","fonts/NotoSerifKR-64.woff2","fonts/NotoSerifKR-65.woff2","fonts/NotoSerifKR-66.woff2","fonts/NotoSerifKR-67.woff2","fonts/NotoSerifKR-68.woff2","fonts/NotoSerifKR-69.woff2"];
var SHELL = [
  "./",
  "index.html",
  "data.js",
  "srs.js",
  "korean.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(cache){
    /* no-cache: revalidate with the server, so the browser's HTTP cache can't hand back an older page or data.js. */
    return cache.addAll(SHELL.concat(FONTS).map(function(u){ return new Request(u, {cache:"no-cache"}); })).then(function(){
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
    return Promise.all(keys.filter(function(k){ return k !== CACHE && k.indexOf("hangeullab-") === 0; }).map(function(k){ return caches.delete(k); }));
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
  /* GitHub Pages lets browsers reuse files for 10 minutes; no-cache asks the server each time (a cheap check when unchanged),
     so index.html, data.js, srs.js and korean.js never come from different releases. */
  return fetch(req.url, {cache:"no-cache", credentials:"same-origin"}).then(function(res){
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
    if(req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/data.js") || url.pathname.endsWith("/srs.js") || url.pathname.endsWith("/korean.js") || url.pathname.endsWith(".webmanifest")) e.respondWith(networkFirst(req));
    else e.respondWith(cacheFirst(req));
  }
});
