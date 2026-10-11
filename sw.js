/* 社畜特攻隊 sw.js(1010-Z49)
   - index.html:先走網路拿最新版,斷網才用快取 → 更新照常生效,離線也打得開
   - 帶 ?v= 版本號的資源(assets*.js、sounds.js 等):快取優先 → 回訪幾乎 0 流量;版本號一換就自動抓新檔、刪舊檔
   - Supabase 等跨網域請求:完全不碰 */
const C = 'shechu-v1';
self.addEventListener('install', e => { self.skipWaiting() });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== C) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  let u; try { u = new URL(r.url) } catch (x) { return }
  if (u.origin !== location.origin) return;

  /* 頁面本身:網路優先 */
  if (r.mode === 'navigate' || u.pathname.endsWith('/index.html')) {
    e.respondWith((async () => {
      const c = await caches.open(C);
      try {
        const res = await fetch(r);
        if (res && res.ok) c.put(r, res.clone());
        return res;
      } catch (x) {
        const hit = await c.match(r, { ignoreSearch: true });
        if (hit) return hit;
        throw x;
      }
    })());
    return;
  }

  /* 有版本號的資源:快取優先 */
  if (u.search.indexOf('v=') >= 0 && /\.(js|css|json|png|webp|jpg|gif|mp3|ogg|wav)$/.test(u.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(C);
      const hit = await c.match(r);
      if (hit) return hit;
      const res = await fetch(r);
      if (res && res.ok) {
        await c.put(r, res.clone());
        /* 同一個檔案的舊版本刪掉,不佔玩家手機空間 */
        for (const k of await c.keys()) {
          try { const ku = new URL(k.url); if (ku.pathname === u.pathname && ku.search !== u.search) c.delete(k) } catch (x) {}
        }
      }
      return res;
    })());
  }
});
