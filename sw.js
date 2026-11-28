// المشغل الخدمي لمنصة مدرسة العلم:
// ١. على الموقع الرسمي (al-3lm.org): يعمل كما كان تماماً (Network-First للصفحات + إشعارات الجرس الأصلية)
// ٢. في النسخة المحلية فقط (localhost / LAN): يعمل بـ Cache-First ولا يسحب إنترنت إلا بالطلب

const CACHE_NAME = 'al3lm-pwa-v14';
const IS_LOCAL_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/i.test(self.location.hostname);

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

self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.type === 'SHOW_ALARM_NOTIFICATION') {
    const title = d.title || 'مدرسة العلم 🌟';
    const options = {
      body: d.body || 'حان موعد درسك الجديد في مدرسة العلم!',
      icon: './icon-192.png',
      badge: './icon-192.png',
      dir: 'rtl',
      lang: 'ar',
      tag: d.tag || ('al3lm-alarm-' + Date.now()),
      renotify: true,
      vibrate: [220, 100, 220, 100, 320],
      data: { url: d.url || './student.html' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } else if (d.type === 'AL3LM_MANUAL_UPDATE_NOW') {
    event.waitUntil(caches.delete(CACHE_NAME));
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/version.json')) return;

  // في النسخة المحلية فقط: الاعتماد على الملفات المحلية أولاً دون صرف إنترنت
  if (IS_LOCAL_HOST) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((netRes) => {
          if (netRes && netRes.ok) {
            const copy = netRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return netRes;
        });
      })
    );
    return;
  }

  // على الموقع الرسمي (الويب): السلوك الأصلي تماماً (Network-First لملفات HTML و JS ليرى الزوار أي تعديل فوراً)
  const isHTMLOrJS = req.mode === 'navigate' ||
                     url.pathname.endsWith('.html') ||
                     url.pathname.endsWith('.js') ||
                     url.pathname === '/';

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

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((netRes) => {
        if (netRes && netRes.ok) {
          const copy = netRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return netRes;
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './student.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('student.html') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
