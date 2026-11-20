const SW_VERSION = '1.0';
const CACHE_VERSION = '3.3.0-pwa.1';
const APP_CACHE = '2048-app-' + CACHE_VERSION;
const RUNTIME_CACHE = '2048-runtime-' + CACHE_VERSION;
const APP_SHELL = [
    './',
    './index.html',
    './manifest/manifest.webmanifest',
    './manifest/manifest.en.webmanifest',
    './manifest/manifest.ja.webmanifest',
    './favicon.ico',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './features/pwa.js',
    './css/2048.css',
    './css/modules/ai-analysis.css',
    './css/modules/custom-select.css',
    './css/modules/custom-theme.css',
    './css/modules/webrtc-sync.css',
    './features/ai-analysis.js',
    './features/ai-autoplay.js',
    './features/ai-request.js',
    './features/custom-select.js',
    './features/custom-theme-boot.js',
    './features/custom-theme.js',
    './features/data-transfer.js',
    './features/fullscreen-mode.js',
    './features/i18n.js',
    './features/keybindings.js',
    './features/manifest.js',
    './features/module-bridge.js',
    './features/module-loader.js',
    './features/share-victory.js',
    './features/webrtc-sync.js'
];
const RUNTIME_HOSTS = [
    'cdn.tailwindcss.com',
    'cdnjs.cloudflare.com'
];
const RUNTIME_SHELL = [
    ['https://cdn.tailwindcss.com/', 'no-cors'],
    ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css', 'cors'],
    ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-solid-900.woff2', 'cors'],
    ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-regular-400.woff2', 'cors'],
    ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-brands-400.woff2', 'cors'],
    ['https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js', 'cors']
];
function precacheRuntimeAssets() {
    return caches.open(RUNTIME_CACHE).then(function (cache) {
        return Promise.all(RUNTIME_SHELL.map(function (entry) {
            return fetch(entry[0], { mode: entry[1], credentials: 'omit' })
                .then(function (response) {
                    return cacheRuntimeResponse(cache, entry[0], response);
                })
                .catch(function () {
                    return null;
                });
        }));
    });
}
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(APP_CACHE)
            .then(function (cache) {
                return cache.addAll(APP_SHELL);
            })
            .then(function () {
                return precacheRuntimeAssets();
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (names) {
                return Promise.all(names.map(function (name) {
                    const isAppCache = name.indexOf('2048-app-') === 0;
                    const isRuntimeCache = name.indexOf('2048-runtime-') === 0;
                    if ((isAppCache || isRuntimeCache) && name !== APP_CACHE && name !== RUNTIME_CACHE) {
                        return caches.delete(name);
                    }
                    return Promise.resolve(false);
                }));
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});
function cacheRuntimeResponse(cache, request, response) {
    if (!response || (!response.ok && response.type !== 'opaque')) return response;
    return cache.put(request, response.clone())
        .then(function () {
            return response;
        })
        .catch(function () {
            return response;
        });
}
function handleNavigation(request) {
    return fetch(request)
        .then(function (response) {
            if (!response || !response.ok) return response;
            return caches.open(APP_CACHE)
                .then(function (cache) {
                    return cache.put(request, response.clone());
                })
                .then(function () {
                    return response;
                })
                .catch(function () {
                    return response;
                });
        })
        .catch(function () {
            return caches.match(request).then(function (response) {
                return response || caches.match('./index.html');
            });
        });
}
function handleLocalAsset(request) {
    return caches.match(request).then(function (response) {
        return response || fetch(request);
    });
}
function handleRuntimeAsset(request) {
    return caches.open(RUNTIME_CACHE).then(function (cache) {
        return cache.match(request).then(function (cached) {
            if (cached) return cached;
            return fetch(request).then(function (response) {
                return cacheRuntimeResponse(cache, request, response);
            });
        });
    });
}
self.addEventListener('fetch', function (event) {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin === self.location.origin) {
        if (request.mode === 'navigate') {
            event.respondWith(handleNavigation(request));
        } else {
            event.respondWith(handleLocalAsset(request));
        }
        return;
    }
    if (RUNTIME_HOSTS.indexOf(url.hostname) !== -1) {
        event.respondWith(handleRuntimeAsset(request));
    }
});
