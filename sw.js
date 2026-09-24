const C='aikatsu-manager-v8';
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
.card .card-image-stage>img{display:block;margin:0;background:transparent;object-fit:contain;max-height:none}
.card .card-image-stage>img.normal-card{width:100%;height:auto;max-width:100%;transform:none}
.card .card-image-stage.accessory-stage{aspect-ratio:476/670}
.card .card-image-stage>img.accessory-card{width:auto;height:auto;max-width:none;transform:rotate(90deg) scale(1.075)}
.card.image-missing .card-image-stage{display:none}
@media(min-width:700px){.grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
@media(max-width:699px){
  header{padding-bottom:14px!important}
  header>div:first-of-type{gap:10px!important}
  header input{border-radius:16px!important}
  header button{border-radius:16px!important}
  header>div:nth-of-type(2){display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:7px!important;width:100%!important;margin-top:10px!important}
  header>div:nth-of-type(2)>button{min-width:0!important;width:100%!important;padding:10px 2px!important;white-space:nowrap!important;font-size:14px!important;line-height:1.15!important;border-radius:999px!important;height:40px!important}
  header>div:nth-of-type(2)>select{grid-column:1/-1!important;width:100%!important;height:42px!important;border-radius:999px!important;padding:0 18px!important;text-align:center!important;background-color:#fff!important}
  header>div:nth-of-type(2)>button.active,header>div:nth-of-type(2)>button[style*="background"]{box-shadow:0 4px 12px rgba(255,105,160,.18)!important}
}
</style>`;
      const js=`<script id="card-image-script">(()=>{const BASE='https://dcd.aikatsu.com/encore/images/cardlist/card/';function fallbacks(img){const alt=(img.alt||'').trim();if(!/^E1-(81|82)$/.test(alt))return[];return [BASE+alt+'_R.webp',BASE+alt+'_PR.webp',BASE+alt+'.webp',BASE+alt+'_N.png',BASE+alt+'_R.png',BASE+alt+'_PR.png',BASE+alt+'.png']}function fix(){document.querySelectorAll('.card>img:not([data-oriented])').forEach(img=>{img.dataset.oriented='1';const card=img.closest('.card');const wrap=document.createElement('div');wrap.className='card-image-stage';img.parentNode.insertBefore(wrap,img);wrap.appendChild(img);img._fallbacks=fallbacks(img);img._fallbackIndex=0;const orient=()=>{card&&card.classList.remove('image-missing');const accessory=img.naturalWidth>img.naturalHeight;img.classList.toggle('accessory-card',accessory);img.classList.toggle('normal-card',!accessory);wrap.classList.toggle('accessory-stage',accessory);if(accessory){requestAnimationFrame(()=>{img.style.width=(wrap.clientHeight*1.075)+'px';img.style.height='auto'})}else{img.style.width='';img.style.height=''}};const missing=()=>{if(img._fallbackIndex<img._fallbacks.length){img.src=img._fallbacks[img._fallbackIndex++];return}card&&card.classList.add('image-missing')};img.addEventListener('load',orient);img.addEventListener('error',missing);if(img.complete){img.naturalWidth?orient():missing()}})}new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});fix();window.addEventListener('resize',()=>document.querySelectorAll('.accessory-stage>img.accessory-card').forEach(img=>{img.style.width=(img.parentElement.clientHeight*1.075)+'px'}))})()</script>`;
      html=html.replace('</head>',css+'</head>').replace('</body>',js+'</body>');
      return new Response(html,{status:r.status,statusText:r.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache'}})
    }).catch(()=>caches.match('./index.html')))
  }
});