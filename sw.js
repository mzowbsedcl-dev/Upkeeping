const CACHE_NAME = 'upkeeping-v2';
const ASSETS = [
    './',
    'index.html',
    'analytics.html',
    'report.html',
    'report1.html',
    'view_report.html',
    'manifest.json',
    'icon-192.png',
    'icon-512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching app shell');
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version or fetch from network
            return response || fetch(event.request).then((fetchResponse) => {
                // Optionally cache new requests
                return fetchResponse;
            });
        }).catch(() => {
            // Offline fallback for HTML pages
            if (event.request.mode === 'navigate') {
                return caches.match('index.html');
            }
        })
    );
});
