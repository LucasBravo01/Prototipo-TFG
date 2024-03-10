const STATIC_CACHE = "static-v1";

const APP_SHELL = [
  '/',
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  e.waitUntil(cacheStatic);
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((res) => {
        return res || fetch(e.request);
      })
      .catch(console.log)
  );
  //e.waitUntil(response);
});

///////////////////////////////////////
// NOTIFICACIONES
///////////////////////////////////////

self.addEventListener('push', e => {
  const payload = e.data.json();
  
  console.log('Payload:');
  console.log(payload);

  const options = {
    body: payload.body,
    icon: './images/TareApp-logo.png',
    requireInteraction: true,
    visibility: 'public',
    priority: 'max',
  }

  e.waitUntil(
      self.registration.showNotification('TareApp', options)
  );
});