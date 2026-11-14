const dataTransferVersion = '1.7';
window.dataTransferVersion = dataTransferVersion;
const dataTransferDomTemplates = {"#module-dom-root": "        <div id=\"data-transfer-modal\" class=\"fixed inset-0 flex items-center justify-center bg-black/50 z-50 hidden\" role=\"dialog\" aria-labelledby=\"data-transfer-modal-title\" aria-modal=\"true\">\n            <div class=\"bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto text-center shadow-xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 relative\">\n                <h2 id=\"data-transfer-modal-title\" class=\"text-2xl font-bold text-secondary dark:text-dark-text mb-4\" data-i18n=\"dataTransfer\"></h2>\n                <button id=\"close-data-modal\" class=\"text-secondary/60 hover:text-secondary focus:outline-none absolute top-5 right-8 text-xl dark:text-dark-muted dark:hover:text-white\" title=\"关闭设置\">\n                    <i class=\"fa-solid fa-times\"></i>\n                </button>\n                <div class=\"flex flex-col gap-3 mb-4\">\n                    <button id=\"export-data-button\" class=\"bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50\">\n                        <i class=\"fa-solid fa-upload mr-2\"></i><span data-i18n=\"exportData\"></span>\n                    </button>\n                    <button id=\"import-data-button\" class=\"bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-6 rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50\">\n                        <i class=\"fa-solid fa-download mr-2\"></i><span data-i18n=\"importData\"></span>\n                    </button>\n                    <input type=\"file\" id=\"import-file-input\" accept=\".txt,text/plain,application/json\" class=\"hidden\">\n                </div>\n                <div class=\"relative w-full mb-0.5\">\n                    <textarea id=\"data-textarea\" class=\"w-full p-3 border border-gray-300 rounded-md h-32 text-sm dark:bg-dark-surface dark:border-dark-muted dark:text-dark-text\" style=\"word-break: break-all;\" data-i18n-placeholder=\"dataTextareaPlaceholder\"></textarea>\n                    <button id=\"copy-data-button\" class=\"absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md opacity-0 invisible transition-all duration-200 focus:outline-none\" title=\"复制数据\">\n                        <i class=\"fa-solid fa-copy text-gray-600 dark:text-gray-300\"></i>\n                    </button>\n                </div>\n                <div class=\"flex items-center justify-between gap-4 mb-4\">\n                    <div class=\"flex items-center gap-2\">\n                        <input type=\"checkbox\" id=\"export-settings-checkbox\" class=\"w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:bg-dark-surface dark:border-dark-muted\">\n                        <label for=\"export-settings-checkbox\" class=\"text-sm text-gray-700 dark:text-dark-text\" data-i18n=\"includeSettings\"></label>\n                    </div>\n                    <div class=\"flex items-center gap-2\">\n                        <label for=\"encoding-select\" class=\"text-sm text-gray-700 dark:text-dark-text\" data-i18n=\"encoding\"></label>\n                        <select id=\"encoding-select\" class=\"px-3 py-2 border border-gray-300 dark:border-dark-muted rounded-md bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary\">\n                            <option value=\"base64\">Base64</option>\n                            <option value=\"base91\">Base91</option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"flex flex-wrap justify-start gap-x-4 gap-y-2\">\n                    <button id=\"export-link-button\" class=\"text-primary hover:text-primary/80 text-sm flex items-center gap-1 transition-colors duration-200 focus:outline-none\">\n                        <i class=\"fa-solid fa-link\"></i><span data-i18n=\"exportAsLink\"></span>\n                    </button>\n                    <button id=\"export-file-button\" class=\"text-primary hover:text-primary/80 text-sm flex items-center gap-1 transition-colors duration-200 focus:outline-none\">\n                        <i class=\"fa-solid fa-file-arrow-up\"></i><span data-i18n=\"exportAsFile\"></span>\n                    </button>\n                    <button id=\"import-file-button\" class=\"text-primary hover:text-primary/80 text-sm flex items-center gap-1 transition-colors duration-200 focus:outline-none\">\n                        <i class=\"fa-solid fa-file-arrow-down\"></i><span data-i18n=\"importFromFile\"></span>\n                    </button>\n                </div>\n            </div>\n        </div>", "#settings-module-data": "                            <button id=\"data-transfer-button\" class=\"flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 rounded-lg\">\n                                <span class=\"flex items-center\">\n                                    <i class=\"fa-solid fa-database w-5 mr-2\"></i>\n                                    <span data-i18n=\"dataTransfer\"></span>\n                                </span>\n                                <i class=\"fa-solid fa-chevron-right text-xs\"></i>\n                            </button>\n                            <div class=\"border-b border-gray-200 dark:border-gray-700 my-2 mx-2\"></div>"};
let dataTransferDomBound = false;
if (window.i18n && typeof window.i18n.registerModule === 'function') {
    window.i18n.registerModule('dataTransfer');
}
const Base91 = {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"',
    decodeTable: null,
    initDecodeTable: function() {
        if (this.decodeTable) return;
        this.decodeTable = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            this.decodeTable[i] = 255;
        }
        for (let i = 0; i < this.chars.length; i++) {
            this.decodeTable[this.chars.charCodeAt(i)] = i;
        }
    },
    encode: function(str) {
        let b = 0, n = 0, out = '';
        for (let i = 0; i < str.length; i++) {
            b |= str.charCodeAt(i) << n;
            n += 8;
            if (n > 13) {
                let v = b & 8191;
                if (v > 88) {
                    b >>= 13;
                    n -= 13;
                } else {
                    v = b & 16383;
                    b >>= 14;
                    n -= 14;
                }
                out += this.chars[v % 91] + this.chars[Math.floor(v / 91)];
            }
        }
        if (n) {
            out += this.chars[b % 91];
            if (n > 7 || b > 90) {
                out += this.chars[Math.floor(b / 91)];
            }
        }
        return out;
    },
    decode: function(str) {
        this.initDecodeTable();
        let b = 0, n = 0, out = '';
        let v = -1;
        for (let i = 0; i < str.length; i++) {
            let c = this.decodeTable[str.charCodeAt(i)];
            if (c === 255) continue;
            if (v === -1) {
                v = c;
            } else {
                v += c * 91;
                b |= v << n;
                n += (v & 8191) > 88 ? 13 : 14;
                while (n > 7) {
                    out += String.fromCharCode(b & 255);
                    b >>= 8;
                    n -= 8;
                }
                v = -1;
            }
        }
        if (v !== -1) {
            out += String.fromCharCode((b | v << n) & 255);
        }
        return out;
    }
};
const SETTINGS_CONFIG = [
    { storageKey: '2048-setting-gpu-acceleration', gameStateProp: 'gpuAccelerationEnabled', uiElementId: 'gpu-acceleration', type: 'checkbox' },
    { storageKey: '2048-setting-tile-animation', gameStateProp: 'tileAnimationEnabled', uiElementId: 'tile-animation', type: 'checkbox', hasDetails: 'animation-details' },
    { storageKey: '2048-setting-tile-appear-animation', gameStateProp: 'tileAppearAnimationEnabled', uiElementId: 'tile-appear-animation', type: 'checkbox' },
    { storageKey: '2048-setting-tile-move-animation', gameStateProp: 'tileMoveAnimationEnabled', uiElementId: 'tile-move-animation', type: 'checkbox' },
    { storageKey: '2048-setting-tile-merge-animation', gameStateProp: 'tileMergeAnimationEnabled', uiElementId: 'tile-merge-animation', type: 'checkbox' },
    { storageKey: '2048-setting-vibration', gameStateProp: 'vibrationEnabled', uiElementId: 'vibration-toggle', type: 'checkbox', hasDetails: 'vibration-details', containerClass: 'vibration-toggle-container' },
    { storageKey: '2048-setting-vibration-merge', gameStateProp: 'vibrationMergeEnabled', uiElementId: 'vibration-merge', type: 'checkbox' },
    { storageKey: '2048-setting-vibration-win', gameStateProp: 'vibrationWinEnabled', uiElementId: 'vibration-win', type: 'checkbox' },
    { storageKey: '2048-setting-vibration-loss', gameStateProp: 'vibrationLossEnabled', uiElementId: 'vibration-loss', type: 'checkbox' }
];
function importSettingsToGameState(settingsConfig) {
    settingsConfig.forEach(config => {
        const value = localStorage.getItem(config.storageKey);
        window.gameState[config.gameStateProp] = value !== 'false';
    });
}
function updateSettingsUI(settingsConfig) {
    settingsConfig.forEach(config => {
        if (config.uiElementId) {
            const element = document.getElementById(config.uiElementId);
            if (element && config.type === 'checkbox') {
                element.checked = window.gameState[config.gameStateProp];
                if (config.hasDetails) {
                    const details = document.getElementById(config.hasDetails);
                    if (details) {
                        if (element.checked) {
                            details.classList.remove('collapsed');
                            if (config.containerClass != null) {
                                element.closest('.' + config.containerClass.split(' ')[0])?.classList.add('mb-2');
                            }
                        } else {
                            details.classList.add('collapsed');
                            if (config.containerClass != null) {
                                element.closest('.' + config.containerClass.split(' ')[0])?.classList.remove('mb-2');
                            }
                        }
                    }
                }
            }
        }
    });
}
function handleThemeChange(theme) {
    if (!theme) return;
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
    } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.value = theme;
    }
    const selectSelected = document.querySelector('.select-selected span');
    const selectItems = document.querySelectorAll('.select-item');
    if (selectSelected) {
        selectItems.forEach(item => {
            if (item.getAttribute('data-value') === theme) {
                selectSelected.innerHTML = item.innerHTML;
            }
        });
    }
    if (theme === 'custom' && typeof loadCustomTheme === 'function') {
        loadCustomTheme();
    }
}
function handleLanguageChange(language) {
    if (!language || !window.i18n) return;
    window.i18n.setLang(language);
}
function exportGameData() {
    try {
        const includeSettings = document.getElementById('export-settings-checkbox')?.checked || false;
        const encoding = document.getElementById('encoding-select')?.value || 'base64';
        const data = {
            version: 1,
            grid: window.gameState.grid,
            score: window.gameState.score,
            bestScore: window.gameState.bestScore,
            gridSize: window.gameState.gridSize,
            gridRows: window.gameState.gridRows,
            gridCols: window.gameState.gridCols,
            difficulty: window.gameState.difficulty,
            isEndlessMode: window.gameState.isEndlessMode,
            timestamp: Date.now(),
            encoding: encoding
        };
        if (includeSettings) {
            data.settings = window.SettingStore.getAll();
        }
        const jsonStr = JSON.stringify(data);
        let dataStr;
        if (encoding === 'base91') {
            dataStr = Base91.encode(jsonStr);
        } else {
            dataStr = btoa(jsonStr);
        }
        document.getElementById('data-textarea').value = dataStr;
        return dataStr;
    } catch (error) {
        console.error(window.i18n.t('exportFailed'), error);
        alert((window.i18n.t('exportFailed')) + error.message);
        return null;
    }
}
function exportGameDataAsFile() {
    const dataStr = exportGameData();
    if (!dataStr) return null;
    try {
        const now = new Date();
        const pad = (value) => String(value).padStart(2, '0');
        const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `2048-data-${stamp}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return dataStr;
    } catch (error) {
        console.error(window.i18n.t('exportFailed'), error);
        alert((window.i18n.t('exportFailed')) + error.message);
        return null;
    }
}
async function exportGameDataAsLink() {
    try {
        const includeSettings = document.getElementById('export-settings-checkbox')?.checked || false;
        const data = {
            version: 1,
            grid: window.gameState.grid,
            score: window.gameState.score,
            bestScore: window.gameState.bestScore,
            gridSize: window.gameState.gridSize,
            gridRows: window.gameState.gridRows,
            gridCols: window.gameState.gridCols,
            difficulty: window.gameState.difficulty,
            isEndlessMode: window.gameState.isEndlessMode,
            timestamp: Date.now(),
            encoding: 'gzip-base64url'
        };
        if (includeSettings) {
            data.settings = window.SettingStore.getAll();
        }
        const jsonStr = JSON.stringify(data);
        let dataStr;
        if (typeof CompressionStream !== 'undefined') {
            try {
                const compressedBytes = await gzipBytes(utf8Encoder.encode(jsonStr));
                dataStr = COMPRESSED_LINK_PREFIX + bytesToBase64Url(compressedBytes);
            } catch (compressError) {
                console.warn('Gzip compress failed, fallback to legacy base64url:', compressError);
                dataStr = encodeLegacyLinkData(jsonStr);
            }
        } else {
            dataStr = encodeLegacyLinkData(jsonStr);
        }
        const baseUrl = window.location.href.split('#')[0].split('?')[0];
        const link = baseUrl + '#data=' + encodeURIComponent(dataStr);
        const textarea = document.getElementById('data-textarea');
        if (textarea) {
            textarea.value = link;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link).then(() => {
                alert(window.i18n.t('linkCopied'));
            }).catch(() => {
                alert(window.i18n.t('linkExportSuccess'));
            });
        } else {
            alert(window.i18n.t('linkExportSuccess'));
        }
        return link;
    } catch (error) {
        console.error(window.i18n.t('exportFailed'), error);
        alert((window.i18n.t('exportFailed')) + error.message);
        return null;
    }
}
function normalizeBase64Url(dataStr) {
    let str = dataStr.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) {
        str += '='.repeat(4 - pad);
    }
    return str;
}
const COMPRESSED_LINK_PREFIX = 'z';
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
function bytesToBase64Url(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64UrlToBytes(dataStr) {
    const binary = atob(normalizeBase64Url(dataStr));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
function streamToBytes(stream) {
    return new Response(stream).arrayBuffer().then(buffer => new Uint8Array(buffer));
}
function gzipBytes(bytes) {
    return streamToBytes(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip')));
}
function gunzipBytes(bytes) {
    return streamToBytes(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')));
}
function encodeLegacyLinkData(jsonStr) {
    return btoa(jsonStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
let initialHashImportHandled = false;
function autoImportFromUrl() {
    initialHashImportHandled = true;
    try {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#data=')) {
            const dataStr = decodeURIComponent(hash.substring(6));
            if (dataStr) {
                if (confirm(window.i18n.t('confirmImport'))) {
                    importGameData(dataStr);
                }
                history.replaceState(null, '', window.location.href.split('#')[0]);
            }
        }
    } catch (e) {
        console.error('Auto import from URL failed:', e);
    }
}
function handleHashChangeForAutoImport() {
    if (!initialHashImportHandled) {
        return;
    }
    autoImportFromUrl();
}
function copyDataToClipboard() {
    try {
        const textarea = document.getElementById('data-textarea');
        if (!textarea.value) {
            return;
        }
        textarea.select();
        document.execCommand('copy');
        const copyButton = document.getElementById('copy-data-button');
        const originalIcon = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fa-solid fa-check text-green-600 dark:text-green-400"></i>';
        copyButton.setAttribute('title', '已复制');
        setTimeout(() => {
            copyButton.innerHTML = originalIcon;
            copyButton.setAttribute('title', '复制数据');
        }, 2000);
    } catch (error) {
        console.error(window.i18n.t('error'), error);
        alert((window.i18n.t('error')) + ' ' + error.message);
    }
}
async function importGameData(dataStr) {
    try {
        if (!dataStr) {
            console.error(window.i18n.t('consoleDataEmpty'));
            throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedEmpty')));
        }
        let decodedData;
        let data;
        const trimmedStr = dataStr.trim();
        let payloadStr = trimmedStr;
        const dataFieldMatch = trimmedStr.match(/[#?&]data=([^#&\s]+)/) || trimmedStr.match(/^\s*data=([^#&\s]+)/);
        if (dataFieldMatch) {
            try {
                payloadStr = decodeURIComponent(dataFieldMatch[1]);
            } catch (e) {
                payloadStr = dataFieldMatch[1];
            }
        }
        if (payloadStr.charAt(0) === COMPRESSED_LINK_PREFIX) {
            if (typeof DecompressionStream === 'undefined') {
                throw new Error(window.i18n.t('importFailed') + window.i18n.t('importDecompressUnsupported'));
            }
            try {
                const jsonBytes = await gunzipBytes(base64UrlToBytes(payloadStr.substring(1)));
                decodedData = utf8Decoder.decode(jsonBytes);
                data = JSON.parse(decodedData);
            } catch (e) {
                console.error(window.i18n.t('consoleBase64Failed'), e);
                throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedDecode')));
            }
        } else if (payloadStr.startsWith('~G')) {
            try {
                decodedData = Base91.decode(payloadStr);
                data = JSON.parse(decodedData);
            } catch (e) {
                console.error(window.i18n.t('consoleBase91Failed'), e);
                throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedDecode')));
            }
        } else if (payloadStr.startsWith('ey')) {
            try {
                decodedData = atob(normalizeBase64Url(payloadStr));
                data = JSON.parse(decodedData);
            } catch (e) {
                console.error(window.i18n.t('consoleBase64Failed'), e);
                throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedDecode')));
            }
        } else {
            console.error(window.i18n.t('consoleBase64Failed'), 'Unrecognized encoding prefix');
            throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedDecode')));
        }
        if (!data || typeof data !== 'object') {
            console.error(window.i18n.t('consoleInvalidObject'), { data: data, type: typeof data });
            throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedObject')));
        }
        const requiredFields = ['grid', 'score', 'bestScore', 'gridSize', 'difficulty', 'isEndlessMode'];
        const missingFields = requiredFields.filter(field => !(field in data));
        if (missingFields.length > 0) {
            console.error(window.i18n.t('consoleMissingFields'), { missingFields: missingFields, data: data });
            throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedFields', { fields: missingFields.join(', ') })));
        }
        if (!Array.isArray(data.grid) || data.grid.length === 0) {
            console.error(window.i18n.t('consoleInvalidGrid'), { grid: data.grid, isArray: Array.isArray(data.grid) });
            throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedGrid')));
        }
        const gridRows = data.gridRows || data.gridSize;
        const gridCols = data.gridCols || data.gridSize;
        if (data.grid.length !== gridRows || data.grid.some(row => row.length !== gridCols)) {
            console.error(window.i18n.t('consoleSizeMismatch'), {
                gridLength: data.grid.length,
                gridRows: gridRows,
                gridCols: gridCols,
                rowLengths: data.grid.map(row => row.length)
            });
            throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedSize')));
        }
        const invalidTiles = data.grid.flatMap(row => row.filter(tile => tile && (tile.value <= 0 || (tile.value & (tile.value - 1)) !== 0)));
        if (invalidTiles.length > 0) {
            console.error(window.i18n.t('consoleInvalidTiles'), { invalidTiles: invalidTiles });
            throw new Error((window.i18n.t('importFailed')) + ' ' + (window.i18n.t('importFailedTiles')));
        }
        const shouldImportSettings = data.settings && confirm(window.i18n.t('confirmImportSettings'));
        window.gameState.grid = data.grid;
        window.gameState.score = data.score;
        window.gameState.bestScore = data.bestScore;
        window.gameState.gridSize = data.gridSize;
        window.gameState.gridRows = gridRows;
        window.gameState.gridCols = gridCols;
        window.gameState.difficulty = data.difficulty;
        window.gameState.isEndlessMode = data.isEndlessMode;
        const gameContainer = document.querySelector('.game-container');
        gameContainer.classList.remove('grid-3x3', 'grid-4x4', 'grid-5x5');
        gameContainer.classList.add(`grid-${gridRows}x${gridCols}`);
        if (typeof generateGridStyles === 'function') {
            generateGridStyles(null, gridRows, gridCols);
        }
        if (typeof initGridContainer === 'function') {
            initGridContainer();
        }
        if (typeof updateDocumentTitle === 'function') {
            updateDocumentTitle();
        }
        if (typeof renderAllTiles === 'function') {
            renderAllTiles();
        }
        if (window.elements && window.elements.scoreDisplay) {
            window.elements.scoreDisplay.textContent = window.gameState.score;
        }
        if (window.elements && window.elements.bestScoreDisplay) {
            window.elements.bestScoreDisplay.textContent = window.gameState.bestScore;
        }
        if (window.elements && window.elements.modeDescription) {
            window.elements.modeDescription.textContent = (window.i18n.t('modeDescription')) + (window.gameState.isEndlessMode ? (window.i18n.t('endlessModeDesc')) : (window.i18n.t('standardMode')));
        }
        if (window.elements && window.elements.difficultyDescription) {
            window.elements.difficultyDescription.textContent = window.i18n.t('difficultyDescription') + window.i18n.t(window.gameState.difficulty) + ` - ${gridRows}×${gridCols}` + window.i18n.t('grid');
        }
        if (typeof saveGameState === 'function') {
            saveGameState();
        }
        window.gameState.history = [];
        if (typeof updateUndoButtonState === 'function') {
            updateUndoButtonState();
        }
        if (shouldImportSettings) {
            for (const [key, value] of Object.entries(data.settings)) {
                if (value !== null && value !== undefined) {
                    window.SettingStore.set(key, value);
                }
            }
            importSettingsToGameState(SETTINGS_CONFIG);
            updateSettingsUI(SETTINGS_CONFIG);
            handleThemeChange(localStorage.getItem('2048-setting-theme'));
            handleLanguageChange(localStorage.getItem('2048-setting-language'));
            return;
        }
        alert(window.i18n.t('importSuccess'));
        return true;
    } catch (e) {
        console.error(window.i18n.t('consoleImportFailed'), e);
        console.error(window.i18n.t('consoleErrorDetails'), {
            message: e.message,
            stack: e.stack,
            dataLength: dataStr ? dataStr.length : 0,
            dataPreview: dataStr ? dataStr.substring(0, 100) + '...' : 'null'
        });
        alert(e.message);
        return false;
    }
}
(function() {
    try {
        window.dataTransferModuleLoaded = true;
        window.addEventListener('hashchange', handleHashChangeForAutoImport);
    } catch (error) {
        console.warn('Data transfer module loading failed:', error);
        window.dataTransferModuleLoaded = false;
    }
})();
function initDataTransfer() {
    if (dataTransferDomBound) return;
    const dataTransferButton = document.getElementById('data-transfer-button');
    const dataTransferModal = document.getElementById('data-transfer-modal');
    const exportDataButton = document.getElementById('export-data-button');
    const importDataButton = document.getElementById('import-data-button');
    const exportLinkButton = document.getElementById('export-link-button');
    const exportFileButton = document.getElementById('export-file-button');
    const importFileButton = document.getElementById('import-file-button');
    const importFileInput = document.getElementById('import-file-input');
    const dataTextarea = document.getElementById('data-textarea');
    const closeDataModal = document.getElementById('close-data-modal');
    const copyButton = document.getElementById('copy-data-button');
    const textareaContainer = dataTextarea ? dataTextarea.closest('.relative') : null;
    if (!dataTransferButton || !dataTransferModal || !exportDataButton || !importDataButton || !exportLinkButton || !exportFileButton || !importFileButton || !importFileInput || !dataTextarea || !closeDataModal) {
        return;
    }
    function handleImportClick() {
        const data = dataTextarea.value.trim();
        if (data && confirm(window.i18n.t('confirmImport'))) {
            importGameData(data);
        }
    }
    dataTransferButton.addEventListener('click', () => {
        if (typeof window.showModal === 'function') {
            window.showModal('data-transfer-modal');
            return;
        }
        dataTransferModal.classList.remove('hidden');
        const panel = dataTransferModal.querySelector('div');
        if (panel) {
            panel.classList.remove('scale-95', 'opacity-0');
            panel.classList.add('scale-100', 'opacity-100');
        }
    });
    exportDataButton.addEventListener('click', exportGameData);
    importDataButton.addEventListener('click', handleImportClick);
    exportLinkButton.addEventListener('click', exportGameDataAsLink);
    exportFileButton.addEventListener('click', exportGameDataAsFile);
    importFileButton.addEventListener('click', () => {
        importFileInput.value = '';
        importFileInput.click();
    });
    importFileInput.addEventListener('change', async () => {
        const file = importFileInput.files && importFileInput.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const data = text.trim();
            if (!data) return;
            dataTextarea.value = data;
            if (confirm(window.i18n.t('confirmImport'))) {
                importGameData(data);
            }
        } catch (error) {
            alert((window.i18n.t('importFailed')) + ' ' + error.message);
        }
    });
    closeDataModal.addEventListener('click', () => {
        if (typeof window.hideModal === 'function') {
            window.hideModal('data-transfer-modal');
            return;
        }
        const panel = dataTransferModal.querySelector('div');
        if (panel) {
            panel.classList.remove('scale-100', 'opacity-100');
            panel.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            dataTransferModal.classList.add('hidden');
        }, 300);
    });
    if (textareaContainer && copyButton) {
        textareaContainer.addEventListener('mouseenter', () => {
            copyButton.classList.remove('opacity-0', 'invisible');
            copyButton.classList.add('opacity-70', 'visible');
        });
        textareaContainer.addEventListener('mouseleave', () => {
            copyButton.classList.add('opacity-0', 'invisible');
            copyButton.classList.remove('opacity-70', 'visible');
        });
        copyButton.addEventListener('click', copyDataToClipboard);
    }
    dataTransferDomBound = true;
    if (!initialHashImportHandled) {
        autoImportFromUrl();
    }
}
if (typeof window !== 'undefined') {
    window.dataTransfer = {
        version: dataTransferVersion,
        exportGameData: exportGameData,
        importGameData: importGameData,
        exportGameDataAsLink: exportGameDataAsLink,
        exportGameDataAsFile: exportGameDataAsFile,
        copyDataToClipboard: copyDataToClipboard,
        autoImportFromUrl: autoImportFromUrl,
        init: initDataTransfer,
        domTemplates: dataTransferDomTemplates,
        isDomReady: function () {
            return !!document.getElementById('data-transfer-modal') && !!document.getElementById('data-transfer-button');
        }
    };
}