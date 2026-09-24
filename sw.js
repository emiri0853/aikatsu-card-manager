const C='aikatsu-manager-v4';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./manifest.webmanifest']))) });
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/aikatsu-card-manager/')){
    e.respondWith(fetch(e.request).then(async r=>{
      let html=await r.text();
      const css=`<style id="card-display-fix">
.card .card-image-stage{width:100%;aspect-ratio:476/670;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#f3edf0}
.card .card-image-stage>img{display:block;object-fit:contain;background:transparent;margin:0;max-height:none}
.card .card-image-stage>img.normal-card{width:100%;height:100%;object-fit:contain}
.card .card-image-stage>img.accessory-card{width:140.76%;height:auto;max-width:none;transform:rotate(90deg)}
@media(min-width:700px){.grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
</style>`;
      const js=`<script id="accessory-orientation-script">(()=>{function fix(){document.querySelectorAll('.card>img:not([data-oriented])').forEach(img=>{img.dataset.oriented='1';const wrap=document.createElement('div');wrap.className='card-image-stage';img.parentNode.insertBefore(wrap,img);wrap.appendChild(img);const orient=()=>{img.classList.toggle('accessory-card',img.naturalWidth>img.naturalHeight);img.classList.toggle('normal-card',img.naturalWidth<=img.naturalHeight)};img.complete?orient():img.addEventListener('load',orient,{once:true})})}new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});fix()})()</script>`;
      html=html.replace('</head>',css+'</head>').replace('</body>',js+'</body>');
      return new Response(html,{status:r.status,statusText:r.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache'}})
    }).catch(()=>caches.match('./index.html')))
  }
});