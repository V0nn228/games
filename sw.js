const C='hub-v2';
const PRE=['./','index.html','manifest.webmanifest','games.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith((async()=>{const c=await caches.open(C),hit=await c.match(r,{ignoreSearch:true});
const net=fetch(r.url,{cache:'no-cache'}).then(res=>{if(res&&res.ok)c.put(r.url,res.clone());return res}).catch(()=>null);
e.waitUntil(net);if(hit)return hit;const res=await net;return res||new Response('Офлайн. Відкрий застосунок з інтернетом хоча б раз.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})})())});
