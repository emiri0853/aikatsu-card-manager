const VERSION='v17';
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);
  if(u.origin!==location.origin)return;
  if(event.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/aikatsu-card-manager/')){
    event.respondWith((async()=>{
      const r=await fetch(event.request,{cache:'no-store'});
      let html=await r.text();
      const head=`<link rel="stylesheet" href="./ui-v15.css?${VERSION}"><link rel="stylesheet" href="./scanner.css?${VERSION}">`;
      const body=`<script src="./ui-v15.js?${VERSION}"></script><script src="./scanner.js?${VERSION}"></script>`;
      if(!html.includes('ui-v15.css'))html=html.replace('</head>',head+'</head>');
      if(!html.includes('scanner.js'))html=html.replace('</body>',body+'</body>');
      return new Response(html,{status:r.status,statusText:r.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate'}});
    })());
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}));
});
