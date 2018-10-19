const staticCacheName = 'mws-restaurant-static-cache-v1';
self.addEventListener('install', function(event) {
  // TODO: cache /skeleton rather than the root page

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'css/styles.css',
        'js/main_bundle.js',
        'js/restaurant_bundle.js'
      ]);
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-restaurant-') && cacheName != staticCacheName;
        })
        .map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request,{ignoreSearch:true}).then(function(cachedResponse) {
      return cachedResponse || fetch(event.request).then(function(response) {
        return caches.open(staticCacheName).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});

//Source - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers


