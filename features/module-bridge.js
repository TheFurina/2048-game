const moduleBridgeVersion = '1.0';
window.moduleBridgeVersion = moduleBridgeVersion;
(function () {
    'use strict';
    window.__detectLoadingLang = function () {
        var lang = 'auto';
        try {
            lang = localStorage.getItem(window.SETTING_PREFIX + 'language') || 'auto';
        } catch (e) {}
        if (lang === 'auto') {
            var browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0];
            if (browserLang === 'en') lang = 'en';
            else if (browserLang === 'ja') lang = 'ja';
            else lang = 'zh';
        }
        return lang;
    };
    window.__loadingErrorTexts = {
        zh: {
            title: '资源加载失败',
            detail: '请检查网络连接后刷新页面',
            loaderDetail: '模块加载器加载失败，请检查网络连接后刷新页面',
            reload: '重新加载'
        },
        en: {
            title: 'Failed to load resources',
            detail: 'Check your network connection and refresh the page',
            loaderDetail: 'The module loader failed to load. Check your network and refresh the page',
            reload: 'Reload'
        },
        ja: {
            title: 'リソースの読み込みに失敗しました',
            detail: 'ネットワーク接続を確認してページを更新してください',
            loaderDetail: 'モジュールローダーの読み込みに失敗しました。ネットワーク接続を確認してページを更新してください',
            reload: '再読み込み'
        }
    };
    window.__getLoadingErrorTexts = function () {
        var lang = window.__detectLoadingLang();
        var fallback = window.__loadingErrorTexts[lang] || window.__loadingErrorTexts.zh;
        if (window.i18n && typeof window.i18n.t === 'function') {
            var pick = function (key, value) {
                var translated = window.i18n.t(key);
                return translated && translated !== key ? translated : value;
            };
            return {
                title: pick('loadingFailed', fallback.title),
                detail: pick('loadingFailedDetail', fallback.detail),
                loaderDetail: pick('moduleLoaderFailedDetail', fallback.loaderDetail),
                reload: pick('reloadPage', fallback.reload)
            };
        }
        return fallback;
    };
    if (typeof ModuleLoader === 'undefined' || !window.moduleLoaderModuleLoaded) {
        var fatal = new Error('Module loader failed to load');
        var showFatal = function () {
            var loadingScreen = document.getElementById('loading-screen');
            if (!loadingScreen) return;
            var spinnerWrap = loadingScreen.querySelector('.loading-spinner-container');
            if (spinnerWrap) spinnerWrap.style.display = 'none';
            var errBox = document.getElementById('loading-error');
            if (errBox) errBox.style.display = 'flex';
            var titleEl = document.getElementById('loading-error-text');
            var detailEl = document.getElementById('loading-error-detail');
            var btn = document.getElementById('loading-reload-btn');
            var text = window.__getLoadingErrorTexts();
            if (titleEl) titleEl.textContent = text.title;
            if (detailEl) detailEl.textContent = text.loaderDetail + ' (module-loader.js)';
            if (btn) {
                btn.textContent = text.reload;
                btn.onclick = function () { location.reload(); };
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showFatal);
        } else {
            showFatal();
        }
        window.modulesReadyPromise = Promise.reject(fatal);
        return;
    }
    var modalHooks = {};
    var DEFAULT_KEY_BINDINGS = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        pause: 'p',
        undo: 'z',
        restart: 'r',
        newGame: 'n',
        endless: 'e',
        grid: 'g',
        aiAnalyze: 'l',
        aiAutoPlay: 't'
    };
    function setCustomThemeUiVisible(visible) {
        var container = document.getElementById('custom-theme-button-container');
        if (!container) return;
        if (visible) container.classList.add('visible');
        else container.classList.remove('visible');
    }
    window.setCustomThemeUiVisible = setCustomThemeUiVisible;
    function moduleMissingAlert(key) {
        alert(window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(key) : key);
    }
    function resolveDefaultAction(key) {
        var actions = Object.keys(DEFAULT_KEY_BINDINGS);
        for (var i = 0; i < actions.length; i++) {
            if (DEFAULT_KEY_BINDINGS[actions[i]] === key) return actions[i];
        }
        return null;
    }
    function registerModuleFallbacks() {
        ModuleLoader.registerFallback('dataTransfer', {
            exportGameData: function() { moduleMissingAlert('dataTransferModuleMissing'); },
            importGameData: function() { moduleMissingAlert('dataTransferModuleMissing'); },
            exportGameDataAsLink: function() { moduleMissingAlert('dataTransferModuleMissing'); },
            exportGameDataAsFile: function() { moduleMissingAlert('dataTransferModuleMissing'); },
            copyDataToClipboard: function() { moduleMissingAlert('dataTransferModuleMissing'); },
            isDomReady: function() { return false; },
            domTemplates: {}
        });
        ModuleLoader.registerFallback('customSelect', {
            init: function() {},
            isDomReady: function() { return true; }
        });
        ModuleLoader.registerFallback('customTheme', {
            setupThemeCustomizer: function() { moduleMissingAlert('customThemeModuleMissing'); },
            loadCustomTheme: function() { moduleMissingAlert('customThemeModuleMissing'); },
            resetCustomTheme: function() { moduleMissingAlert('customThemeModuleMissing'); },
            isDomReady: function() { return false; },
            domTemplates: {}
        });
        ModuleLoader.registerFallback('aiRequest', {
            getConfig: function() { return { baseUrl: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 500 }; },
            saveConfig: function() { return false; },
            validateConfig: function() { return []; },
            sendRequest: function() { return { success: false, error: 'aiApiModuleMissing' }; },
            setupSettings: function() {},
            isDomReady: function() { return false; },
            domTemplates: {}
        });
        ModuleLoader.registerFallback('aiAnalysis', {
            setupAiAnalysis: function() {},
            analyzeGameState: function() { moduleMissingAlert('aiAnalysisModuleMissing'); },
            requestGameAnalysis: function() {},
            isDomReady: function() { return false; },
            domTemplates: {}
        });
        ModuleLoader.registerFallback('aiAutoPlay', {
            init: function() {},
            isActive: function() { return false; },
            stop: function() {},
            resumeForGame: function() {},
            isDomReady: function() { return false; }
        });
        ModuleLoader.registerFallback('webrtcSync', {
            init: function() { console.warn('WebRTC sync module not found. Please ensure features/webrtc-sync.js file exists.'); },
            isDomReady: function() { return false; },
            domTemplates: {}
        });
        ModuleLoader.registerFallback('keybindings', {
            resolveAction: resolveDefaultAction,
            isCapturing: function() { return false; },
            reset: function() {},
            render: function() {},
            isDomReady: function() { return false; },
            domTemplates: {}
        });
        ModuleLoader.registerFallback('fullscreenMode', {
            init: function() {},
            isDomReady: function() { return false; }
        });
        ModuleLoader.registerFallback('i18n', {
            t: function(key) { return key; },
            init: function() {},
            isDomReady: function() { return true; }
        });
    }
    function exposeModuleGlobals() {
        var mappings = [
            ['dataTransfer', ['exportGameData', 'importGameData', 'exportGameDataAsLink', 'exportGameDataAsFile', 'copyDataToClipboard']],
            ['customTheme', ['setupThemeCustomizer', 'loadCustomTheme', 'resetCustomTheme']],
            ['aiAnalysis', ['setupAiAnalysis', 'analyzeGameState', 'requestGameAnalysis']],
            ['aiRequest', ['setupAiRequestSettings']]
        ];
        mappings.forEach(function (pair) {
            var source = window[pair[0]];
            if (!source) return;
            pair[1].forEach(function (fn) {
                if (typeof window[fn] !== 'function' && typeof source[fn] === 'function') {
                    window[fn] = source[fn];
                }
            });
        });
        if (typeof window.setupAiRequestSettings !== 'function' && window.aiRequest && typeof window.aiRequest.setupSettings === 'function') {
            window.setupAiRequestSettings = window.aiRequest.setupSettings;
        }
    }
    function ensureLoadingOverlay() {
        var overlay = document.getElementById('module-loading-overlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'module-loading-overlay';
        overlay.className = 'fixed inset-0 z-[9998] hidden items-center justify-center bg-black/30 dark:bg-black/50';
        overlay.setAttribute('aria-live', 'polite');
        overlay.innerHTML = '<div class="flex items-center gap-3 rounded-lg bg-white/95 dark:bg-dark-surface/95 px-5 py-4 shadow-xl"><div class="loading-spinner"></div><span class="text-secondary/80 dark:text-dark-muted text-base font-medium"></span></div>';
        document.body.appendChild(overlay);
        return overlay;
    }
    var moduleLoadingCount = 0;
    function showModuleLoading() {
        if (document.getElementById('loading-screen')) return;
        moduleLoadingCount++;
        if (moduleLoadingCount !== 1) return;
        var overlay = ensureLoadingOverlay();
        var label = overlay.querySelector('span');
        if (label) {
            label.textContent = window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t('moduleLoading') : '正在加载模块...';
        }
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
    }
    function hideModuleLoading() {
        if (moduleLoadingCount === 0) return Promise.resolve();
        moduleLoadingCount = Math.max(0, moduleLoadingCount - 1);
        if (moduleLoadingCount > 0) return Promise.resolve();
        var overlay = document.getElementById('module-loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
        return Promise.resolve();
    }
    function ensureModules(names) {
        if (typeof names === 'string') names = [names];
        if (!Array.isArray(names) || names.length === 0) return Promise.resolve([]);
        if (typeof ModuleLoader === 'undefined' || typeof ModuleLoader.loadOnDemand !== 'function') {
            return Promise.reject(new Error('ModuleLoader on-demand loading is unavailable'));
        }
        var pendingModules = names.filter(function (name) {
            if (name === 'customTheme') return window.customThemeLoaded !== true;
            return typeof window[name] === 'undefined';
        });
        var loadingShown = false;
        if (pendingModules.length > 0) {
            showModuleLoading();
            loadingShown = true;
        }
        return Promise.all(names.map(function (name) {
            return ModuleLoader.loadOnDemand(name).catch(function (error) {
                console.warn('[2048] Optional module failed to load: ' + name, error);
                return null;
            });
        })).then(function (result) {
            exposeModuleGlobals();
            if (window.customSelect && typeof window.customSelect.init === 'function') window.customSelect.init();
            if (!loadingShown) return result;
            return hideModuleLoading().then(function () {
                return result;
            });
        }, function (error) {
            if (!loadingShown) throw error;
            return hideModuleLoading().then(function () {
                throw error;
            });
        });
    }
    window.ensureModules = ensureModules;
    function getModulePreloadList() {
        var preload = [];
        try {
            if (localStorage.getItem('2048-setting-theme') === 'custom') preload.push('customTheme');
        } catch (e) {}
        if (window.location.hash.indexOf('#data=') === 0) preload.push('dataTransfer');
        return preload;
    }
    window.getModulePreloadList = getModulePreloadList;
    function ensureSettingsModules() {
        return ensureModules(['customTheme', 'dataTransfer', 'webrtcSync', 'aiRequest', 'aiAnalysis', 'aiAutoPlay']);
    }
    window.ensureSettingsModules = ensureSettingsModules;
    function createSettingsSection(id, titleKey, icon) {
        var section = document.createElement('div');
        section.className = 'setting-category';
        section.innerHTML = '<h3 class="text-base font-semibold text-secondary mb-2 text-left category-title flex items-center"><i class="fa-solid ' + icon + ' mr-2"></i><span data-i18n="' + titleKey + '"></span></h3><div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-2 shadow-sm"><div id="settings-module-' + id + '"></div></div>';
        return section;
    }
    function ensureModuleDom() {
        if (!document.getElementById('module-dom-root')) {
            var root = document.createElement('div');
            root.id = 'module-dom-root';
            var main = document.querySelector('main') || document.body;
            main.appendChild(root);
        }
        ensureLoadingOverlay();
        if (!document.getElementById('ai-analysis-button')) {
            var modeDescription = document.getElementById('mode-description');
            var headerRow = modeDescription ? modeDescription.closest('.flex.justify-between') : null;
            if (headerRow) {
                var aiButton = document.createElement('button');
                aiButton.id = 'ai-analysis-button';
                aiButton.className = 'bg-primary dark:bg-dark-primary hover:bg-primary/90 text-white w-12 h-12 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center';
                aiButton.innerHTML = '<i class="fa-solid fa-brain dark:text-[#282828]"></i>';
                headerRow.appendChild(aiButton);
            }
        }
        var modal = document.getElementById('settings-modal');
        if (!modal) return;
        var themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            if (!themeToggle.querySelector('option[value="custom"]')) {
                var customOption = document.createElement('option');
                customOption.value = 'custom';
                customOption.textContent = '\uf53f 自定义';
                themeToggle.appendChild(customOption);
            }
            var customSelectWrap = themeToggle.parentElement ? themeToggle.parentElement.querySelector('.custom-select') : null;
            var selectItems = customSelectWrap ? customSelectWrap.querySelector('.select-items') : null;
            if (selectItems && !selectItems.querySelector('[data-value="custom"]')) {
                var customItem = document.createElement('div');
                customItem.className = 'select-item px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white cursor-pointer transition-colors';
                customItem.setAttribute('data-value', 'custom');
                customItem.innerHTML = '<i class="fa-solid fa-palette mr-1"></i><span data-i18n="custom"></span>';
                selectItems.appendChild(customItem);
            }
        }
        if (!document.getElementById('settings-module-appearance')) {
            var appearanceCategory = themeToggle ? themeToggle.closest('.setting-category') : null;
            var appearanceCard = appearanceCategory ? appearanceCategory.lastElementChild : null;
            if (appearanceCard) {
                var appearanceMount = document.createElement('div');
                appearanceMount.id = 'settings-module-appearance';
                appearanceCard.appendChild(appearanceMount);
            }
        }
        if (document.getElementById('settings-module-data')) return;
        var container = modal.querySelector('.flex.flex-col.gap-3');
        if (!container) return;
        var anchor = document.getElementById('version-info');
        var sections = [
            createSettingsSection('data', 'dataManagement', 'fa-database'),
            createSettingsSection('ai', 'aiApiSettings', 'fa-brain'),
            createSettingsSection('operations', 'operations', 'fa-keyboard')
        ];
        sections.forEach(function (section) {
            if (anchor && anchor.parentNode === container) container.insertBefore(section, anchor);
            else container.appendChild(section);
        });
    }
    function bindPluginButtons() {
        var aiAnalysisButton = document.getElementById('ai-analysis-button');
        if (aiAnalysisButton && !aiAnalysisButton.dataset.moduleBound) {
            aiAnalysisButton.dataset.moduleBound = '1';
            aiAnalysisButton.addEventListener('click', function (event) {
                if (window.aiAnalysis) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                ensureModules(['aiRequest', 'aiAnalysis', 'aiAutoPlay']).then(function () {
                    if (window.aiAnalysis) aiAnalysisButton.click();
                });
            }, true);
        }
    }
    var moduleActions = {
        aiAnalyze: {
            deps: ['aiRequest', 'aiAnalysis', 'aiAutoPlay'],
            isReady: function () { return typeof window.analyzeGameState === 'function'; },
            run: function () { if (typeof window.analyzeGameState === 'function') window.analyzeGameState(); }
        },
        aiAutoPlay: {
            deps: ['aiAutoPlay'],
            isReady: function () { return !!(window.aiAutoPlay && typeof window.aiAutoPlay.toggle === 'function'); },
            run: function () { if (window.aiAutoPlay && typeof window.aiAutoPlay.toggle === 'function') window.aiAutoPlay.toggle(); }
        }
    };
    function runModuleAction(action, event) {
        if (event && (event.ctrlKey || event.metaKey || event.altKey)) return false;
        var definition = moduleActions[action];
        if (!definition) return false;
        if (definition.isReady()) {
            definition.run();
            return true;
        }
        ensureModules(definition.deps).then(function () {
            if (definition.isReady()) definition.run();
        });
        return true;
    }
    window.runModuleAction = runModuleAction;
    window.registerModuleModal = function (modalId, hooks) {
        modalHooks[modalId] = hooks || {};
    };
    window.getModuleModal = function (modalId) {
        return modalHooks[modalId] || null;
    };
    window.isBlockingModuleModalOpen = function () {
        var ids = Object.keys(modalHooks);
        for (var i = 0; i < ids.length; i++) {
            var hook = modalHooks[ids[i]];
            if (!hook || hook.blocksMove !== true || typeof hook.isOpen !== 'function') continue;
            var modal = document.getElementById(ids[i]);
            if (modal && hook.isOpen(modal)) return true;
        }
        return false;
    };
    registerModuleFallbacks();
    var resolveReady;
    var rejectReady;
    window.modulesReadyPromise = new Promise(function (resolve, reject) {
        resolveReady = resolve;
        rejectReady = reject;
    });
    function boot() {
        ensureModuleDom();
        ModuleLoader.loadAll().then(function () {
            exposeModuleGlobals();
            bindPluginButtons();
            resolveReady();
        }).catch(function (error) {
            console.error('Module loading failed:', error);
            var requiredFailures = (error && error.failures) || (ModuleLoader && ModuleLoader.getRequiredFailures ? ModuleLoader.getRequiredFailures() : []);
            var detailMsg = requiredFailures && requiredFailures.length
                ? requiredFailures.map(function (f) { return f.name + ': ' + (f.error || f.reason); }).join('; ')
                : (error && error.message ? error.message : '');
            if (detailMsg && error) {
                try { error.message = error.message + ' [' + detailMsg + ']'; } catch (e) {}
            }
            var show = function () {
                var loadingScreen = document.getElementById('loading-screen');
                if (!loadingScreen) return;
                var spinnerWrap = loadingScreen.querySelector('.loading-spinner-container');
                if (spinnerWrap) spinnerWrap.style.display = 'none';
                var errBox = document.getElementById('loading-error');
                if (errBox) errBox.style.display = 'flex';
                var text = window.__getLoadingErrorTexts();
                var titleEl = document.getElementById('loading-error-text');
                if (titleEl) titleEl.textContent = text.title;
                var detailEl = document.getElementById('loading-error-detail');
                if (detailEl) detailEl.textContent = text.detail + (detailMsg ? ' (' + detailMsg + ')' : '');
                var btn = document.getElementById('loading-reload-btn');
                if (btn) {
                    btn.textContent = text.reload;
                    btn.onclick = function () { location.reload(); };
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', show);
            } else {
                show();
            }
            rejectReady(error);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
