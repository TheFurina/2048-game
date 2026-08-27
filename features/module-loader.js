const moduleLoaderVersion = '2.0';
window.moduleLoaderVersion = moduleLoaderVersion;
(function() {
    'use strict';
    const loaded = {};
    function loadModule(name, exports, fallback) {
        if (loaded[name]) {
            console.warn(`[ModuleLoader] Module "${name}" already loaded`);
            return window[name];
        }
        try {
            if (exports && typeof exports === 'object') {
                window[name] = exports;
            } else if (typeof exports === 'function') {
                window[name] = exports();
            }
            window[name + 'Loaded'] = true;
            loaded[name] = true;
            if (window.debugMode) {
                console.log(`[ModuleLoader] "${name}" loaded`);
            }
            return window[name];
        } catch (error) {
            console.error(`[ModuleLoader] Failed to load "${name}":`, error);
            window[name + 'Loaded'] = false;
            loaded[name] = false;
            if (fallback) {
                console.warn(`[ModuleLoader] Using fallback for "${name}"`);
                window[name] = fallback;
                return fallback;
            }
            return null;
        }
    }
    function isLoaded(name) {
        return loaded[name] === true;
    }
    function getOrFallback(name, fallback) {
        if (isLoaded(name)) {
            return window[name];
        }
        return fallback || null;
    }
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error('[ModuleLoader] Failed to load script: ' + src));
            document.head.appendChild(script);
        });
    }
    function loadModuleList(modules, baseUrl) {
        return modules.reduce((promise, name) => {
            const src = name.indexOf('/') !== -1 || name.indexOf('http') === 0 ? name : baseUrl + name;
            return promise.then(() => {
                if (window.debugMode) {
                    console.log('[ModuleLoader] Loading module:', src);
                }
                return loadScript(src);
            });
        }, Promise.resolve());
    }
    function loadAll(manifestUrl) {
        const url = manifestUrl || './features/manifest.js';
        const baseUrl = url.slice(0, url.lastIndexOf('/') + 1);
        return loadScript(url).then(() => {
            const manifest = window.__modulesManifest;
            if (!manifest || !Array.isArray(manifest.modules)) {
                throw new Error('[ModuleLoader] Invalid manifest: missing "modules" array in ' + url);
            }
            if (window.debugMode) {
                console.log('[ModuleLoader] Manifest loaded:', manifest.modules);
            }
            return loadModuleList(manifest.modules, baseUrl);
        }).then(() => {
            if (window.debugMode) {
                console.log('[ModuleLoader] All modules from manifest loaded');
            }
        });
    }
    window.ModuleLoader = { load: loadModule, isLoaded, getOrFallback, loadAll, version: moduleLoaderVersion };
    window.moduleLoaderModuleLoaded = true;
    console.log('ModuleLoader v' + moduleLoaderVersion + ' loaded');
})();