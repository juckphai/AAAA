// กำหนดชื่อ Cache
const staticCacheName = 'account-app-static-v4';
const dynamicCacheName = 'account-app-dynamic-v3';

// ไฟล์หลักที่ต้อง cache
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './192.png',
  './512.png',
  './sw.js',
  './service-worker.js'
];

// install service worker
self.addEventListener('install', evt => {
  console.log('Service Worker: Installing...');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('Service Worker: Caching shell assets');
      return cache.addAll(assets);
    }).catch(error => {
      console.error('Service Worker: Cache addAll error:', error);
    })
  );
  self.skipWaiting();
});

// activate event
self.addEventListener('activate', evt => {
  console.log('Service Worker: Activating...');
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => {
            console.log('Service Worker: Removing old cache', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// fetch event
self.addEventListener('fetch', evt => {
  // ข้ามการ cache สำหรับ chrome-extension และ external resources
  if (evt.request.url.startsWith('chrome-extension://') || 
      !evt.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // ถ้ามีใน cache ให้ใช้ cache
      if (cacheRes) {
        return cacheRes;
      }
      
      // ถ้าไม่มีใน cache ให้ fetch จาก network
      return fetch(evt.request).then(fetchRes => {
        // ตรวจสอบว่า response ถูกต้องและเป็น same-origin
        if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== 'basic') {
          return fetchRes;
        }
        
        // Clone response ก่อน cache
        const responseToCache = fetchRes.clone();
        
        // เปิด dynamic cache และเก็บ response
        caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request, responseToCache);
        });
        
        return fetchRes;
      });
    }).catch(() => {
      // Fallback สำหรับหน้า HTML
      if (evt.request.destination === 'document' || 
          (evt.request.headers.get('accept') && 
           evt.request.headers.get('accept').includes('text/html'))) {
        return caches.match('./index.html');
      }
    })
  );
});

// Message event สำหรับอัปเดต cache
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});