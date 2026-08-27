const dataTransferVersion = '1.1';
window.dataTransferVersion = dataTransferVersion;
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
    { storageKey: '2048-gpu-acceleration', gameStateProp: 'gpuAccelerationEnabled', uiElementId: 'gpu-acceleration', type: 'checkbox' },
    { storageKey: '2048-tile-animation', gameStateProp: 'tileAnimationEnabled', uiElementId: 'tile-animation', type: 'checkbox', hasDetails: 'animation-details' },
    { storageKey: '2048-tile-appear-animation', gameStateProp: 'tileAppearAnimationEnabled', uiElementId: 'tile-appear-animation', type: 'checkbox' },
    { storageKey: '2048-tile-move-animation', gameStateProp: 'tileMoveAnimationEnabled', uiElementId: 'tile-move-animation', type: 'checkbox' },
    { storageKey: '2048-tile-merge-animation', gameStateProp: 'tileMergeAnimationEnabled', uiElementId: 'tile-merge-animation', type: 'checkbox' },
    { storageKey: '2048-vibration', gameStateProp: 'vibrationEnabled', uiElementId: 'vibration-toggle', type: 'checkbox', hasDetails: 'vibration-details', containerClass: 'vibration-toggle-container' },
    { storageKey: '2048-vibration-merge', gameStateProp: 'vibrationMergeEnabled', uiElementId: 'vibration-merge', type: 'checkbox' },
    { storageKey: '2048-vibration-win', gameStateProp: 'vibrationWinEnabled', uiElementId: 'vibration-win', type: 'checkbox' },
    { storageKey: '2048-vibration-loss', gameStateProp: 'vibrationLossEnabled', uiElementId: 'vibration-loss', type: 'checkbox' }
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
            grid: window.gameState.grid,
            score: window.gameState.score,
            bestScore: window.gameState.bestScore,
            gridSize: window.gameState.gridSize,
            gridRows: window.gameState.gridRows,
            gridCols: window.gameState.gridCols,
            difficulty: window.gameState.difficulty,
            isEndlessMode: window.gameState.isEndlessMode,
            timestamp: new Date().toISOString(),
            encoding: encoding
        };
        if (includeSettings) {
            data.settings = {
                '2048-theme': localStorage.getItem('2048-theme'),
                'customTheme': localStorage.getItem('customTheme'),
                '2048-gpu-acceleration': localStorage.getItem('2048-gpu-acceleration'),
                '2048-tile-animation': localStorage.getItem('2048-tile-animation'),
                '2048-tile-appear-animation': localStorage.getItem('2048-tile-appear-animation'),
                '2048-tile-move-animation': localStorage.getItem('2048-tile-move-animation'),
                '2048-tile-merge-animation': localStorage.getItem('2048-tile-merge-animation'),
                '2048-vibration': localStorage.getItem('2048-vibration'),
                '2048-vibration-merge': localStorage.getItem('2048-vibration-merge'),
                '2048-vibration-win': localStorage.getItem('2048-vibration-win'),
                '2048-vibration-loss': localStorage.getItem('2048-vibration-loss'),
                '2048-language': localStorage.getItem('2048-language')
            };
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
        console.error(window.i18n ? window.i18n.t('exportFailed') : 'Export failed', error);
        alert((window.i18n ? window.i18n.t('exportFailed') : 'Export failed') + error.message);
        return null;
    }
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
        console.error(window.i18n ? window.i18n.t('error') : 'Error', error);
        alert((window.i18n ? window.i18n.t('error') : 'Error') + ' ' + error.message);
    }
}
function importGameData(dataStr) {
    try {
        if (!dataStr) {
            console.error(window.i18n ? window.i18n.t('consoleDataEmpty') : 'Data is empty');
            throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedEmpty') : 'Data is empty'));
        }
        let decodedData;
        let data;
        const trimmedStr = dataStr.trim();
        if (trimmedStr.startsWith('~G')) {
            try {
                decodedData = Base91.decode(trimmedStr);
                data = JSON.parse(decodedData);
            } catch (e) {
                console.error(window.i18n ? window.i18n.t('consoleBase91Failed') : 'Base91 decode failed', e);
                throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedDecode') : 'Decode failed'));
            }
        } else if (trimmedStr.startsWith('ey')) {
            try {
                decodedData = atob(trimmedStr);
                data = JSON.parse(decodedData);
            } catch (e) {
                console.error(window.i18n ? window.i18n.t('consoleBase64Failed') : 'Base64 decode failed', e);
                throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedDecode') : 'Decode failed'));
            }
        } else {
            console.error(window.i18n ? window.i18n.t('consoleBase64Failed') : 'Base64 decode failed', 'Unrecognized encoding prefix');
            throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedDecode') : 'Decode failed'));
        }
        if (!data || typeof data !== 'object') {
            console.error(window.i18n ? window.i18n.t('consoleInvalidObject') : 'Invalid object', { data: data, type: typeof data });
            throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedObject') : 'Invalid object'));
        }
        const requiredFields = ['grid', 'score', 'bestScore', 'gridSize', 'difficulty', 'isEndlessMode'];
        const missingFields = requiredFields.filter(field => !(field in data));
        if (missingFields.length > 0) {
            console.error(window.i18n ? window.i18n.t('consoleMissingFields') : 'Missing fields', { missingFields: missingFields, data: data });
            throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedFields', { fields: missingFields.join(', ') }) : 'Missing fields: ' + missingFields.join(', ')));
        }
        if (!Array.isArray(data.grid) || data.grid.length === 0) {
            console.error(window.i18n ? window.i18n.t('consoleInvalidGrid') : 'Invalid grid', { grid: data.grid, isArray: Array.isArray(data.grid) });
            throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedGrid') : 'Invalid grid'));
        }
        const gridRows = data.gridRows || data.gridSize;
        const gridCols = data.gridCols || data.gridSize;
        if (data.grid.length !== gridRows || data.grid.some(row => row.length !== gridCols)) {
            console.error(window.i18n ? window.i18n.t('consoleSizeMismatch') : 'Size mismatch', {
                gridLength: data.grid.length,
                gridRows: gridRows,
                gridCols: gridCols,
                rowLengths: data.grid.map(row => row.length)
            });
            throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedSize') : 'Size mismatch'));
        }
        const invalidTiles = data.grid.flatMap(row => row.filter(tile => tile && (tile.value <= 0 || (tile.value & (tile.value - 1)) !== 0)));
        if (invalidTiles.length > 0) {
            console.error(window.i18n ? window.i18n.t('consoleInvalidTiles') : 'Invalid tiles', { invalidTiles: invalidTiles });
            throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedTiles') : 'Invalid tiles'));
        }
        const shouldImportSettings = data.settings && confirm(window.i18n ? window.i18n.t('confirmImportSettings') : 'Import settings?');
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
            window.elements.modeDescription.textContent = (window.i18n ? window.i18n.t('modeDescription') : 'Mode') + (window.gameState.isEndlessMode ? (window.i18n ? window.i18n.t('endlessModeDesc') : 'Endless') : (window.i18n ? window.i18n.t('standardMode') : 'Standard'));
        }
        if (window.elements && window.elements.difficultyDescription) {
            window.elements.difficultyDescription.textContent = (window.i18n ? window.i18n.t('difficultyDescription') : 'Difficulty') + (window.i18n ? window.i18n.t(window.gameState.difficulty) : window.gameState.difficulty) + ` - ${gridRows}×${gridCols}` + (window.i18n ? window.i18n.t('grid') : '');
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
                    localStorage.setItem(key, value);
                }
            }
            importSettingsToGameState(SETTINGS_CONFIG);
            updateSettingsUI(SETTINGS_CONFIG);
            handleThemeChange(data.settings['2048-theme']);
            handleLanguageChange(data.settings['2048-language']);
            return;
        }
        alert(window.i18n ? window.i18n.t('importSuccess') : 'Import success');
        return true;
    } catch (e) {
        console.error(window.i18n ? window.i18n.t('consoleImportFailed') : 'Import failed', e);
        console.error(window.i18n ? window.i18n.t('consoleErrorDetails') : 'Error details', {
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
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDataTransfer);
        } else {
            initDataTransfer();
        }
    } catch (error) {
        console.warn('Data transfer module loading failed:', error);
        window.dataTransferModuleLoaded = false;
    }
})();
function initDataTransfer() {
    const textarea = document.getElementById('data-textarea');
    const textareaContainer = textarea ? textarea.closest('.relative') : null;
    const copyButton = document.getElementById('copy-data-button');
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
}