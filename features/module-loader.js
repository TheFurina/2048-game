const moduleLoaderVersion = '4.0';
window.moduleLoaderVersion = moduleLoaderVersion;
(function () {
    'use strict';
    const LOADER_API_VERSION = 2;
    const MANIFEST_FORMAT_VERSION = 2;
    const DEFAULT_DOM_ROOT = '#module-dom-root';
    const loaded = {};
    const modules = {};
    const failures = {};
    const fallbacks = {};
    const styleFailures = {};
    const domRegistry = {};
    let currentLoading = null;
    let lastResult = null;
    let loadAllSettled = false;
    let manifestValidation = null;
    let manifestEntries = null;
    let manifestBaseUrl = '';
    const onDemandPromises = {};
    function setCurrent(name) {
        currentLoading = name;
        try { window.__moduleLoaderCurrent = name; } catch (e) {}
    }
    function parseVersion(value) {
        return String(value || '0').split('.').map(function (part) {
            const n = parseInt(part, 10);
            return isNaN(n) ? 0 : n;
        });
    }
    function compareVersion(a, b) {
        const pa = parseVersion(a);
        const pb = parseVersion(b);
        const len = Math.max(pa.length, pb.length);
        for (let i = 0; i < len; i++) {
            const d = (pa[i] || 0) - (pb[i] || 0);
            if (d !== 0) return d > 0 ? 1 : -1;
        }
        return 0;
    }
    function validateManifest(manifest) {
        const issues = [];
        if (!manifest || typeof manifest !== 'object') {
            return { ok: false, fatal: true, issues: [{ level: 'error', message: 'Manifest is missing or invalid' }], formatVersion: null };
        }
        const formatVersion = manifest.manifestVersion || MANIFEST_FORMAT_VERSION;
        if (compareVersion(formatVersion, MANIFEST_FORMAT_VERSION) > 0) {
            issues.push({ level: 'error', scope: 'manifest', message: 'Manifest format ' + formatVersion + ' is newer than supported ' + MANIFEST_FORMAT_VERSION });
            return { ok: false, fatal: true, issues: issues, formatVersion: formatVersion };
        }
        const minLoader = manifest.loader && manifest.loader.minVersion;
        if (minLoader && compareVersion(moduleLoaderVersion, minLoader) < 0) {
            issues.push({ level: 'error', scope: 'manifest', message: 'Loader ' + moduleLoaderVersion + ' is older than required ' + minLoader });
            return { ok: false, fatal: true, issues: issues, formatVersion: formatVersion };
        }
        if (!Array.isArray(manifest.modules)) {
            issues.push({ level: 'error', scope: 'manifest', message: 'Missing "modules" array' });
            return { ok: false, fatal: true, issues: issues, formatVersion: formatVersion };
        }
        const names = {};
        manifest.modules.forEach(function (raw, index) {
            if (typeof raw === 'string') return;
            if (!raw || typeof raw !== 'object' || !raw.name) {
                issues.push({ level: 'error', scope: 'module', index: index, message: 'Module entry without name' });
                return;
            }
            if (names[raw.name]) {
                issues.push({ level: 'error', scope: 'module', name: raw.name, message: 'Duplicate module name' });
            }
            names[raw.name] = true;
            if (raw.moduleApiVersion && compareVersion(raw.moduleApiVersion, LOADER_API_VERSION) > 0) {
                issues.push({ level: 'warn', scope: 'module', name: raw.name, message: 'Module API ' + raw.moduleApiVersion + ' is newer than loader API ' + LOADER_API_VERSION });
            }
            if (raw.domMode && raw.domMode !== 'unified' && raw.domMode !== 'self' && raw.domMode !== 'none') {
                issues.push({ level: 'error', scope: 'module', name: raw.name, message: 'Invalid domMode "' + raw.domMode + '"' });
            }
            if (raw.kind && raw.kind !== 'builtin' && raw.kind !== 'third-party') {
                issues.push({ level: 'error', scope: 'module', name: raw.name, message: 'Invalid kind "' + raw.kind + '"' });
            }
        });
        const fatal = issues.some(function (i) { return i.level === 'error' && i.scope === 'manifest'; });
        const fatalModules = issues.some(function (i) { return i.level === 'error' && i.scope === 'module'; });
        return { ok: !fatalModules && !fatal, fatal: fatal, issues: issues, formatVersion: formatVersion };
    }
    function normalizeEntry(entry) {
        if (typeof entry === 'string') {
            const dot = entry.lastIndexOf('.');
            const base = dot > 0 ? entry.slice(0, dot) : entry;
            return {
                name: base,
                src: entry,
                required: true,
                export: base,
                check: null,
                domMode: 'none',
                domMounts: [],
                domIds: [],
                styles: [],
                dependsOn: [],
                optionalDependsOn: [],
                init: null,
                domCheck: null,
                kind: 'builtin',
                moduleApiVersion: LOADER_API_VERSION,
                template: null,
                deferred: false
            };
        }
        if (entry && typeof entry === 'object' && entry.name) {
            const domMode = entry.domMode || (entry.domIds && entry.domIds.length ? 'unified' : 'none');
            let domMounts = [];
            if (Array.isArray(entry.domMounts)) {
                domMounts = entry.domMounts.slice();
            } else if (typeof entry.domMounts === 'string') {
                domMounts = [entry.domMounts];
            }
            return {
                name: entry.name,
                src: entry.src || (entry.name + '.js'),
                required: entry.required !== false,
                export: entry.export || entry.name,
                check: entry.check || null,
                domMode: domMode,
                domMounts: domMounts,
                domIds: Array.isArray(entry.domIds) ? entry.domIds.slice() : [],
                styles: Array.isArray(entry.styles) ? entry.styles.slice() : [],
                dependsOn: Array.isArray(entry.dependsOn) ? entry.dependsOn.slice() : [],
                optionalDependsOn: Array.isArray(entry.optionalDependsOn) ? entry.optionalDependsOn.slice() : [],
                init: entry.init || null,
                domCheck: entry.domCheck || null,
                kind: entry.kind || 'builtin',
                moduleApiVersion: entry.moduleApiVersion || LOADER_API_VERSION,
                template: entry.template || null,
                deferred: entry.deferred === true
            };
        }
        return null;
    }
    function getModuleExport(entry) {
        if (!entry) return null;
        if (window[entry.export]) return window[entry.export];
        if (window[entry.name]) return window[entry.name];
        return null;
    }
    function checkAvailability(entry) {
        try {
            if (typeof entry.check === 'function') return !!entry.check();
            if (typeof entry.check === 'string' && entry.check) {
                return typeof window[entry.check] !== 'undefined' && window[entry.check] !== null && window[entry.check] !== false;
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
            kind: entry.kind || 'builtin',
            reason: reason,
            error: msg
        };
        failures[entry.name] = info;
        modules[entry.name] = {
            name: entry.name,
            src: entry.src,
            required: !!entry.required,
            kind: entry.kind || 'builtin',
            domMode: entry.domMode,
            status: 'failed',
            error: msg,
            reason: reason,
            usingFallback: true,
            domOk: false,
            depsOk: reason === 'dependency_error' ? false : null,
            initOk: reason === 'init_error' ? false : null
        };
        loaded[entry.name] = false;
        window[entry.name + 'Loaded'] = false;
        if (entry.required) {
            console.error('[ModuleLoader] Required module "' + entry.name + '" failed (' + reason + '): ' + msg);
        } else {
            console.warn('[ModuleLoader] Optional module "' + entry.name + '" failed (' + reason + '): ' + msg);
        }
    }
    function refreshSelfDom(mod) {
        if (!mod || mod.domMode !== 'self') return;
        const ex = getModuleExport(mod);
        let ready = null;
        try {
            if (ex && typeof ex.isDomReady === 'function') ready = ex.isDomReady();
            else if (ex && typeof ex.domReady === 'function') ready = ex.domReady();
            else if (ex && typeof ex.domReady === 'boolean') ready = ex.domReady;
            else if (typeof mod.domCheck === 'function') ready = mod.domCheck();
            else if (typeof mod.domCheck === 'string' && mod.domCheck) {
                ready = typeof window[mod.domCheck] === 'function' ? !!window[mod.domCheck]() : !!window[mod.domCheck];
            } else ready = true;
        } catch (e) {
            ready = false;
        }
        mod.domOk = ready === true;
        if (domRegistry[mod.name]) {
            domRegistry[mod.name].ok = mod.domOk;
            domRegistry[mod.name].injected = mod.domOk;
        }
    }
    function isAvailableInternal(name, seen) {
        const chain = seen || [];
        if (chain.indexOf(name) !== -1) return true;
        const mod = modules[name];
        if (!mod) {
            return loaded[name] === true && window[name + '_fallbackUsed'] !== true;
        }
        if (mod.status === 'failed') return false;
        if (mod.usingFallback) return false;
        if (mod.domMode === 'self') refreshSelfDom(mod);
        if (mod.domOk === false || mod.depsOk === false || mod.initOk === false) return false;
        const nextChain = chain.concat([name]);
        for (let i = 0; i < (mod.dependsOn || []).length; i++) {
            if (!isAvailableInternal(mod.dependsOn[i], nextChain)) return false;
        }
        for (let j = 0; j < (mod.optionalDependsOn || []).length; j++) {
            if (modules[mod.optionalDependsOn[j]] && modules[mod.optionalDependsOn[j]].status === 'failed') continue;
        }
        if (mod.domMode === 'unified' && mod.domOk === null) return false;
        return true;
    }
    function isModuleAvailable(name) {
        return isAvailableInternal(name, []);
    }
    function installFallback(name) {
        const fallback = fallbacks[name];
        if (typeof fallback === 'undefined' || fallback === null) return;
        if (typeof window[name] === 'undefined' || window[name] === null) {
            window[name] = fallback;
        }
        window[name + 'Loaded'] = true;
        window[name + '_fallbackUsed'] = true;
        if (modules[name]) {
            modules[name].usingFallback = true;
            modules[name].fallbackInstalled = true;
        }
        console.warn('[ModuleLoader] Fallback active for unavailable module "' + name + '"');
    }
    function loadModule(name, exports, fallback) {
        if (typeof fallback !== 'undefined' && fallback !== null) {
            fallbacks[name] = fallback;
        }
        if (loaded[name] === true) {
            console.warn('[ModuleLoader] Module "' + name + '" already loaded');
            return window[name];
        }
        if (modules[name] && modules[name].status === 'success' && typeof window[name] !== 'undefined' && window[name] !== null) {
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
            } else {
                modules[name] = {
                    name: name,
                    required: false,
                    status: 'success',
                    usingFallback: usedFallback,
                    domMode: 'none',
                    domOk: null,
                    initOk: null,
                    depsOk: true
                };
            }
            if (usedFallback) {
                window[name + '_fallbackUsed'] = true;
                fallbacks[name] = safeFallback;
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
            const info = {
                name: name,
                required: modules[name] ? !!modules[name].required : false,
                reason: 'registration_error',
                error: error && error.message ? error.message : String(error)
            };
            failures[name] = info;
            if (modules[name]) {
                modules[name].status = 'failed';
                modules[name].error = info.error;
                modules[name].reason = 'registration_error';
                modules[name].usingFallback = true;
            }
            if (hasFallback) {
                fallbacks[name] = safeFallback;
                window[name + '_fallbackUsed'] = true;
                console.warn('[ModuleLoader] Using fallback for "' + name + '"');
            }
            return safeFallback;
        }
    }
    function registerFallback(name, fallback) {
        if (typeof fallback === 'undefined' || fallback === null) return;
        fallbacks[name] = fallback;
        if (loadAllSettled && !isAvailableInternal(name, [])) installFallback(name);
    }
    function isLoaded(name) {
        return loaded[name] === true;
    }
    function getOrFallback(name, fallback) {
        if (isModuleAvailable(name)) return window[name];
        if (typeof fallbacks[name] !== 'undefined' && fallbacks[name] !== null) return fallbacks[name];
        if (typeof fallback !== 'undefined' && fallback !== null) return fallback;
        return {};
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
    function getStyleFailures() {
        return Object.keys(styleFailures).map(function (k) { return styleFailures[k]; });
    }
    function getResult() {
        return lastResult;
    }
    function isLoadAllSettled() {
        return loadAllSettled;
    }
    function getModuleInfo(name) {
        const mod = modules[name];
        if (!mod) return null;
        const dom = domRegistry[name] || null;
        return {
            name: mod.name,
            src: mod.src,
            required: !!mod.required,
            kind: mod.kind || 'builtin',
            domMode: mod.domMode || 'none',
            status: mod.status,
            available: isModuleAvailable(name),
            usingFallback: mod.usingFallback === true,
            error: mod.error || null,
            reason: mod.reason || null,
            depsOk: mod.depsOk,
            initOk: mod.initOk,
            domOk: mod.domOk,
            dom: dom ? { mode: dom.mode, mounts: dom.mounts.slice(), injected: dom.injected, ok: dom.ok, missingIds: dom.missingIds.slice() } : null
        };
    }
    function getInjectedModules() {
        return Object.keys(domRegistry).filter(function (k) { return domRegistry[k].injected === true; });
    }
    function isDomInjected(name) {
        const dom = domRegistry[name];
        if (!dom) return false;
        if (dom.mode === 'self') refreshSelfDom(modules[name]);
        return dom.injected === true && dom.ok === true;
    }
    function getDomInfo(name) {
        const dom = domRegistry[name];
        if (!dom) return null;
        return { mode: dom.mode, mounts: dom.mounts.slice(), injected: dom.injected, ok: dom.ok, missingIds: dom.missingIds.slice() };
    }
    function getUnavailableModules() {
        return Object.keys(modules).filter(function (k) {
            return !isAvailableInternal(k, []);
        }).map(function (k) {
            const mod = modules[k];
            return {
                name: k,
                required: !!mod.required,
                status: mod.status,
                reason: mod.reason || (mod.usingFallback ? 'fallback' : (mod.domOk === false ? 'dom_error' : 'unavailable')),
                error: mod.error || null,
                domOk: mod.domOk,
                initOk: mod.initOk,
                depsOk: mod.depsOk
            };
        });
    }
    function getManifestInfo() {
        return manifestValidation ? {
            ok: manifestValidation.ok,
            fatal: manifestValidation.fatal,
            formatVersion: manifestValidation.formatVersion,
            issues: manifestValidation.issues.slice()
        } : null;
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
    function loadStyleLink(url, name) {
        return new Promise(function (resolve, reject) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.setAttribute('data-module-style', name);
            link.onload = function () { resolve(url); };
            link.onerror = function () { reject(new Error('Failed to load module style: ' + url)); };
            document.head.appendChild(link);
        });
    }
    function readStyleVersion(versionVar) {
        if (!versionVar) return '';
        try {
            return (window.getComputedStyle(document.documentElement).getPropertyValue(versionVar) || '').trim();
        } catch (e) {
            return '';
        }
    }
    function recordStyleFailure(entry, spec, url, error) {
        const message = error && error.message ? error.message : String(error);
        if (!spec.required) {
            console.warn('[ModuleLoader] Optional module style failed for "' + entry.name + '": ' + url + ' (' + message + ')');
            return;
        }
        styleFailures[entry.name + ':' + (spec.name || spec.href)] = {
            module: entry.name,
            name: spec.name || null,
            url: url,
            required: true,
            error: message
        };
        console.warn('[ModuleLoader] Module style failed for "' + entry.name + '": ' + url);
    }
    function loadModuleStyles(entry, baseUrl) {
        if (!entry.styles || entry.styles.length === 0) return Promise.resolve();
        const tasks = entry.styles.map(function (style) {
            const spec = typeof style === 'string' ? { name: entry.name + 'Css', href: style, versionVar: null, required: false } : style;
            if (!spec || !spec.href) return Promise.resolve();
            const url = /^https?:\/\//i.test(spec.href) || spec.href.indexOf('/') === 0 ? spec.href : baseUrl + spec.href;
            return loadStyleLink(url, spec.name || entry.name).then(function () {
                const version = readStyleVersion(spec.versionVar);
                if (version && spec.name) {
                    window[spec.name + 'Version'] = version;
                    return;
                }
                if (spec.versionVar) {
                    recordStyleFailure(entry, spec, url, new Error('CSS version variable not found: ' + spec.versionVar));
                }
            }).catch(function (error) {
                recordStyleFailure(entry, spec, url, error);
            });
        });
        return Promise.all(tasks).then(function () {});
    }
    function waitForDomReady() {
        if (document.readyState !== 'loading') return Promise.resolve();
        return new Promise(function (resolve) {
            document.addEventListener('DOMContentLoaded', function () { resolve(); }, { once: true });
        });
    }
    function resolveTemplates(entry, ex) {
        const mounts = entry.domMounts.length ? entry.domMounts.slice() : [DEFAULT_DOM_ROOT];
        const templates = {};
        let source = null;
        if (ex && ex.domTemplates && typeof ex.domTemplates === 'object') {
            source = ex.domTemplates;
            Object.keys(source).forEach(function (key) { templates[key] = source[key]; });
        } else if (ex && typeof ex.getTemplate === 'function') {
            mounts.forEach(function (mount) {
                try {
                    const value = ex.getTemplate(mount);
                    if (typeof value === 'string') templates[mount] = value;
                } catch (e) {}
            });
        } else if (entry.template && typeof entry.template === 'string') {
            templates[mounts[0]] = entry.template;
        }
        return { mounts: mounts, templates: templates };
    }
    function injectUnifiedDom(entry) {
        const ex = getModuleExport(entry);
        const resolved = resolveTemplates(entry, ex);
        const result = { mode: 'unified', mounts: [], injected: false, ok: false, missingIds: [], missingMounts: [], error: null };
        domRegistry[entry.name] = result;
        const mountTasks = resolved.mounts.map(function (mount) {
            const target = document.querySelector(mount);
            if (!target) {
                result.missingMounts.push(mount);
                return Promise.resolve();
            }
            let container = target.querySelector('[data-module-dom="' + entry.name + '"]');
            if (container) {
                result.mounts.push(mount);
                return Promise.resolve();
            }
            container = document.createElement('div');
            container.className = 'module-dom';
            container.setAttribute('data-module-dom', entry.name);
            container.setAttribute('data-mount', mount);
            const html = resolved.templates[mount];
            if (typeof html === 'string') {
                container.innerHTML = html;
                target.appendChild(container);
                result.mounts.push(mount);
                return Promise.resolve();
            }
            if (ex && typeof ex.mount === 'function') {
                target.appendChild(container);
                result.mounts.push(mount);
                try {
                    return Promise.resolve(ex.mount(container, mount));
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            target.appendChild(container);
            result.mounts.push(mount);
            return Promise.resolve();
        });
        return Promise.all(mountTasks).then(function () {
            const missing = (entry.domIds || []).filter(function (id) { return !document.getElementById(id); });
            result.missingIds = missing;
            result.injected = result.mounts.length > 0 && result.missingMounts.length === 0;
            result.ok = result.injected && missing.length === 0;
            if (ex && typeof ex.isDomReady === 'function') {
                try { result.ok = result.ok && ex.isDomReady() !== false; } catch (e) { result.ok = false; }
            }
            if (modules[entry.name]) modules[entry.name].domOk = result.ok;
            if (!result.ok) {
                result.error = !result.injected
                    ? 'Mount point missing: ' + (result.missingMounts.join(', ') || 'none')
                    : 'Missing DOM ids: ' + missing.join(', ');
            }
            return result.ok;
        }).catch(function (error) {
            result.error = error && error.message ? error.message : String(error);
            result.ok = false;
            if (modules[entry.name]) modules[entry.name].domOk = false;
            return false;
        });
    }
    function verifySelfDom(entry) {
        const result = { mode: 'self', mounts: [], injected: false, ok: false, missingIds: [], missingMounts: [], error: null };
        domRegistry[entry.name] = result;
        const ex = getModuleExport(entry);
        let ready = null;
        try {
            if (ex && typeof ex.isDomReady === 'function') ready = ex.isDomReady();
            else if (ex && typeof ex.domReady === 'function') ready = ex.domReady();
            else if (ex && typeof ex.domReady === 'boolean') ready = ex.domReady;
            else if (typeof entry.domCheck === 'function') ready = entry.domCheck();
            else if (typeof entry.domCheck === 'string' && entry.domCheck) {
                ready = typeof window[entry.domCheck] === 'function' ? !!window[entry.domCheck]() : !!window[entry.domCheck];
            } else ready = true;
        } catch (e) {
            ready = false;
        }
        result.injected = ready === true;
        result.ok = ready === true;
        if (modules[entry.name]) modules[entry.name].domOk = result.ok;
        if (!result.ok) result.error = 'Self-managed DOM not ready';
        return result.ok;
    }
    function getInitFn(entry) {
        const ex = getModuleExport(entry);
        if (entry.init) {
            if (ex && typeof ex[entry.init] === 'function') return ex[entry.init].bind(ex);
            if (typeof window[entry.init] === 'function') return window[entry.init];
        }
        if (ex && typeof ex.init === 'function') return ex.init.bind(ex);
        return null;
    }
    function runInit(entry) {
        const fn = getInitFn(entry);
        if (!fn) return Promise.resolve({ ok: true, skipped: true });
        try {
            const value = fn();
            if (value && typeof value.then === 'function') {
                return value.then(function () { return { ok: true }; }).catch(function (error) {
                    return { ok: false, error: error };
                });
            }
            return Promise.resolve({ ok: true });
        } catch (error) {
            return Promise.resolve({ ok: false, error: error });
        }
    }
    function depsSatisfied(entry) {
        const missing = [];
        (entry.dependsOn || []).forEach(function (dep) {
            if (!isAvailableInternal(dep, [entry.name])) missing.push(dep);
        });
        const missingOptional = [];
        (entry.optionalDependsOn || []).forEach(function (dep) {
            if (!isAvailableInternal(dep, [entry.name])) missingOptional.push(dep);
        });
        return { ok: missing.length === 0, missing: missing, missingOptional: missingOptional };
    }
    function applyTranslations() {
        try {
            if (window.i18n && typeof window.i18n.updateAllTranslations === 'function') {
                window.i18n.updateAllTranslations();
            }
        } catch (e) {}
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
    function resetState() {
        loadAllSettled = false;
        for (const k in failures) delete failures[k];
        for (const k in modules) delete modules[k];
        for (const k in domRegistry) delete domRegistry[k];
        for (const k in styleFailures) delete styleFailures[k];
        for (const k in onDemandPromises) delete onDemandPromises[k];
        lastResult = null;
        manifestValidation = null;
    }
    function finalize(entries, manifest) {
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
        Object.keys(modules).forEach(function (name) {
            const mod = modules[name];
            if (mod.status === 'failed') installFallback(name);
        });
        Object.keys(fallbacks).forEach(function (name) {
            if (modules[name] && !isAvailableInternal(name, []) && typeof window[name] !== 'undefined' && window[name + '_fallbackUsed'] === true) {
                window[name + 'Loaded'] = true;
            }
        });
        const requiredFailures = Object.keys(failures).filter(function (k) { return failures[k].required; });
        const moduleList = Object.keys(modules).map(function (k) { return getModuleInfo(k); });
        lastResult = {
            success: requiredFailures.length === 0,
            modules: moduleList,
            failures: getFailures(),
            requiredFailures: getRequiredFailures(),
            optionalFailures: getOptionalFailures(),
            unavailable: getUnavailableModules(),
            styleFailures: getStyleFailures(),
            domInjected: getInjectedModules(),
            coreCssOk: cssCheck.ok,
            manifest: getManifestInfo()
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
        if (getStyleFailures().length > 0) {
            console.warn('[ModuleLoader] Some module styles failed:', getStyleFailures().map(function (f) { return f.url; }));
        }
        if (window.debugMode) {
            console.log('[ModuleLoader] loadAll completed', lastResult);
        }
        return lastResult;
    }
    function loadEntries(entries, baseUrl) {
        return entries.reduce(function (promise, entry) {
            return promise.then(function () {
                setCurrent(entry.name);
                if (window.debugMode) {
                    console.log('[ModuleLoader] Loading module:', entry.name, '(' + entry.src + ')');
                }
                if (entry.moduleApiVersion && compareVersion(entry.moduleApiVersion, LOADER_API_VERSION) > 0) {
                    recordFailure(entry, 'api_incompatible', new Error('Module API ' + entry.moduleApiVersion + ' is newer than loader API ' + LOADER_API_VERSION));
                    return;
                }
                if (entry.domMode !== 'unified' && entry.domMode !== 'self' && entry.domMode !== 'none') {
                    recordFailure(entry, 'manifest_error', new Error('Invalid domMode: ' + entry.domMode));
                    return;
                }
                if (entry.kind !== 'builtin' && entry.kind !== 'third-party') {
                    recordFailure(entry, 'manifest_error', new Error('Invalid module kind: ' + entry.kind));
                    return;
                }
                const src = entry.src.indexOf('/') !== -1 || entry.src.indexOf('http') === 0
                    ? entry.src
                    : baseUrl + entry.src;
                return loadScript(src).then(function () {
                    return loadModuleStyles(entry, baseUrl);
                }).then(function () {
                    if (checkAvailability(entry)) {
                        modules[entry.name] = {
                            name: entry.name,
                            src: src,
                            required: !!entry.required,
                            kind: entry.kind,
                            export: entry.export,
                            moduleApiVersion: entry.moduleApiVersion,
                            domMode: entry.domMode,
                            domCheck: entry.domCheck,
                            dependsOn: entry.dependsOn,
                            optionalDependsOn: entry.optionalDependsOn,
                            deferred: !!entry.deferred,
                            status: 'loaded',
                            usingFallback: false,
                            domOk: entry.domMode === 'none' ? true : null,
                            depsOk: null,
                            initOk: null
                        };
                        loaded[entry.name] = true;
                        window[entry.name + 'Loaded'] = true;
                        if (window.debugMode) {
                            console.log('[ModuleLoader] Module script ready:', entry.name);
                        }
                    } else {
                        recordFailure(entry, 'not_available', new Error('Module export not found after script load'));
                    }
                }).catch(function (err) {
                    recordFailure(entry, 'script_error', err);
                });
            });
        }, Promise.resolve());
    }
    function injectDomPhase(entries) {
        setCurrent('dom');
        const tasks = entries.map(function (entry) {
            const mod = modules[entry.name];
            if (!mod || mod.status === 'failed') return Promise.resolve();
            if (entry.domMode === 'unified') {
                return injectUnifiedDom(entry).then(function (ok) {
                    if (!ok) {
                        recordFailure(entry, 'dom_error', new Error(domRegistry[entry.name].error || 'DOM injection failed'));
                    }
                });
            }
            if (entry.domMode === 'self') {
                const ex = getModuleExport(entry);
                const hasAuxiliary = entry.domMounts.length > 0 || (ex && ex.domTemplates);
                if (hasAuxiliary) {
                    return injectUnifiedDom(entry).then(function (ok) {
                        if (!ok) {
                            console.warn('[ModuleLoader] Auxiliary DOM for "' + entry.name + '" was not injected:', domRegistry[entry.name].error);
                        }
                    });
                }
            }
            return Promise.resolve();
        });
        return Promise.all(tasks).then(function () {
            applyTranslations();
        });
    }
    function initPhase(entries) {
        setCurrent('init');
        return entries.reduce(function (promise, entry) {
            return promise.then(function () {
                const mod = modules[entry.name];
                if (!mod || mod.status === 'failed') return;
                const deps = depsSatisfied(entry);
                mod.depsOk = deps.ok;
                if (!deps.ok) {
                    recordFailure(entry, 'dependency_error', new Error('Missing dependencies: ' + deps.missing.join(', ')));
                    return;
                }
                return runInit(entry).then(function (result) {
                    if (!result.ok) {
                        recordFailure(entry, 'init_error', result.error || new Error('Module init failed'));
                        return;
                    }
                    mod.initOk = true;
                    if (entry.domMode === 'self') {
                        if (!verifySelfDom(entry)) {
                            recordFailure(entry, 'dom_error', new Error('Self-managed DOM not ready'));
                            return;
                        }
                    }
                    if (mod.status !== 'failed') mod.status = 'success';
                });
            });
        }, Promise.resolve()).then(function () {
            applyTranslations();
        });
    }
    function findManifestEntry(name) {
        if (!manifestEntries) return null;
        for (let i = 0; i < manifestEntries.length; i++) {
            if (manifestEntries[i].name === name) return manifestEntries[i];
        }
        return null;
    }
    function loadOnDemand(name) {
        if (onDemandPromises[name]) return onDemandPromises[name];
        const entry = findManifestEntry(name);
        if (!entry) {
            return Promise.resolve(loaded[name] === true ? window[name] : undefined);
        }
        const mod = modules[name];
        if (mod && mod.status === 'success' && loaded[name] === true) {
            applyTranslations();
            return Promise.resolve(window[name]);
        }
        if (mod && mod.status === 'failed') {
            return Promise.reject(new Error('[ModuleLoader] Module "' + name + '" failed to load previously'));
        }
        setCurrent(name);
        const depPromises = (entry.dependsOn || []).map(function (dep) {
            return loadOnDemand(dep);
        });
        const task = Promise.all(depPromises).then(function () {
            return loadEntries([entry], manifestBaseUrl);
        }).then(function () {
            return injectDomPhase([entry]);
        }).then(function () {
            return initPhase([entry]);
        }).then(function () {
            const loadedMod = modules[name];
            if (!loadedMod || loadedMod.status !== 'success') {
                throw new Error('[ModuleLoader] Module "' + name + '" did not initialize');
            }
            setCurrent(null);
            return window[name];
        }).catch(function (error) {
            setCurrent(null);
            delete onDemandPromises[name];
            installFallback(name);
            throw error;
        });
        onDemandPromises[name] = task;
        return task;
    }
    function loadAll(manifestUrl) {
        resetState();
        const url = manifestUrl || './features/manifest.js';
        const baseUrl = url.slice(0, url.lastIndexOf('/') + 1);
        return loadScript(url).then(function () {
            const manifest = window.__modulesManifest;
            manifestValidation = validateManifest(manifest);
            if (manifestValidation.fatal) {
                const error = new Error('[ModuleLoader] Manifest validation failed: ' + manifestValidation.issues.map(function (i) { return i.message; }).join('; '));
                error.manifest = manifestValidation;
                throw error;
            }
            if (window.debugMode) {
                console.log('[ModuleLoader] Manifest loaded:', manifest.modules);
            }
            const entries = manifest.modules
                .map(normalizeEntry)
                .filter(function (e) { return e && e.name; });
            manifestEntries = entries.slice();
            manifestBaseUrl = baseUrl;
            const activeEntries = entries.filter(function (e) { return !e.deferred; });
            return loadEntries(activeEntries, baseUrl).then(function () {
                return waitForDomReady();
            }).then(function () {
                return injectDomPhase(activeEntries);
            }).then(function () {
                return initPhase(activeEntries);
            }).then(function () {
                return finalize(activeEntries, manifest);
            });
        }).catch(function (err) {
            setCurrent(null);
            loadAllSettled = true;
            try { window.__moduleLoadAllSettled = true; } catch (e) {}
            if (!lastResult) {
                lastResult = {
                    success: false,
                    modules: Object.keys(modules).map(function (k) { return getModuleInfo(k); }),
                    failures: getFailures(),
                    requiredFailures: getRequiredFailures(),
                    optionalFailures: getOptionalFailures(),
                    unavailable: getUnavailableModules(),
                    styleFailures: getStyleFailures(),
                    domInjected: getInjectedModules(),
                    coreCssOk: true,
                    manifest: getManifestInfo()
                };
            }
            err.result = lastResult;
            throw err;
        });
    }
    window.ModuleLoader = {
        version: moduleLoaderVersion,
        apiVersion: LOADER_API_VERSION,
        manifestFormatVersion: MANIFEST_FORMAT_VERSION,
        load: loadModule,
        loadOnDemand: loadOnDemand,
        registerFallback: registerFallback,
        isLoaded: isLoaded,
        isModuleAvailable: isModuleAvailable,
        getOrFallback: getOrFallback,
        getStatus: getStatus,
        getFailure: getFailure,
        getFailures: getFailures,
        getRequiredFailures: getRequiredFailures,
        getOptionalFailures: getOptionalFailures,
        getStyleFailures: getStyleFailures,
        getResult: getResult,
        isLoadAllSettled: isLoadAllSettled,
        loadAll: loadAll,
        getModuleInfo: getModuleInfo,
        getInjectedModules: getInjectedModules,
        isDomInjected: isDomInjected,
        getDomInfo: getDomInfo,
        getUnavailableModules: getUnavailableModules,
        getManifestInfo: getManifestInfo,
        get currentLoading() { return currentLoading; }
    };
    window.moduleLoaderModuleLoaded = true;
    console.log('ModuleLoader v' + moduleLoaderVersion + ' loaded');
})();
