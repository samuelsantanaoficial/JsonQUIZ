const CACHE_NAME = 'quiz-pwa-v0.1.6';
const ASSETS = [
    'index.html',
    'manifest.json',
    'logo.svg',
    'script.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
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