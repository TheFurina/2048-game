const keybindingsVersion = '1.1';
window.keybindingsVersion = keybindingsVersion;
const keybindingsDomTemplates = {"#module-dom-root": "        <div id=\"keybindings-modal\" data-no-autofocus=\"true\" class=\"fixed inset-0 flex items-center justify-center bg-black/50 z-50 hidden\" role=\"dialog\" aria-labelledby=\"keybindings-modal-title\" aria-modal=\"true\">\n            <div class=\"bg-gray-50 dark:bg-dark-surface rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto text-center shadow-xl transform transition-all duration-300 scale-95 opacity-0\">\n                <h2 id=\"keybindings-modal-title\" class=\"text-2xl font-bold text-secondary dark:text-dark-text mb-4\" data-i18n=\"keybindingsSettings\"></h2>\n                <div id=\"keybindings-list\" class=\"space-y-1 text-left\"></div>\n                <p class=\"text-xs text-secondary/60 dark:text-dark-muted mt-3\" data-i18n=\"keybindingsTip\"></p>\n                <div class=\"flex justify-center gap-2 mt-6\">\n                    <button id=\"reset-keybindings-button\" class=\"px-6 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 min-w-[80px]\"><i class=\"fa-solid fa-rotate-right\"></i><span data-i18n=\"resetToDefault\"></span></button>\n                    <button id=\"close-keybindings-button\" class=\"px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm transition-colors flex items-center justify-center gap-2 w-[100px]\"><i class=\"fa-solid fa-check\"></i><span data-i18n=\"done\"></span></button>\n                </div>\n                <button id=\"close-keybindings-x\" class=\"text-secondary/60 hover:text-secondary focus:outline-none absolute top-5 right-8 text-xl dark:text-dark-muted dark:hover:text-white\" title=\"关闭\">\n                    <i class=\"fa-solid fa-times\"></i>\n                </button>\n            </div>\n        </div>", "#settings-module-operations": "                            <button id=\"keybindings-button\" class=\"flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 rounded-lg\">\n                                <span class=\"flex items-center\">\n                                    <i class=\"fa-solid fa-keyboard w-5 mr-2\"></i>\n                                    <span data-i18n=\"keybindingsSettings\"></span>\n                                </span>\n                                <i class=\"fa-solid fa-chevron-right text-xs\"></i>\n                            </button>"};
const defaultKeyBindings = {
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
const keyBindingActions = [
    { action: 'up', key: 'kbUp' },
    { action: 'down', key: 'kbDown' },
    { action: 'left', key: 'kbLeft' },
    { action: 'right', key: 'kbRight' },
    { action: 'pause', key: 'kbPause' },
    { action: 'undo', key: 'kbUndo' },
    { action: 'restart', key: 'restart' },
    { action: 'newGame', key: 'kbNewGame' },
    { action: 'endless', key: 'endlessMode' },
    { action: 'grid', key: 'kbGrid' },
    { action: 'aiAnalyze', key: 'aiAiAnalysis' },
    { action: 'aiAutoPlay', key: 'kbAiAutoPlay' }
];
let keyBindings = { ...defaultKeyBindings };
let activeKeyCaptureHandler = null;
let keyCaptureAction = null;
let keybindingsUiBound = false;
function getKeybindingsI18n() {
    return window.i18n || null;
}
function loadKeyBindings() {
    try {
        const saved = JSON.parse(localStorage.getItem('2048-setting-keybindings'));
        if (saved) {
            Object.keys(defaultKeyBindings).forEach(action => {
                if (typeof saved[action] === 'string') {
                    keyBindings[action] = saved[action];
                }
            });
        }
    } catch (e) {}
}
function saveKeyBindings() {
    localStorage.setItem('2048-setting-keybindings', JSON.stringify(keyBindings));
}
function formatKeyName(k) {
    const i18n = getKeybindingsI18n();
    if (!k) return i18n ? i18n.t('notSet') : '';
    const nameMap = {
        ' ': 'Space',
        'escape': 'Esc',
        'arrowup': '↑',
        'arrowdown': '↓',
        'arrowleft': '←',
        'arrowright': '→',
        'enter': 'Enter',
        'tab': 'Tab',
        'backspace': 'Backspace',
        'delete': 'Del'
    };
    return nameMap[k] || k.toUpperCase();
}
function cancelActiveKeyCapture() {
    if (activeKeyCaptureHandler) {
        document.removeEventListener('keydown', activeKeyCaptureHandler, true);
        activeKeyCaptureHandler = null;
    }
    keyCaptureAction = null;
}
function findKeyConflicts() {
    const byKey = {};
    Object.keys(keyBindings).forEach(a => {
        const k = keyBindings[a];
        if (k) {
            if (!byKey[k]) byKey[k] = [];
            byKey[k].push(a);
        }
    });
    const conflicts = new Set();
    Object.values(byKey).forEach(actions => {
        if (actions.length > 1) {
            actions.forEach(a => conflicts.add(a));
        }
    });
    return conflicts;
}
function renderKeybindingsList() {
    const list = document.getElementById('keybindings-list');
    if (!list) return;
    const i18n = getKeybindingsI18n();
    list.innerHTML = '';
    const conflicts = findKeyConflicts();
    if (keyCaptureAction && conflicts.has(keyCaptureAction)) {
        const captureKey = keyBindings[keyCaptureAction];
        Object.keys(keyBindings).forEach(a => {
            if (a !== keyCaptureAction && keyBindings[a] === captureKey) {
                conflicts.delete(a);
            }
        });
    }
    keyBindingActions.forEach(({ action, key }) => {
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
        const labelSpan = document.createElement('span');
        labelSpan.className = 'text-sm text-gray-700 dark:text-dark-text';
        labelSpan.textContent = i18n ? i18n.t(key) : key;
        const isConflict = conflicts.has(action) && action !== keyCaptureAction;
        const btn = document.createElement('button');
        btn.className = isConflict
            ? 'px-3 py-1 min-w-[64px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 border border-red-500 rounded-md text-sm font-mono transition-colors'
            : 'px-3 py-1 min-w-[64px] bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md text-sm font-mono transition-colors hover:bg-gray-300 dark:hover:bg-gray-500';
        btn.textContent = formatKeyName(keyBindings[action]);
        btn.dataset.action = action;
        btn.addEventListener('click', () => startKeyCapture(action));
        row.appendChild(labelSpan);
        const wrap = document.createElement('span');
        wrap.className = 'flex items-center gap-1';
        if (isConflict) {
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-circle-exclamation text-red-500';
            icon.title = i18n ? i18n.t('keybindingConflict') : '';
            wrap.appendChild(icon);
        }
        if (action === 'undo') {
            const prefix = document.createElement('span');
            prefix.className = 'text-sm text-gray-500 dark:text-dark-muted font-mono';
            prefix.textContent = 'Ctrl/⌘ +';
            wrap.appendChild(prefix);
        }
        wrap.appendChild(btn);
        row.appendChild(wrap);
        list.appendChild(row);
    });
}
function startKeyCapture(action) {
    cancelActiveKeyCapture();
    keyCaptureAction = action;
    renderKeybindingsList();
    const list = document.getElementById('keybindings-list');
    if (!list) return;
    const btn = list.querySelector(`button[data-action="${action}"]`);
    if (!btn) return;
    const i18n = getKeybindingsI18n();
    btn.textContent = i18n ? i18n.t('pressKey') : '';
    btn.classList.add('bg-primary', 'text-white', 'animate-pulse');
    const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (['shift', 'control', 'alt', 'meta'].includes(e.key.toLowerCase())) return;
        document.removeEventListener('keydown', handler, true);
        if (activeKeyCaptureHandler === handler) activeKeyCaptureHandler = null;
        keyCaptureAction = null;
        if (e.key !== 'Escape') {
            keyBindings[action] = e.key.toLowerCase();
            if (findKeyConflicts().size === 0) {
                saveKeyBindings();
            }
        }
        renderKeybindingsList();
    };
    activeKeyCaptureHandler = handler;
    document.addEventListener('keydown', handler, true);
}
function resolveAction(key) {
    const actions = Object.keys(keyBindings);
    for (let i = 0; i < actions.length; i++) {
        if (keyBindings[actions[i]] === key) return actions[i];
    }
    return null;
}
function resetKeyBindings() {
    cancelActiveKeyCapture();
    keyBindings = { ...defaultKeyBindings };
    saveKeyBindings();
    const modal = document.getElementById('keybindings-modal');
    if (modal && !modal.classList.contains('hidden')) {
        renderKeybindingsList();
    }
}
function openKeybindingsModal() {
    renderKeybindingsList();
    if (typeof window.showModal === 'function') {
        window.showModal('keybindings-modal');
        return;
    }
    const modal = document.getElementById('keybindings-modal');
    if (modal) modal.classList.remove('hidden');
}
function hideKeybindingsModal() {
    if (typeof window.hideModal === 'function') {
        window.hideModal('keybindings-modal');
        return;
    }
    const modal = document.getElementById('keybindings-modal');
    if (modal) modal.classList.add('hidden');
}
function bindKeybindingsUi() {
    if (keybindingsUiBound) return;
    const keybindingsButton = document.getElementById('keybindings-button');
    const closeKeybindingsButton = document.getElementById('close-keybindings-button');
    const closeKeybindingsX = document.getElementById('close-keybindings-x');
    const resetKeybindingsButton = document.getElementById('reset-keybindings-button');
    if (!keybindingsButton) return;
    const i18n = getKeybindingsI18n();
    keybindingsButton.addEventListener('click', openKeybindingsModal);
    if (closeKeybindingsButton) {
        closeKeybindingsButton.addEventListener('click', () => {
            cancelActiveKeyCapture();
            if (findKeyConflicts().size > 0) {
                alert(i18n ? i18n.t('keybindingConflict') : '');
                return;
            }
            hideKeybindingsModal();
        });
    }
    if (closeKeybindingsX) {
        closeKeybindingsX.addEventListener('click', () => {
            cancelActiveKeyCapture();
            hideKeybindingsModal();
        });
    }
    if (resetKeybindingsButton) {
        resetKeybindingsButton.addEventListener('click', resetKeyBindings);
    }
    keybindingsUiBound = true;
}
function initKeybindings() {
    loadKeyBindings();
    bindKeybindingsUi();
}
loadKeyBindings();
window.keybindings = {
    version: keybindingsVersion,
    domTemplates: keybindingsDomTemplates,
    init: initKeybindings,
    resolveAction: resolveAction,
    isCapturing: function () { return !!activeKeyCaptureHandler; },
    reset: resetKeyBindings,
    render: renderKeybindingsList,
    isDomReady: function () {
        return !!document.getElementById('keybindings-modal') && !!document.getElementById('keybindings-button');
    }
};
window.keybindingsModuleLoaded = true;
