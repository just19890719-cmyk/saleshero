/* 社畜英雄 離線快取:圖片音效檔(帶版本號)存在手機裡,之後打開不用重新下載 */
const C='shechu-cache-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);if(u.origin!==location.origin)return;
  if(u.pathname.endsWith('.js')&&u.search){
    e.respondWith(caches.open(C).then(async c=>{
      const hit=await c.match(req);if(hit)return hit;
      const r=await fetch(req);
      if(r.ok){await c.put(req,r.clone());for(const k of await c.keys()){const ku=new URL(k.url);if(ku.pathname===u.pathname&&ku.search!==u.search)c.delete(k)}}
      return r}));
    return}
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{if(r.ok){const cl=r.clone();caches.open(C).then(c=>c.put('index',cl))}return r}).catch(()=>caches.open(C).then(c=>c.match('index'))))}
});
