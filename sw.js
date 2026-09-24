const C='aikatsu-manager-v5';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./manifest.webmanifest']))) });
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/aikatsu-card-manager/')){
    e.respondWith(fetch(e.request).then(async r=>{
      let html=await r.text();
      const css=`<style id="card-display-fix">
.grid{align-items:start}
.card{overflow:hidden}
.card .card-image-stage{width:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:transparent}
.card .card-image-stage>img{display:block;margin:0;background:transparent;object-fit:contain;max-width:100%;max-height:none}
.card .card-image-stage>img.normal-card{width:100%;height:auto}
.card .card-image-stage>img.accessory-card{width:100%;height:auto;transform:none}
.card.image-missing .card-image-stage{display:none}
@media(min-width:700px){.grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
</style>`;
      const js=`<script id="card-image-script">(()=>{function fix(){document.querySelectorAll('.card>img:not([data-oriented])').forEach(img=>{img.dataset.oriented='1';const card=img.closest('.card');const wrap=document.createElement('div');wrap.className='card-image-stage';img.parentNode.insertBefore(wrap,img);wrap.appendChild(img);const orient=()=>{card&&card.classList.remove('image-missing');img.classList.toggle('accessory-card',img.naturalWidth>img.naturalHeight);img.classList.toggle('normal-card',img.naturalWidth<=img.naturalHeight)};const missing=()=>{card&&card.classList.add('image-missing')};img.addEventListener('load',orient,{once:true});img.addEventListener('error',missing,{once:true});if(img.complete){img.naturalWidth?orient():missing()}})}new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});fix()})()</script>`;
      html=html.replace('</head>',css+'</head>').replace('</body>',js+'</body>');
      return new Response(html,{status:r.status,statusText:r.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache'}})
    }).catch(()=>caches.match('./index.html')))
  }
});