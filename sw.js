// Service Worker المحدّث لمنصة مدرسة العلم (Network-First للصفحات لضمان ظهور أي تعديل على GitHub فوراً)
const CACHE_NAME = 'al3lm-pwa-v10';
const CORE_ASSETS = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isHTMLOrJS = req.mode === 'navigate' ||
                     url.pathname.endsWith('.html') ||
                     url.pathname.endsWith('.js') ||
                     url.pathname === '/';

  // الشبكة أولاً لملفات HTML و JS لكي يرى الهاتف أي تحديث يرفع على GitHub فوراً، مع الاحتفاظ بنسخة للعمل دون إنترنت
  if (isHTMLOrJS) {
    event.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then((netRes) => {
          if (netRes && netRes.ok) {
            const copy = netRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return netRes;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // الكاش أولاً للصور والأيقونات لسرعة الفتح
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((netRes) => {
        const copy = netRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return netRes;
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || 'student.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
