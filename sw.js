// Legacy service worker cleanup.
// The app now loads its UI directly from index.html instead of rewriting pages here.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach(client => client.navigate(client.url));
  })());
});
self.addEventListener('fetch', () => {});
