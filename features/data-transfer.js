const dataTransferVersion = '1.0';
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
        try {
            decodedData = atob(dataStr);
            data = JSON.parse(decodedData);
        } catch (e) {
            console.error(window.i18n ? window.i18n.t('consoleBase64Failed') : 'Base64 decode failed', e);
            try {
                decodedData = Base91.decode(dataStr);
                data = JSON.parse(decodedData);
            } catch (e2) {
                console.error(window.i18n ? window.i18n.t('consoleBase91Failed') : 'Base91 decode failed', e2);
                throw new Error((window.i18n ? window.i18n.t('importFailed') : 'Import failed') + ' ' + (window.i18n ? window.i18n.t('importFailedDecode') : 'Decode failed'));
            }
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
            window.gameState.gpuAccelerationEnabled = localStorage.getItem('2048-gpu-acceleration') !== 'false';
            window.gameState.tileAnimationEnabled = localStorage.getItem('2048-tile-animation') !== 'false';
            window.gameState.tileAppearAnimationEnabled = localStorage.getItem('2048-tile-appear-animation') !== 'false';
            window.gameState.tileMoveAnimationEnabled = localStorage.getItem('2048-tile-move-animation') !== 'false';
            window.gameState.tileMergeAnimationEnabled = localStorage.getItem('2048-tile-merge-animation') !== 'false';
            window.gameState.vibrationEnabled = localStorage.getItem('2048-vibration') !== 'false';
            window.gameState.vibrationMergeEnabled = localStorage.getItem('2048-vibration-merge') !== 'false';
            window.gameState.vibrationWinEnabled = localStorage.getItem('2048-vibration-win') !== 'false';
            window.gameState.vibrationLossEnabled = localStorage.getItem('2048-vibration-loss') !== 'false';
            const importedTheme = data.settings['2048-theme'];
            if (importedTheme) {
                if (importedTheme === 'auto') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.classList.toggle('dark', prefersDark);
                } else if (importedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) {
                    themeToggle.value = importedTheme;
                }
                const selectSelected = document.querySelector('.select-selected span');
                const selectItems = document.querySelectorAll('.select-item');
                if (selectSelected) {
                    selectItems.forEach(item => {
                        if (item.getAttribute('data-value') === importedTheme) {
                            selectSelected.innerHTML = item.innerHTML;
                        }
                    });
                }
                if (importedTheme === 'custom' && typeof loadCustomTheme === 'function') {
                    loadCustomTheme();
                }
            }
            const importedLanguage = data.settings['2048-language'];
            if (importedLanguage && window.i18n) {
                window.i18n.setLang(importedLanguage);
            }
            const gpuAccelCheckbox = document.getElementById('gpu-acceleration');
            if (gpuAccelCheckbox) {
                gpuAccelCheckbox.checked = localStorage.getItem('2048-gpu-acceleration') !== 'false';
            }
            const tileAnimationCheckbox = document.getElementById('tile-animation');
            if (tileAnimationCheckbox) {
                tileAnimationCheckbox.checked = localStorage.getItem('2048-tile-animation') !== 'false';
                const animationDetails = document.getElementById('animation-details');
                if (animationDetails) {
                    if (tileAnimationCheckbox.checked) {
                        animationDetails.classList.remove('collapsed');
                    } else {
                        animationDetails.classList.add('collapsed');
                    }
                }
            }
            const appearAnimationCheckbox = document.getElementById('tile-appear-animation');
            if (appearAnimationCheckbox) {
                appearAnimationCheckbox.checked = localStorage.getItem('2048-tile-appear-animation') !== 'false';
            }
            const moveAnimationCheckbox = document.getElementById('tile-move-animation');
            if (moveAnimationCheckbox) {
                moveAnimationCheckbox.checked = localStorage.getItem('2048-tile-move-animation') !== 'false';
            }
            const mergeAnimationCheckbox = document.getElementById('tile-merge-animation');
            if (mergeAnimationCheckbox) {
                mergeAnimationCheckbox.checked = localStorage.getItem('2048-tile-merge-animation') !== 'false';
            }
            const vibrationToggle = document.getElementById('vibration-toggle');
            const vibrationMergeToggle = document.getElementById('vibration-merge');
            const vibrationWinToggle = document.getElementById('vibration-win');
            const vibrationLossToggle = document.getElementById('vibration-loss');
            const vibrationDetails = document.getElementById('vibration-details');
            if (vibrationToggle) {
                vibrationToggle.checked = localStorage.getItem('2048-vibration') !== 'false';
            }
            if (vibrationMergeToggle) {
                vibrationMergeToggle.checked = localStorage.getItem('2048-vibration-merge') !== 'false';
            }
            if (vibrationWinToggle) {
                vibrationWinToggle.checked = localStorage.getItem('2048-vibration-win') !== 'false';
            }
            if (vibrationLossToggle) {
                vibrationLossToggle.checked = localStorage.getItem('2048-vibration-loss') !== 'false';
            }
            if (vibrationDetails) {
                if (window.gameState.vibrationEnabled) {
                    vibrationDetails.classList.remove('collapsed');
                    if (vibrationToggle) {
                        vibrationToggle.closest('.vibration-toggle-container').classList.add('mb-2');
                    }
                } else {
                    vibrationDetails.classList.add('collapsed');
                    if (vibrationToggle) {
                        vibrationToggle.closest('.vibration-toggle-container').classList.remove('mb-2');
                    }
                }
            }
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