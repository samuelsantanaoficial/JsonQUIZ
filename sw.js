const CACHE_NAME = 'quiz-pwa-v0.1.7';
const FILES_TO_CACHE = [
    '/',
    'index.html',
    'scripts.js',
    'manifest.js',
    'icon-192.png',
    'icon-512.png'
];

// Instalação: armazena arquivos em cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Arquivos armazenados em cache:', FILES_TO_CACHE);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Busca recursos do cache quando offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                console.log('Servindo do cache:', event.request.url);
                return response;
            }
            console.log('Buscando da rede:', event.request.url);
            return fetch(event.request);
        })
    );
});