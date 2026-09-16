const CACHE_NAME = 'acceso-seguro-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  // Si tienes archivos de estilos o scripts separados, agrégalos aquí:
  // './style.css',
  // './script.js'
];

// 1. Instalación del Service Worker y guardado en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché guardados con éxito');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Interceptar las peticiones para que cargue offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, lo devuelve; si no, lo busca en la red
        return response || fetch(event.request);
      })
  );
});

// 3. Activar y limpiar versiones viejas de caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});