const moduleLoaderVersion = '3.1';
window.moduleLoaderVersion = moduleLoaderVersion;
(function () {
    'use strict';
    const loaded = {};
    const modules = {};
    const failures = {};
    let currentLoading = null;
    let lastResult = null;
    let loadAllSettled = false;
    function setCurrent(name) {
        currentLoading = name;
        try { window.__moduleLoaderCurrent = name; } catch (e) {}
    }
    function loadModule(name, exports, fallback) {
        if (loaded[name] === true) {
            console.warn('[ModuleLoader] Module "' + name + '" already loaded');
            return window[name];
        }
        const hasFallback = typeof fallback !== 'undefined' && fallback !== null;
        const safeFallback = hasFallback ? fallback : {};
        let usedFallback = false;
        const preRegistered = modules[name] && modules[name].status === 'success';
        try {
            if (exports && typeof exports === 'object') {
                window[name] = exports;
            } else if (typeof exports === 'function') {
                const resolved = exports();
                if (resolved !== undefined && resolved !== null) {
                    window[name] = resolved;
                } else {
                    window[name] = safeFallback;
                    usedFallback = !preRegistered;
                }
            } else {
                window[name] = safeFallback;
                usedFallback = !preRegistered;
            }
            window[name + 'Loaded'] = true;
            loaded[name] = true;
            if (modules[name]) {
                modules[name].status = 'success';
                modules[name].usingFallback = usedFallback;
            }
            if (window.debugMode) {
                console.log('[ModuleLoader] "' + name + '" loaded' + (usedFallback ? ' (fallback)' : ''));
            }
            return window[name];
        } catch (error) {
            console.error('[ModuleLoader] Failed to load "' + name + '":', error);
            window[name + 'Loaded'] = false;
            loaded[name] = false;
            window[name] = safeFallback;
            usedFallback = true;
            if (modules[name]) {
                modules[name].status = 'failed';
                modules[name].error = error && error.message ? error.message : String(error);
                modules[name].usingFallback = true;
            }
            failures[name] = {
                name: name,
                error: error && error.message ? error.message : String(error),
                required: modules[name] ? !!modules[name].required : false,
                reason: 'registration_error'
            };
            if (hasFallback) {
                console.warn('[ModuleLoader] Using fallback for "' + name + '"');
            }
            return safeFallback;
        }
    }
    function isLoaded(name) {
        return loaded[name] === true;
    }
    function isModuleAvailable(name) {
        const mod = modules[name];
        if (mod) {
            return mod.status === 'success' && mod.usingFallback !== true;
        }
        return loaded[name] === true;
    }
    function getOrFallback(name, fallback) {
        if (isLoaded(name)) {
            return window[name];
        }
        return fallback || null;
    }
    function getStatus(name) {
        const mod = modules[name];
        if (!mod) {
            return loaded[name] === true ? 'success' : (loaded[name] === false ? 'failed' : 'not-found');
        }
        return mod.status || 'pending';
    }
    function getFailure(name) {
        return failures[name] || null;
    }
    function getFailures() {
        return Object.keys(failures).map(function (k) { return failures[k]; });
    }
    function getRequiredFailures() {
        return getFailures().filter(function (f) { return f.required; });
    }
    function getOptionalFailures() {
        return getFailures().filter(function (f) { return !f.required; });
    }
    function getResult() {
        return lastResult;
    }
    function isLoadAllSettled() {
        return loadAllSettled;
    }
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            const script = document.createElement('script');
            const isRemote = /^https?:\/\//i.test(src);
            script.src = src;
            script.async = false;
            script.onload = function () { resolve(src); };
            script.onerror = function () { reject(new Error('[ModuleLoader] Failed to load script: ' + src)); };
            document.head.appendChild(script);
        });
    }
    function normalizeEntry(entry) {
        if (typeof entry === 'string') {
            const dot = entry.lastIndexOf('.');
            const base = dot > 0 ? entry.slice(0, dot) : entry;
            return { name: base, src: entry, required: true };
        }
        if (entry && typeof entry === 'object') {
            return {
                name: entry.name,
                src: entry.src || (entry.name + '.js'),
                required: entry.required !== false,
                export: entry.export || entry.name,
                check: entry.check || null
            };
        }
        return null;
    }
    function checkAvailability(entry) {
        const check = entry.check;
        try {
            if (typeof check === 'function') {
                return !!check();
            }
            if (typeof check === 'string' && check) {
                return typeof window[check] !== 'undefined' && window[check] !== null;
            }
            const exportName = entry.export || entry.name;
            return typeof window[exportName] !== 'undefined' && window[exportName] !== null;
        } catch (e) {
            return false;
        }
    }
    function recordFailure(entry, reason, error) {
        const msg = error && error.message ? error.message : String(error || reason);
        const info = {
            name: entry.name,
            src: entry.src,
            required: !!entry.required,
            reason: reason,
            error: msg
        };
        failures[entry.name] = info;
        modules[entry.name] = {
            name: entry.name,
            src: entry.src,
            required: !!entry.required,
            status: 'failed',
            error: msg,
            reason: reason,
            usingFallback: true
        };
        if (entry.required) {
            console.error('[ModuleLoader] Required module "' + entry.name + '" failed (' + reason + '): ' + msg);
        } else {
            console.warn('[ModuleLoader] Optional module "' + entry.name + '" failed (' + reason + '): ' + msg);
        }
    }
    function verifyCoreCss(coreCss) {
        if (!coreCss || coreCss.required === false) {
            return { ok: true };
        }
        const versionVar = coreCss.versionVar || '--css-version';
        let value = '';
        try {
            value = getComputedStyle(document.documentElement).getPropertyValue(versionVar).trim();
        } catch (e) {
            value = '';
        }
        if (!value) {
            return {
                ok: false,
                error: 'Core layout CSS failed to load (missing ' + versionVar + ')'
            };
        }
        return { ok: true };
    }
    function loadAll(manifestUrl) {
        loadAllSettled = false;
        for (const k in failures) { delete failures[k]; }
        for (const k in modules) { delete modules[k]; }
        lastResult = null;
        const url = manifestUrl || './features/manifest.js';
        const baseUrl = url.slice(0, url.lastIndexOf('/') + 1);
        return loadScript(url).then(function () {
            const manifest = window.__modulesManifest;
            if (!manifest || !Array.isArray(manifest.modules)) {
                throw new Error('[ModuleLoader] Invalid manifest: missing "modules" array in ' + url);
            }
            if (window.debugMode) {
                console.log('[ModuleLoader] Manifest loaded:', manifest.modules);
            }
            const entries = manifest.modules
                .map(normalizeEntry)
                .filter(function (e) { return e && e.name; });
            return entries.reduce(function (promise, entry) {
                return promise.then(function () {
                    setCurrent(entry.name);
                    if (window.debugMode) {
                        console.log('[ModuleLoader] Loading module:', entry.name, '(' + entry.src + ')');
                    }
                    const src = entry.src.indexOf('/') !== -1 || entry.src.indexOf('http') === 0
                        ? entry.src
                        : baseUrl + entry.src;
                    return loadScript(src).then(function () {
                        if (checkAvailability(entry)) {
                            modules[entry.name] = {
                                name: entry.name,
                                src: src,
                                required: !!entry.required,
                                status: 'success',
                                usingFallback: false
                            };
                            if (window.debugMode) {
                                console.log('[ModuleLoader] Module ready:', entry.name);
                            }
                        } else {
                            recordFailure(entry, 'not_available', new Error('Module export not found after script load'));
                        }
                    }).catch(function (err) {
                        recordFailure(entry, 'script_error', err);
                    });
                });
            }, Promise.resolve()).then(function () {
                setCurrent(null);
                const cssCheck = verifyCoreCss(manifest.coreCss);
                if (!cssCheck.ok) {
                    failures['__coreCss__'] = {
                        name: '__coreCss__',
                        required: true,
                        reason: 'css_missing',
                        error: cssCheck.error
                    };
                    console.error('[ModuleLoader] Core CSS check failed:', cssCheck.error);
                }
                const requiredFailures = Object.keys(failures).filter(function (k) { return failures[k].required; });
                lastResult = {
                    success: requiredFailures.length === 0,
                    modules: Object.keys(modules).map(function (k) {
                        return { name: k, status: modules[k].status, required: modules[k].required };
                    }),
                    failures: getFailures(),
                    requiredFailures: getRequiredFailures(),
                    optionalFailures: getOptionalFailures(),
                    coreCssOk: cssCheck.ok
                };
                loadAllSettled = true;
                try { window.__moduleLoadAllSettled = true; } catch (e) {}
                if (requiredFailures.length > 0) {
                    const names = requiredFailures.map(function (k) { return k; }).join(', ');
                    const err = new Error('[ModuleLoader] Required modules failed: ' + names);
                    err.failures = getRequiredFailures();
                    err.result = lastResult;
                    throw err;
                }
                if (getOptionalFailures().length > 0) {
                    console.warn('[ModuleLoader] Some optional modules failed:', getOptionalFailures().map(function (f) { return f.name; }));
                }
                if (window.debugMode) {
                    console.log('[ModuleLoader] loadAll completed', lastResult);
                }
                return lastResult;
            });
        }).catch(function (err) {
            setCurrent(null);
            loadAllSettled = true;
            try { window.__moduleLoadAllSettled = true; } catch (e) {}
            if (!lastResult) {
                lastResult = {
                    success: false,
                    modules: [],
                    failures: getFailures(),
                    requiredFailures: getRequiredFailures(),
                    optionalFailures: getOptionalFailures(),
                    coreCssOk: true
                };
            }
            err.result = lastResult;
            throw err;
        });
    }
    window.ModuleLoader = {
        version: moduleLoaderVersion,
        load: loadModule,
        isLoaded: isLoaded,
        isModuleAvailable: isModuleAvailable,
        getOrFallback: getOrFallback,
        getStatus: getStatus,
        getFailure: getFailure,
        getFailures: getFailures,
        getRequiredFailures: getRequiredFailures,
        getOptionalFailures: getOptionalFailures,
        getResult: getResult,
        isLoadAllSettled: isLoadAllSettled,
        loadAll: loadAll,
        get currentLoading() { return currentLoading; }
    };
    window.moduleLoaderModuleLoaded = true;
    console.log('ModuleLoader v' + moduleLoaderVersion + ' loaded');
})();
