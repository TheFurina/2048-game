const moduleLoaderVersion = '1.0';
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
    window.ModuleLoader = { load: loadModule, isLoaded, getOrFallback, version: moduleLoaderVersion };
    window.moduleLoaderModuleLoaded = true;
    console.log('ModuleLoader v' + moduleLoaderVersion + ' loaded');
})();