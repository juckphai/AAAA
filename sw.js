// sw.js - Service Worker Loader
try {
  importScripts('./service-worker.js');
} catch (e) {
  console.error('Error importing service worker script:', e);
  
  // Fallback basic service worker
  self.addEventListener('install', event => {
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    self.clients.claim();
  });
}