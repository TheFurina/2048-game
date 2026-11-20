(function () {
    const PWA_VERSION = '1.0';
    const manifests = {
        zh: './manifest/manifest.webmanifest',
        en: './manifest/manifest.en.webmanifest',
        ja: './manifest/manifest.ja.webmanifest'
    };
    let activeLanguage = '';
    function resolveLanguage() {
        let language = 'auto';
        try {
            language = localStorage.getItem('2048-setting-language') || localStorage.getItem('2048-language') || 'auto';
        } catch (e) {}
        if (language === 'auto' || !manifests[language]) {
            language = (navigator.language || navigator.userLanguage || 'zh').split('-')[0];
        }
        return manifests[language] ? language : 'zh';
    }
    function applyManifest(language) {
        if (language === activeLanguage) return;
        const link = document.getElementById('app-manifest');
        if (!link) return;
        link.href = manifests[language];
        activeLanguage = language;
    }
    applyManifest(resolveLanguage());
    new MutationObserver(function () {
        applyManifest(resolveLanguage());
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function (error) {
            console.warn('Service Worker registration failed:', error);
        });
    });
})();
