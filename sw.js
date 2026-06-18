/* LifeOS Service Worker – Offline Support */
const CACHE='lifeos-v1';
const ASSETS=['./','/index.html','/css/main.css','/css/components.css','/css/animations.css','/css/dashboard.css','/js/data.js','/js/hero.js','/js/clock.js','/js/weather.js','/js/tasks.js','/js/notes.js','/js/journal.js','/js/goals.js','/js/mood.js','/js/analytics.js','/js/focus.js','/js/habits.js','/js/memories.js','/js/animations.js','/js/app.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})); });
self.addEventListener('fetch',e=>{ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)).catch(()=>caches.match('./index.html'))); });
