const i18nVersion = '1.0';
window.i18nVersion = i18nVersion;
const translations = {
    zh: {
        gameTitle: '2048',
        gameDescription: '滑动合并方块，创建2048！',
        newGame: '标准模式',
        endlessMode: '无尽模式',
        undo: '撤销',
        pause: '暂停',
        resume: '继续游戏',
        restart: '重新开始',
        settings: '设置',
        gridSize: '网格大小:',
        difficulty: '难度选择:',
        easy: '简单',
        medium: '中等',
        hard: '困难',
        custom: '自定义',
        score: '分数',
        bestScore: '最高分',
        modeDescription: '当前模式：',
        difficultyDescription: '当前难度：',
        standardMode: '标准模式 - 达到2048获胜',
        endlessModeDesc: '无尽模式 - 尽可能获得高分',
        grid: '网格',
        gameWon: '恭喜你获胜！',
        gameWonText: '你达到了2048分，可以继续游戏挑战更高分数，或者重新开始。',
        gameOver: '游戏结束！',
        gameOverText: '无法进行任何移动。',
        tryAgain: '再玩一次',
        toggleControls: '收起控制',
        expandControls: '展开控制',
        gamePerformance: '游戏性能',
        gpuAcceleration: 'GPU加速',
        vibration: '振动反馈',
        tileAnimation: '滑块动画',
        appearance: '外观设置',
        theme: '主题',
        dataManagement: '数据与管理',
        dataTransfer: '数据管理',
        exportData: '导出数据',
        importData: '导入数据',
        includeSettings: '包含设置数据',
        customGrid: '自定义网格大小',
        gridSizeInput: '请输入网格大小 (3-10):',
        squareGrid: '正方形网格 (锁定宽高比)',
        apply: '应用',
        cancel: '取消',
        resetSettings: '重置所有设置',
        versionInfo: '2048 v{version} | by TheFurina',
        github: '项目主页',
        footer: '滑动之间 数字新生',
        customTheme: '自定义主题',
        save: '保存',
        reset: '重置',
        exportTheme: '导出主题',
        importTheme: '导入主题',
        baseColors: '基础颜色',
        modalColors: '模态框颜色',
        tileColors: '滑块颜色',
        mainBg: '主背景色',
        primaryColor: '主色调',
        secondaryColor: '次色调',
        gridColor: '网格颜色',
        cellEmptyColor: '空单元格颜色',
        scrollbarColor: '滚动条颜色',
        modalBg: '模态框背景色',
        modalText: '模态框文字颜色',
        opacity: '不透明度',
        language: '语言',
        auto: '跟随浏览器',
        chinese: '中文',
        english: 'English',
        confirmReset: '确定要重置所有设置吗？',
        confirmRestart: '重新开始将重置当前游戏进度，确定要继续吗？',
        confirmModeSwitch: '切换到{mode}将重置当前游戏进度，确定要继续吗？',
        confirmGridChange: '切换棋盘大小将重置当前游戏进度，确定要继续吗？',
        confirmImport: '确定要导入数据吗？这将覆盖当前游戏状态。',
        confirmImportSettings: '导入的数据包含设置信息，是否覆盖当前设置？',
        exportFailed: '导出游戏数据失败:',
        importFailed: '导入失败：',
        importSuccess: '数据导入成功！',
        noUndo: '无法撤销（没有历史记录）',
        undoSteps: '撤销上一步（可撤销 {steps} 步）',
        customThemeButton: '自定义主题设置',
        themeActions: '主题操作',
        vibrationWarning: '当前浏览器不支持振动功能',
        mergeVibration: '合并振动',
        winVibration: '获胜振动',
        lossVibration: '失败振动',
        appearAnimation: '新滑块出现动画',
        moveAnimation: '滑块移动动画',
        mergeAnimation: '滑块合并动画',
        animationDetails: '动画详情',
        vibrationDetails: '振动详情',
        aiAnalysis: 'AI分析',
        bestMove: '最佳移动',
        gameState: '游戏状态',
        mergeOpportunities: '合并机会',
        scorePotential: '得分潜力',
        good: '良好',
        average: '一般',
        danger: '危险',
        high: '高',
        mediumScore: '中',
        low: '低',
        loading: '加载中...',
        error: '错误',
        success: '成功',
        info: '信息',
        warning: '警告'
    },
    en: {
        gameTitle: '2048',
        gameDescription: 'Swipe to merge tiles and create 2048!',
        newGame: 'Standard Mode',
        endlessMode: 'Endless Mode',
        undo: 'Undo',
        pause: 'Pause',
        resume: 'Resume Game',
        restart: 'Restart',
        settings: 'Settings',
        gridSize: 'Grid Size:',
        difficulty: 'Difficulty:',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        custom: 'Custom',
        score: 'Score',
        bestScore: 'Best Score',
        modeDescription: 'Current Mode: ',
        difficultyDescription: 'Current Difficulty: ',
        standardMode: 'Standard Mode - Reach 2048 to win',
        endlessModeDesc: 'Endless Mode - Get as high a score as possible',
        grid: 'grid',
        gameWon: 'Congratulations!',
        gameWonText: 'You reached 2048! You can continue playing to try for a higher score, or start over.',
        gameOver: 'Game Over!',
        gameOverText: 'No more moves available.',
        tryAgain: 'Play Again',
        toggleControls: 'Hide Controls',
        expandControls: 'Show Controls',
        gamePerformance: 'Game Performance',
        gpuAcceleration: 'GPU Acceleration',
        vibration: 'Vibration Feedback',
        tileAnimation: 'Tile Animation',
        appearance: 'Appearance Settings',
        theme: 'Theme',
        dataManagement: 'Data & Management',
        dataTransfer: 'Data Management',
        exportData: 'Export Data',
        importData: 'Import Data',
        includeSettings: 'Include Settings Data',
        customGrid: 'Custom Grid Size',
        gridSizeInput: 'Please enter grid size (3-10):',
        squareGrid: 'Square Grid (Lock aspect ratio)',
        apply: 'Apply',
        cancel: 'Cancel',
        resetSettings: 'Reset All Settings',
        versionInfo: '2048 v{version} | by TheFurina',
        github: 'Project Home',
        footer: 'Numbers reborn with each swipe',
        customTheme: 'Custom Theme',
        save: 'Save',
        reset: 'Reset',
        exportTheme: 'Export Theme',
        importTheme: 'Import Theme',
        baseColors: 'Base Colors',
        modalColors: 'Modal Colors',
        tileColors: 'Tile Colors',
        mainBg: 'Main Background',
        primaryColor: 'Primary Color',
        secondaryColor: 'Secondary Color',
        gridColor: 'Grid Color',
        cellEmptyColor: 'Empty Cell Color',
        scrollbarColor: 'Scrollbar Color',
        modalBg: 'Modal Background',
        modalText: 'Modal Text',
        opacity: 'Opacity',
        language: 'Language',
        auto: 'Follow Browser',
        chinese: '中文',
        english: 'English',
        confirmReset: 'Are you sure you want to reset all settings?',
        confirmRestart: 'Restarting will reset your current game progress. Are you sure you want to continue?',
        confirmModeSwitch: 'Switching to {mode} will reset your current game progress. Are you sure you want to continue?',
        confirmGridChange: 'Changing grid size will reset your current game progress. Are you sure you want to continue?',
        confirmImport: 'Are you sure you want to import data? This will overwrite your current game state.',
        confirmImportSettings: 'The imported data contains settings information. Do you want to overwrite your current settings?',
        exportFailed: 'Failed to export game data:',
        importFailed: 'Import failed: ',
        importSuccess: 'Data imported successfully!',
        noUndo: 'Cannot undo (no history)',
        undoSteps: 'Undo last move (can undo {steps} steps)',
        customThemeButton: 'Custom Theme Settings',
        themeActions: 'Theme Actions',
        vibrationWarning: 'Vibration is not supported in this browser',
        mergeVibration: 'Merge Vibration',
        winVibration: 'Win Vibration',
        lossVibration: 'Loss Vibration',
        appearAnimation: 'New Tile Appear Animation',
        moveAnimation: 'Tile Move Animation',
        mergeAnimation: 'Tile Merge Animation',
        animationDetails: 'Animation Details',
        vibrationDetails: 'Vibration Details',
        aiAnalysis: 'AI Analysis',
        bestMove: 'Best Move',
        gameState: 'Game State',
        mergeOpportunities: 'Merge Opportunities',
        scorePotential: 'Score Potential',
        good: 'Good',
        average: 'Average',
        danger: 'Danger',
        high: 'High',
        mediumScore: 'Medium',
        low: 'Low',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        info: 'Info',
        warning: 'Warning'
    }
};
let currentLanguage = localStorage.getItem('2048-language') || 'auto';
function getLang() {
    if (currentLanguage === 'auto') {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return translations[langCode] ? langCode : 'zh';
    }
    return currentLanguage;
}
function setLang(lang) {
    if (lang === 'auto' || translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('2048-language', lang);
        updateAllTranslations();
        return true;
    }
    return false;
}
function t(key, params = {}) {
    const lang = getLang();
    let text = translations[lang][key] || translations['zh'][key] || key;
    for (const [param, value] of Object.entries(params)) {
        text = text.replace(`{${param}}`, value);
    }
    
    return text;
}
function updateAllTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            element.textContent = t(key);
        }
    });
    updateDynamicContent();
}
function updateDynamicContent() {
    if (window.elements) {
        if (elements.modeDescription) {
            elements.modeDescription.textContent = t('modeDescription') + (gameState.isEndlessMode ? t('endlessModeDesc') : t('standardMode'));
        }
        if (elements.difficultyDescription) {
            elements.difficultyDescription.textContent = t('difficultyDescription') + t(gameState.difficulty) + ` - ${gameState.gridRows}×${gameState.gridCols}` + t('grid');
        }
        if (elements.undoButton) {
            elements.undoButton.title = gameState.history.length === 0 ? t('noUndo') : t('undoSteps', { steps: gameState.history.length });
        }
        if (elements.toggleText) {
            elements.toggleText.textContent = elements.controlsContainer.classList.contains('collapsed') ? t('expandControls') : t('toggleControls');
        }
        if (elements.versionInfo) {
            elements.versionInfo.textContent = t('versionInfo', { version: gameVersion });
        }
    }
}
function setupLanguageSelector() {
    const languageContainer = document.createElement('div');
    languageContainer.className = 'flex items-center justify-between mt-2 mb-2 px-2';
    const label = document.createElement('label');
    label.htmlFor = 'language-toggle';
    label.className = 'text-gray-700 dark:text-dark-muted';
    label.textContent = t('language');
    const customSelect = document.createElement('div');
    customSelect.className = 'custom-select relative w-full max-w-[180px]';
    const languages = [
        { value: 'auto', text: t('auto'), icon: 'fa-solid fa-globe' },
        { value: 'zh', text: t('chinese'), emoji: '🇨🇳' },
        { value: 'en', text: t('english'), emoji: '🇺🇸' }
    ];
    const selectSelected = document.createElement('div');
    selectSelected.className = 'select-selected flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 hover:border-primary/50';
    const selectedText = document.createElement('span');
    const currentLangText = currentLanguage === 'auto' ? t('auto') : t(getLang());
    const autoOption = languages.find(lang => lang.value === 'auto');
    if (currentLanguage === 'auto' && autoOption) {
        selectedText.innerHTML = `<i class="${autoOption.icon}"></i> ${currentLangText}`;
    } else {
        const currentOption = languages.find(lang => lang.value === currentLanguage);
        if (currentOption) {
            if (currentOption.emoji) {
                selectedText.innerHTML = `<span class="emoji-icon">${currentOption.emoji}</span> ${currentLangText}`;
            } else {
                selectedText.innerHTML = `<i class="${currentOption.icon}"></i> ${currentLangText}`;
            }
        } else {
            selectedText.innerHTML = `<i class="fa-solid fa-globe"></i> ${currentLangText}`;
        }
    }
    const arrow = document.createElement('i');
    arrow.className = 'fa fa-chevron-down text-xs ml-2 text-gray-500 dark:text-gray-400';
    selectSelected.appendChild(selectedText);
    selectSelected.appendChild(arrow);
    const selectItems = document.createElement('div');
    selectItems.className = 'select-items absolute mt-1 w-full bg-gray-100 dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 z-20 max-h-0 opacity-0 overflow-y-auto transition-all duration-300 ease-in-out';
    languages.forEach(lang => {
        const item = document.createElement('div');
        item.className = `select-item px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white cursor-pointer transition-colors ${currentLanguage === lang.value ? 'selected' : ''}`;
        item.dataset.value = lang.value;
        if (lang.emoji) {
            item.innerHTML = `<span class="emoji-icon mr-1">${lang.emoji}</span> ${lang.text}`;
        } else {
            item.innerHTML = `<i class="${lang.icon} mr-1"></i> ${lang.text}`;
        }
        item.addEventListener('click', () => {
            setLang(lang.value);
            if (lang.emoji) {
                selectedText.innerHTML = `<span class="emoji-icon">${lang.emoji}</span> ${lang.text}`;
            } else {
                selectedText.innerHTML = `<i class="${lang.icon}"></i> ${lang.text}`;
            }
            languages.forEach(l => {
                const langItem = selectItems.querySelector(`[data-value="${l.value}"]`);
                if (langItem) {
                    langItem.classList.toggle('selected', l.value === currentLanguage);
                }
            });
            selectItems.classList.add('max-h-0', 'opacity-0');
            selectSelected.classList.remove('active');
        });
        selectItems.appendChild(item);
    });
    selectSelected.addEventListener('click', () => {
        if (selectItems.classList.contains('max-h-60')) {
            selectItems.classList.add('max-h-0', 'opacity-0');
            selectItems.classList.remove('max-h-60');
            selectSelected.classList.remove('active');
        } else {
            const allSelectItems = document.querySelectorAll('.select-items');
            let maxZIndex = 20;
            allSelectItems.forEach(item => {
                const zIndex = parseInt(item.style.zIndex) || 20;
                if (zIndex > maxZIndex) {
                    maxZIndex = zIndex;
                }
            });
            selectItems.style.zIndex = maxZIndex + 1;
            selectItems.classList.remove('max-h-0', 'opacity-0');
            selectItems.classList.add('max-h-60');
            selectSelected.classList.add('active');
        }
    });
    customSelect.appendChild(selectSelected);
    customSelect.appendChild(selectItems);
    languageContainer.appendChild(label);
    languageContainer.appendChild(customSelect);
    const appearanceCategory = document.querySelector('.setting-category:nth-child(2)');
    if (appearanceCategory) {
        const themeToggleContainer = appearanceCategory.querySelector('.flex.items-center.justify-between');
        if (themeToggleContainer) {
            themeToggleContainer.parentNode.insertBefore(languageContainer, themeToggleContainer.nextSibling);
        }
    }
}
function initI18n() {
    setupLanguageSelector();
    updateAllTranslations();
    addI18nAttributes();
}
function addI18nAttributes() {
    if (document.getElementById('game-title')) {
        document.getElementById('game-title').setAttribute('data-i18n', 'gameTitle');
    }
    if (document.querySelector('#game-header p')) {
        document.querySelector('#game-header p').setAttribute('data-i18n', 'gameDescription');
    }
    if (document.getElementById('new-game')) {
        const newGameBtn = document.getElementById('new-game');
        const newGameBtnSpan = newGameBtn.querySelector('span');
        if (newGameBtnSpan) {
            newGameBtnSpan.setAttribute('data-i18n', 'newGame');
        } else {
            newGameBtn.setAttribute('data-i18n', 'newGame');
        }
    }
    if (document.getElementById('endless-mode')) {
        const endlessModeBtn = document.getElementById('endless-mode');
        const endlessModeBtnSpan = endlessModeBtn.querySelector('span');
        if (endlessModeBtnSpan) {
            endlessModeBtnSpan.setAttribute('data-i18n', 'endlessMode');
        } else {
            endlessModeBtn.setAttribute('data-i18n', 'endlessMode');
        }
    }
    if (document.getElementById('undo-button')) {
        const undoBtn = document.getElementById('undo-button');
        const undoBtnSpan = undoBtn.querySelector('span');
        if (undoBtnSpan) {
            undoBtnSpan.setAttribute('data-i18n', 'undo');
        } else {
            undoBtn.setAttribute('data-i18n', 'undo');
        }
    }
    if (document.getElementById('pause-button')) {
        const pauseBtn = document.getElementById('pause-button');
        const pauseBtnSpan = pauseBtn.querySelector('span');
        if (pauseBtnSpan) {
            pauseBtnSpan.setAttribute('data-i18n', 'pause');
        } else {
            pauseBtn.setAttribute('data-i18n', 'pause');
        }
    }
    if (document.getElementById('resume-button')) {
        const resumeBtn = document.getElementById('resume-button');
        const resumeBtnSpan = resumeBtn.querySelector('span');
        if (resumeBtnSpan) {
            resumeBtnSpan.setAttribute('data-i18n', 'resume');
        } else {
            resumeBtn.setAttribute('data-i18n', 'resume');
        }
    }
    if (document.getElementById('restart-button')) {
        const restartBtn = document.getElementById('restart-button');
        const restartBtnSpan = restartBtn.querySelector('span');
        if (restartBtnSpan) {
            restartBtnSpan.setAttribute('data-i18n', 'restart');
        } else {
            restartBtn.setAttribute('data-i18n', 'restart');
        }
    }
    if (document.getElementById('settings-button')) {
        const settingsBtn = document.getElementById('settings-button');
        const settingsBtnSpan = settingsBtn.querySelector('span');
        if (settingsBtnSpan) {
            settingsBtnSpan.setAttribute('data-i18n', 'settings');
        } else {
            settingsBtn.setAttribute('data-i18n', 'settings');
        }
    }
    if (document.getElementById('game-message-button')) {
        document.getElementById('game-message-button').setAttribute('data-i18n', 'tryAgain');
    }
    if (document.querySelector('.option-label:nth-child(1)')) {
        document.querySelector('.option-label:nth-child(1)').setAttribute('data-i18n', 'gridSize');
    }
    if (document.querySelector('.option-label:nth-child(2)')) {
        document.querySelector('.option-label:nth-child(2)').setAttribute('data-i18n', 'difficulty');
    }
    if (document.getElementById('easy-mode')) {
        document.getElementById('easy-mode').setAttribute('data-i18n', 'easy');
    }
    if (document.getElementById('medium-mode')) {
        document.getElementById('medium-mode').setAttribute('data-i18n', 'medium');
    }
    if (document.getElementById('hard-mode')) {
        document.getElementById('hard-mode').setAttribute('data-i18n', 'hard');
    }
    if (document.getElementById('custom-grid')) {
        document.getElementById('custom-grid').setAttribute('data-i18n', 'custom');
    }
    if (document.querySelector('.stats-container .text-xs:first-child')) {
        document.querySelector('.stats-container .text-xs:first-child').setAttribute('data-i18n', 'score');
    }
    if (document.querySelector('.stats-container .text-xs:last-child')) {
        document.querySelector('.stats-container .text-xs:last-child').setAttribute('data-i18n', 'bestScore');
    }
    if (document.getElementById('toggle-text')) {
        document.getElementById('toggle-text').setAttribute('data-i18n', elements.controlsContainer.classList.contains('collapsed') ? 'expandControls' : 'toggleControls');
    }
    if (document.getElementById('settings-modal-title')) {
        document.getElementById('settings-modal-title').setAttribute('data-i18n', 'settings');
    }
    if (document.querySelector('.category-title:nth-child(1)')) {
        document.querySelector('.category-title:nth-child(1)').setAttribute('data-i18n', 'gamePerformance');
    }
    if (document.querySelector('.category-title:nth-child(2)')) {
        document.querySelector('.category-title:nth-child(2)').setAttribute('data-i18n', 'appearance');
    }
    if (document.querySelector('.category-title:nth-child(3)')) {
        document.querySelector('.category-title:nth-child(3)').setAttribute('data-i18n', 'dataManagement');
    }
    if (document.getElementById('data-transfer-button')) {
        document.getElementById('data-transfer-button').setAttribute('data-i18n', 'dataTransfer');
    }
    if (document.getElementById('reset-settings-button')) {
        const resetSettingsBtn = document.getElementById('reset-settings-button');
        const resetSettingsBtnSpan = resetSettingsBtn.querySelector('span');
        if (resetSettingsBtnSpan) {
            resetSettingsBtnSpan.setAttribute('data-i18n', 'resetSettings');
        } else {
            resetSettingsBtn.setAttribute('data-i18n', 'resetSettings');
        }
    }
    if (document.getElementById('data-transfer-modal-title')) {
        document.getElementById('data-transfer-modal-title').setAttribute('data-i18n', 'dataManagement');
    }
    if (document.getElementById('export-data-button')) {
        document.getElementById('export-data-button').setAttribute('data-i18n', 'exportData');
    }
    if (document.getElementById('import-data-button')) {
        document.getElementById('import-data-button').setAttribute('data-i18n', 'importData');
    }
    if (document.querySelector('label[for="export-settings-checkbox"]')) {
        document.querySelector('label[for="export-settings-checkbox"]').setAttribute('data-i18n', 'includeSettings');
    }
    if (document.getElementById('custom-grid-modal-title')) {
        document.getElementById('custom-grid-modal-title').setAttribute('data-i18n', 'customGrid');
    }
    if (document.querySelector('label[for="grid-size-input"]')) {
        document.querySelector('label[for="grid-size-input"]').setAttribute('data-i18n', 'gridSizeInput');
    }
    if (document.querySelector('label[for="square-grid"]')) {
        document.querySelector('label[for="square-grid"]').setAttribute('data-i18n', 'squareGrid');
    }
    if (document.getElementById('apply-custom-grid')) {
        document.getElementById('apply-custom-grid').setAttribute('data-i18n', 'apply');
    }
    if (document.getElementById('cancel-custom-grid')) {
        document.getElementById('cancel-custom-grid').setAttribute('data-i18n', 'cancel');
    }
    if (document.getElementById('custom-theme-modal-title')) {
        document.getElementById('custom-theme-modal-title').setAttribute('data-i18n', 'customTheme');
    }
    if (document.getElementById('save-custom-theme')) {
        const saveBtn = document.getElementById('save-custom-theme');
        const saveBtnSpan = saveBtn.querySelector('span');
        if (saveBtnSpan) {
            saveBtnSpan.setAttribute('data-i18n', 'save');
        } else {
            saveBtn.setAttribute('data-i18n', 'save');
        }
    }
    if (document.getElementById('reset-custom-theme')) {
        const resetBtn = document.getElementById('reset-custom-theme');
        const resetBtnSpan = resetBtn.querySelector('span');
        if (resetBtnSpan) {
            resetBtnSpan.setAttribute('data-i18n', 'reset');
        } else {
            resetBtn.setAttribute('data-i18n', 'reset');
        }
    }
    if (document.getElementById('export-custom-theme')) {
        const exportBtn = document.getElementById('export-custom-theme');
        const exportBtnSpan = exportBtn.querySelector('span');
        if (exportBtnSpan) {
            exportBtnSpan.setAttribute('data-i18n', 'exportTheme');
        } else {
            exportBtn.setAttribute('data-i18n', 'exportTheme');
        }
    }
    if (document.getElementById('import-custom-theme')) {
        const importBtn = document.getElementById('import-custom-theme');
        const importBtnSpan = importBtn.querySelector('span');
        if (importBtnSpan) {
            importBtnSpan.setAttribute('data-i18n', 'importTheme');
        } else {
            importBtn.setAttribute('data-i18n', 'importTheme');
        }
    }
    if (document.querySelector('footer p')) {
        document.querySelector('footer p').setAttribute('data-i18n', 'footer');
    }
}
window.i18n = {
    version: i18nVersion,
    getLang: getLang,
    setLang: setLang,
    t: t,
    updateAllTranslations: updateAllTranslations,
    init: initI18n
};
window.i18nModuleLoaded = true;
console.log('i18n Module v' + i18nVersion + ' loaded');