const tileFontVersion = '1.0';
window.tileFontVersion = tileFontVersion;
if (window.i18n && typeof window.i18n.registerModule === 'function') {
    window.i18n.registerModule('tileFont');
}
const TILE_FONT_STORAGE_KEY = '2048-setting-tile-font';
const TILE_FONT_DEFAULT = 'inter';
const TILE_FONT_OPTIONS = [
    { value: 'system', family: null, file: null, weight: '400' },
    { value: 'inter', family: 'Inter', file: 'fonts/Inter-700.woff2', weight: '700' },
    { value: 'nunito', family: 'Nunito', file: 'fonts/Nunito-700.woff2', weight: '700' },
    { value: 'press-start-2p', family: 'Press Start 2P', file: 'fonts/PressStart2P-400.woff2', weight: '400' },
    { value: 'jetbrains-mono', family: 'JetBrains Mono', file: 'fonts/JetBrainsMono-700.woff2', weight: '700' }
];
const tileFontLoaded = {};
const tileFontPending = {};
let tileFontCurrent = TILE_FONT_DEFAULT;
let tileFontUiBound = false;
let tileFontSwitchToken = 0;
let tileFontStatusTimer = null;
function tileFontT(key) {
    return window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(key) : key;
}
function findTileFontOption(value) {
    for (let i = 0; i < TILE_FONT_OPTIONS.length; i++) {
        if (TILE_FONT_OPTIONS[i].value === value) return TILE_FONT_OPTIONS[i];
    }
    return null;
}
function readTileFontSetting() {
    try {
        const value = localStorage.getItem(TILE_FONT_STORAGE_KEY);
        return value && findTileFontOption(value) ? value : TILE_FONT_DEFAULT;
    } catch (e) {
        return TILE_FONT_DEFAULT;
    }
}
function saveTileFontSetting(value) {
    try {
        localStorage.setItem(TILE_FONT_STORAGE_KEY, value);
    } catch (e) {}
}
function applyTileFont(value, persist) {
    const option = findTileFontOption(value) || findTileFontOption(TILE_FONT_DEFAULT);
    tileFontCurrent = option.value;
    document.documentElement.setAttribute('data-tile-font', option.value);
    if (persist) saveTileFontSetting(option.value);
}
function loadTileFontFile(value) {
    const option = findTileFontOption(value);
    if (!option || !option.family) return Promise.resolve(true);
    if (tileFontLoaded[value]) return Promise.resolve(true);
    if (tileFontPending[value]) return tileFontPending[value];
    if (!window.FontFace || !document.fonts) return Promise.resolve(false);
    let face;
    try {
        face = new FontFace(option.family, 'url("' + option.file + '")', {
            weight: option.weight,
            style: 'normal',
            display: 'swap'
        });
    } catch (e) {
        return Promise.resolve(false);
    }
    tileFontPending[value] = face.load().then(function (loaded) {
        document.fonts.add(loaded);
        tileFontLoaded[value] = true;
        delete tileFontPending[value];
        return true;
    }).catch(function () {
        delete tileFontPending[value];
        return false;
    });
    return tileFontPending[value];
}
function setTileFontStatus(state) {
    const status = document.getElementById('tile-font-status');
    if (!status) return;
    if (tileFontStatusTimer) {
        clearTimeout(tileFontStatusTimer);
        tileFontStatusTimer = null;
    }
    status.textContent = '';
    if (state === 'loading') {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-spinner fa-spin mr-1';
        status.appendChild(icon);
        status.appendChild(document.createTextNode(tileFontT('tileFontLoading')));
    } else if (state === 'ready') {
        status.textContent = tileFontT('tileFontLoaded');
        tileFontStatusTimer = setTimeout(function () {
            tileFontStatusTimer = null;
            status.textContent = '';
        }, 1600);
    } else if (state === 'failed') {
        status.textContent = tileFontT('tileFontFailed');
    }
}
function syncTileFontSelect() {
    const select = document.getElementById('tile-font-select');
    if (!select) return;
    select.value = tileFontCurrent;
    const wrapper = select.closest('.custom-select');
    if (!wrapper) return;
    const display = wrapper.querySelector('.select-selected span');
    wrapper.querySelectorAll('.select-item').forEach(function (item) {
        const selected = item.getAttribute('data-value') === tileFontCurrent;
        item.classList.toggle('selected', selected);
        if (selected && display) display.innerHTML = item.innerHTML;
    });
}
function switchTileFont(value, persist) {
    const option = findTileFontOption(value) || findTileFontOption(TILE_FONT_DEFAULT);
    applyTileFont(option.value, persist);
    syncTileFontSelect();
    if (!option.family) {
        setTileFontStatus('');
        return Promise.resolve(true);
    }
    if (tileFontLoaded[option.value]) {
        setTileFontStatus('');
        return Promise.resolve(true);
    }
    const token = ++tileFontSwitchToken;
    setTileFontStatus('loading');
    return loadTileFontFile(option.value).then(function (ok) {
        if (token !== tileFontSwitchToken) return ok;
        if (ok) {
            setTileFontStatus('ready');
            return true;
        }
        applyTileFont('system', true);
        syncTileFontSelect();
        setTileFontStatus('failed');
        return false;
    });
}
function bindTileFontUi() {
    if (tileFontUiBound) return;
    const select = document.getElementById('tile-font-select');
    if (!select) return;
    tileFontUiBound = true;
    select.addEventListener('change', function () {
        switchTileFont(select.value, true);
    });
}
function scheduleTileFontWarmUp() {
    const start = function () {
        if (tileFontCurrent !== 'system' && !tileFontLoaded[tileFontCurrent]) {
            switchTileFont(tileFontCurrent, false);
        }
    };
    const idle = function () {
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(start, { timeout: 1500 });
        } else {
            setTimeout(start, 120);
        }
    };
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
}
function initTileFont() {
    tileFontCurrent = readTileFontSetting();
    applyTileFont(tileFontCurrent, false);
    bindTileFontUi();
    syncTileFontSelect();
    scheduleTileFontWarmUp();
}
function syncTileFont() {
    applyTileFont(readTileFontSetting(), false);
    syncTileFontSelect();
    if (tileFontCurrent !== 'system' && !tileFontLoaded[tileFontCurrent]) {
        switchTileFont(tileFontCurrent, false);
    }
}
function resetTileFont() {
    try {
        localStorage.removeItem(TILE_FONT_STORAGE_KEY);
    } catch (e) {}
    setTileFontStatus('');
    applyTileFont(TILE_FONT_DEFAULT, false);
    syncTileFontSelect();
    switchTileFont(TILE_FONT_DEFAULT, false);
}
window.tileFont = {
    version: tileFontVersion,
    init: initTileFont,
    sync: syncTileFont,
    reset: resetTileFont,
    isDomReady: function () {
        return !!document.getElementById('tile-font-select');
    }
};
window.tileFontModuleLoaded = true;
