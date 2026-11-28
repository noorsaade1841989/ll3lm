// المشغل الخدمي الهجين لمنصة «مدرسة العلم»:
// ١. في النسخ المحلية (APK / EXE / LAN): يقرأ التحديثات المسحوبة محلياً (IndexedDB Delta Overrides) ثم ذاكرة الجهاز دون صرف إنترنت.
// ٢. على الموقع الرسمي (al-3lm.org): يعمل بـ Network-First للصفحات + يشغّل إشعارات الجرس اليومي للتلميذ.

const CACHE_NAME = 'al3lm-pwa-v15';
const DB_NAME = 'al3lm_mesh_db';
const IS_LOCAL_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/i.test(self.location.hostname)
                    || self.location.hostname.endsWith('.local');

const CORE_ASSETS = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

function getDeltaOverrideFromIDB(pathname) {
  return new Promise((resolve) => {
    if (!('indexedDB' in self)) return resolve(null);
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
    };
    req.onsuccess = () => {
      try {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) return resolve(null);
        const key = pathname === '/' ? '/index.html' : pathname;
        const tx = db.transaction('files', 'readonly');
        const g = tx.objectStore('files').get(key);
        g.onsuccess = () => {
          const rec = g.result;
          if (rec && rec.blob) {
            const headers = {};
            if (rec.contentType) headers['Content-Type'] = rec.contentType;
            resolve(new Response(rec.blob, { status: 200, headers }));
          } else {
            resolve(null);
          }
        };
        g.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}

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
  } else if (d.type === 'AL3LM_MANUAL_UPDATE_NOW' || d.type === 'AL3LM_CLEAR_STATIC_CACHE_ONLY') {
    event.waitUntil(caches.delete(CACHE_NAME));
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.endsWith('/version.json') ||
    url.pathname.endsWith('/update-manifest.json') ||
    url.pathname.startsWith('/mesh-')
  ) {
    return;
  }

  if (IS_LOCAL_HOST) {
    event.respondWith((async () => {
      const overrideResp = await getDeltaOverrideFromIDB(url.pathname);
      if (overrideResp) return overrideResp;

      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;

      const netRes = await fetch(req);
      if (netRes && netRes.ok) {
        const copy = netRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
      }
      return netRes;
    })());
    return;
  }

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
