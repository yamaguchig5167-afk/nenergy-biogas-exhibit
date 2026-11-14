// 公開ページ用のサービスワーカー（2026-11-08）
// ・通信があるときは毎回最新を取りに行き、取れたら手元に保存する（会期中の修正が自動で反映される）
// ・通信が切れたら、手元に保存した最後の版で動く（MAXHUB が展示を続けられる）
// ・お知らせ（notice.json）と全編動画（media/）は保存しない（いつも最新・容量を使わない）
const CACHE = 'ne-exhibit-v3'; // 2026-11-14 リサイクルゲーム（recycle.html）・おうちミッション（mission.html）を追加
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './cert.html', './recycle.html', './mission.html']).catch(() => {}))); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.endsWith('notice.json') || u.pathname.includes('/media/')) return;
  e.respondWith(fetch(req).then((r) => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then((m) => m || caches.match('./index.html'))));
});
