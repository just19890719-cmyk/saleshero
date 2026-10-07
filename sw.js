/* 社畜特攻隊 離線快取 1008-A
   - 有版本號(?v=)的圖檔/音效:快取優先(檔名一換版本就會重新下載),第二次打開幾乎瞬間載入
   - 新版本下載完後,自動刪掉同一個檔案的舊版本,手機儲存空間不會越用越多
   - index.html 等其他檔案:網路優先,斷線時才用快取 */
const CACHE='shechu-1005-V';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function prune(ca,u){try{for(const req of await ca.keys()){const o=new URL(req.url);if(o.pathname===u.pathname&&o.searchParams.has('v')&&o.search!==u.search)await ca.delete(req)}}catch(e){}}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;let u;try{u=new URL(r.url)}catch(x){return}if(u.origin!==location.origin)return;
 const versioned=u.searchParams.has('v')&&/\.(js|png|webp|jpg|mp3|json)$/i.test(u.pathname);
 if(versioned){e.respondWith(caches.open(CACHE).then(ca=>ca.match(r).then(m=>m||fetch(r).then(res=>{if(res&&res.ok){ca.put(r,res.clone()).then(()=>prune(ca,u)).catch(()=>{})}return res}))).catch(()=>fetch(r)));return}
 e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c)).catch(()=>{})}return res})
  .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html',{ignoreSearch:true}):undefined)).then(m=>m||Response.error())))});
