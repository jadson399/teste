const CACHE_NAME = 'gestaopro-v1';
const ASSETS = [
  'index.html',
  'register.html',
  'dashboard.html',
  'financeiro.html',
  'estoque.html',
  'relatorios.html',
  'admin.html',
  'css/style.css',
  'js/app.js',
  'js/layout.js',
  'manifest.json',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Instalação do Service Worker e Cache de Arquivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação e Limpeza de Cache Antigo
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Estratégia de Fetch: Network First, Fallback to Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
