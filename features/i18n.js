const i18nVersion = '1.1';
window.i18nVersion = i18nVersion;
const translations = {
    zh: {
        gameTitle: '2048',
        pageTitle: '2048 游戏',
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
        dataTextareaPlaceholder: '在此复制导出的数据或输入要导入的数据...',
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
        tile2Bg: '数字 2 背景色',
        tile2Text: '数字 2 文字颜色',
        tile4Bg: '数字 4 背景色',
        tile4Text: '数字 4 文字颜色',
        tile8Bg: '数字 8 背景色',
        tile8Text: '数字 8 文字颜色',
        tile16Bg: '数字 16 背景色',
        tile16Text: '数字 16 文字颜色',
        tile32Bg: '数字 32 背景色',
        tile32Text: '数字 32 文字颜色',
        tile64Bg: '数字 64 背景色',
        tile64Text: '数字 64 文字颜色',
        tile128Bg: '数字 128 背景色',
        tile128Text: '数字 128 文字颜色',
        tile256Bg: '数字 256 背景色',
        tile256Text: '数字 256 文字颜色',
        tile512Bg: '数字 512 背景色',
        tile512Text: '数字 512 文字颜色',
        tile1024Bg: '数字 1024 背景色',
        tile1024Text: '数字 1024 文字颜色',
        tile2048Bg: '数字 2048 背景色',
        tile2048Text: '数字 2048 文字颜色',
        tile4096Bg: '数字 4096 背景色',
        tile4096Text: '数字 4096 文字颜色',
        tile8192Bg: '数字 8192 背景色',
        tile8192Text: '数字 8192 文字颜色',
        tile16384Bg: '数字 16384 背景色',
        tile16384Text: '数字 16384 文字颜色',
        tile32768Bg: '数字 32768 背景色',
        tile32768Text: '数字 32768 文字颜色',
        tileSuperBg: '更大数字 背景色',
        tileSuperText: '更大数字 文字颜色',
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
        aiGameAnalysis: 'AI游戏分析',
        currentBestMove: '当前最佳移动方向',
        limitedMergeOpportunities: '合并机会有限',
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
        warning: '警告',
        importFailedEmpty: '数据为空',
        importFailedDecode: '数据格式错误，无法解码',
        importFailedObject: '数据不是有效的对象',
        importFailedFields: '缺少必要字段: {fields}',
        importFailedGrid: '网格数据无效',
        importFailedSize: '网格尺寸不匹配',
        importFailedTiles: '网格中包含无效的方块值',
        consoleDataEmpty: '数据验证失败: 数据为空',
        consoleBase64Failed: 'Base64解码失败',
        consoleBase91Failed: 'Base91解码失败',
        consoleInvalidObject: '数据验证失败: 数据不是有效的对象',
        consoleMissingFields: '数据验证失败: 缺少必要字段',
        consoleInvalidGrid: '数据验证失败: 网格数据无效',
        consoleSizeMismatch: '数据验证失败: 网格尺寸不匹配',
        consoleInvalidTiles: '数据验证失败: 网格中包含无效的方块值',
        consoleImportFailed: '导入失败',
        consoleErrorDetails: '错误详情',
        exportThemeModal: '导出主题',
        selectThemeItems: '选择要导出的主题项',
        selectAll: '全选',
        export: '导出',
        gamePaused: '游戏暂停',
        encoding: '编码方式:',
        bestMoveDirection: '最佳移动方向',
        mergeOpportunitiesLabel: '潜在合并机会',
        gameStateAssessment: '游戏状态评估',
        scorePotentialLabel: '得分潜力分析',
        noMergeOpportunities: '无',
        safe: '安全',
        hideBestMove: '隐藏最佳移动方向',
        showBestMove: '显示最佳移动方向',
        up: '向上',
        down: '向下',
        left: '向左',
        right: '向右',
        notSupported: '暂不支持',
        aiSupportNote: 'AI分析功能仅支持3×3、4×4、5×5网格',
        followBrowser: '跟随浏览器',
        lightTheme: '浅色',
        darkTheme: '深色',
        bgOpacity: '主背景不透明度',
        primaryOpacity: '主色调不透明度',
        secondaryOpacity: '次色调不透明度',
        gridOpacity: '网格不透明度',
        cellEmptyOpacity: '空单元格不透明度',
        scrollbarOpacity: '滚动条不透明度',
        modalBgOpacity: '模态框背景不透明度',
        modalTextOpacity: '模态框文字不透明度',
        themeSaved: '主题保存成功！',
        themeImported: '主题导入成功！',
        themeExported: '主题导出成功！',
        invalidThemeFile: '无效的主题文件',
        customThemeModuleMissing: '自定义主题模块未找到，请确保 features/custom-theme.js 文件存在。',
        aiAnalysisModuleMissing: 'AI分析模块未找到，请确保 features/ai-analysis.js 文件存在。',
        i18nModuleMissing: 'i18n模块未找到，请确保 features/i18n.js 文件存在。',
        customThemeModuleFailed: '自定义主题模块加载失败:',
        aiAnalysisModuleFailed: 'AI分析模块加载失败:',
        i18nModuleFailed: 'i18n模块加载失败:',
        bluetoothSync: '蓝牙同步',
        exportViaBluetooth: '蓝牙导出',
        importViaBluetooth: '蓝牙导入',
        bluetoothNotSupported: '当前浏览器不支持蓝牙功能',
        bluetoothModuleError: '蓝牙模块未加载失败',
        bluetoothExportFailed: '蓝牙导出失败',
        bluetoothImportFailed: '蓝牙导入失败',
        pinCode: 'PIN码',
        pinVerified: 'PIN码验证成功！',
        pinInvalid: 'PIN码错误，请重试',
        enterPin: '请输入PIN码',
        bluetoothModalTitle: '蓝牙同步',
        bluetoothExportPin: '请在接收设备上输入此PIN码',
        bluetoothImportPin: '请输入发送设备显示的PIN码',
        enterPinToVerify: '请输入上述PIN码进行验证',
        searchingAndVerifying: '正在搜索设备并验证...请稍候',
        bluetoothDevice: '设备',
        verifying: '验证中...',
        verify: '验证',
        bluetoothSyncModuleMissing: '蓝牙同步模块未找到，请确保 features/bluetooth-sync.js 文件存在。',
        bluetoothSyncModuleFailed: '蓝牙同步模块加载失败:',
        exportProgress: '导出进度',
        importProgress: '导入进度',
        bluetoothExportSuccess: '蓝牙导出成功！',
        bluetoothImportSuccess: '蓝牙导入成功！',
        ready: '准备就绪',
        connected: '已连接',
        receiving: '接收中',
        receivingBytes: '接收中: {bytes} 字节',
        receivingBytesTotal: '接收中: {bytes} / {total} 字节',
        includeSettings: '包含设置数据'
    },
    en: {
        gameTitle: '2048',
        pageTitle: '2048 Game',
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
        dataTextareaPlaceholder: 'Copy exported data here or paste data to import...',
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
        tile2Bg: 'Tile 2 Background',
        tile2Text: 'Tile 2 Text Color',
        tile4Bg: 'Tile 4 Background',
        tile4Text: 'Tile 4 Text Color',
        tile8Bg: 'Tile 8 Background',
        tile8Text: 'Tile 8 Text Color',
        tile16Bg: 'Tile 16 Background',
        tile16Text: 'Tile 16 Text Color',
        tile32Bg: 'Tile 32 Background',
        tile32Text: 'Tile 32 Text Color',
        tile64Bg: 'Tile 64 Background',
        tile64Text: 'Tile 64 Text Color',
        tile128Bg: 'Tile 128 Background',
        tile128Text: 'Tile 128 Text Color',
        tile256Bg: 'Tile 256 Background',
        tile256Text: 'Tile 256 Text Color',
        tile512Bg: 'Tile 512 Background',
        tile512Text: 'Tile 512 Text Color',
        tile1024Bg: 'Tile 1024 Background',
        tile1024Text: 'Tile 1024 Text Color',
        tile2048Bg: 'Tile 2048 Background',
        tile2048Text: 'Tile 2048 Text Color',
        tile4096Bg: 'Tile 4096 Background',
        tile4096Text: 'Tile 4096 Text Color',
        tile8192Bg: 'Tile 8192 Background',
        tile8192Text: 'Tile 8192 Text Color',
        tile16384Bg: 'Tile 16384 Background',
        tile16384Text: 'Tile 16384 Text Color',
        tile32768Bg: 'Tile 32768 Background',
        tile32768Text: 'Tile 32768 Text Color',
        tileSuperBg: 'Larger Tiles Background',
        tileSuperText: 'Larger Tiles Text Color',
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
        aiGameAnalysis: 'AI Game Analysis',
        currentBestMove: 'Current Best Move Direction',
        limitedMergeOpportunities: 'Limited Merge Opportunities',
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
        warning: 'Warning',
        importFailedEmpty: 'Data is empty',
        importFailedDecode: 'Data format error, cannot decode',
        importFailedObject: 'Data is not a valid object',
        importFailedFields: 'Missing required fields: {fields}',
        importFailedGrid: 'Invalid grid data',
        importFailedSize: 'Grid size mismatch',
        importFailedTiles: 'Grid contains invalid tile values',
        consoleDataEmpty: 'Data validation failed: Data is empty',
        consoleBase64Failed: 'Base64 decode failed',
        consoleBase91Failed: 'Base91 decode failed',
        consoleInvalidObject: 'Data validation failed: Data is not a valid object',
        consoleMissingFields: 'Data validation failed: Missing required fields',
        consoleInvalidGrid: 'Data validation failed: Invalid grid data',
        consoleSizeMismatch: 'Data validation failed: Grid size mismatch',
        consoleInvalidTiles: 'Data validation failed: Grid contains invalid tile values',
        consoleImportFailed: 'Import failed',
        consoleErrorDetails: 'Error details',
        exportThemeModal: 'Export Theme',
        selectThemeItems: 'Select theme items to export',
        selectAll: 'Select All',
        export: 'Export',
        gamePaused: 'Game Paused',
        encoding: 'Encoding:',
        bestMoveDirection: 'Best Move Direction',
        mergeOpportunitiesLabel: 'Potential Merge Opportunities',
        gameStateAssessment: 'Game State Assessment',
        scorePotentialLabel: 'Score Potential Analysis',
        noMergeOpportunities: 'None',
        safe: 'Safe',
        hideBestMove: 'Hide Best Move Direction',
        showBestMove: 'Show Best Move Direction',
        up: 'Up',
        down: 'Down',
        left: 'Left',
        right: 'Right',
        notSupported: 'Not Supported',
        aiSupportNote: 'AI analysis is only supported for 3×3, 4×4, 5×5 grids',
        followBrowser: 'Follow Browser',
        lightTheme: 'Light',
        darkTheme: 'Dark',
        bgOpacity: 'Main Background Opacity',
        primaryOpacity: 'Primary Color Opacity',
        secondaryOpacity: 'Secondary Color Opacity',
        gridOpacity: 'Grid Opacity',
        cellEmptyOpacity: 'Empty Cell Opacity',
        scrollbarOpacity: 'Scrollbar Opacity',
        modalBgOpacity: 'Modal Background Opacity',
        modalTextOpacity: 'Modal Text Opacity',
        themeSaved: 'Theme saved successfully!',
        themeImported: 'Theme imported successfully!',
        themeExported: 'Theme exported successfully!',
        invalidThemeFile: 'Invalid theme file',
        customThemeModuleMissing: 'Custom theme module not found. Please ensure features/custom-theme.js file exists.',
        aiAnalysisModuleMissing: 'AI analysis module not found. Please ensure features/ai-analysis.js file exists.',
        i18nModuleMissing: 'i18n module not found. Please ensure features/i18n.js file exists.',
        customThemeModuleFailed: 'Custom theme module loading failed:',
        aiAnalysisModuleFailed: 'AI analysis module loading failed:',
        i18nModuleFailed: 'i18n module loading failed:',
        bluetoothSync: 'Bluetooth Sync',
        exportViaBluetooth: 'Export via Bluetooth',
        importViaBluetooth: 'Import via Bluetooth',
        bluetoothNotSupported: 'Bluetooth is not supported in this browser',
        bluetoothModuleError: 'Bluetooth module loading failed',
        bluetoothExportFailed: 'Bluetooth export failed',
        bluetoothImportFailed: 'Bluetooth import failed',
        pinCode: 'PIN Code',
        pinVerified: 'PIN verified successfully!',
        pinInvalid: 'Invalid PIN, please try again',
        enterPin: 'Please enter PIN',
        bluetoothModalTitle: 'Bluetooth Sync',
        bluetoothExportPin: 'Please enter this PIN on the receiving device',
        bluetoothImportPin: 'Please enter the PIN shown on the sending device',
        enterPinToVerify: 'Please enter the above PIN to verify',
        searchingAndVerifying: 'Searching for device and verifying... Please wait',
        bluetoothDevice: 'Device',
        verifying: 'Verifying...',
        verify: 'Verify',
        bluetoothSyncModuleMissing: 'Bluetooth sync module not found. Please ensure features/bluetooth-sync.js file exists.',
        bluetoothSyncModuleFailed: 'Bluetooth sync module loading failed:',
        exportProgress: 'Export Progress',
        importProgress: 'Import Progress',
        bluetoothExportSuccess: 'Bluetooth export successful!',
        bluetoothImportSuccess: 'Bluetooth import successful!',
        ready: 'Ready',
        connected: 'Connected',
        receiving: 'Receiving',
        receivingBytes: 'Receiving: {bytes} bytes',
        receivingBytesTotal: 'Receiving: {bytes} / {total} bytes',
        includeSettings: 'Include settings data'
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
        if (typeof window.updateDocumentTitle === 'function') {
            window.updateDocumentTitle();
        }
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
            if (key === 'footer') {
                const icon = element.querySelector('i');
                if (icon) {
                    element.innerHTML = `<i class="${icon.className}"></i> ${t(key)}`;
                } else {
                    element.textContent = t(key);
                }
            } else if (element.classList.contains('category-title')) {
                const span = element.querySelector('span[data-i18n]');
                if (span) {
                    span.textContent = t(key);
                }
            } else {
                element.textContent = t(key);
            }
        }
    });
    updateDynamicContent();
    updateButtonWidths();
    updateHtmlLangAttribute();
}
function updateButtonWidths() {
    const lang = getLang();
    const undoButton = document.getElementById('undo-button');
    const pauseButton = document.getElementById('pause-button');
    const customGridButton = document.getElementById('custom-grid');
    if (undoButton && pauseButton) {
        if (lang === 'en') {
            undoButton.style.width = '88px';
            pauseButton.style.width = '88px';
        } else {
            undoButton.style.width = '72px';
            pauseButton.style.width = '72px';
        }
    }
    if (customGridButton) {
        if (lang === 'en') {
            customGridButton.style.width = '96px';
        } else {
            customGridButton.style.width = '80px';
        }
    }
}
function updateHtmlLangAttribute() {
    const lang = getLang();
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}
function updateDynamicContent() {
    if (window.elements && window.gameState) {
        const elements = window.elements;
        const gameState = window.gameState;
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
        if (elements.dataTextarea) {
            elements.dataTextarea.placeholder = t('dataTextareaPlaceholder');
        }
    }
    updateLanguageSelector();
    updateThemeSelector();
}
function updateLanguageSelector() {
    const languageLabels = document.querySelectorAll('[for="language-toggle"]');
    languageLabels.forEach(label => {
        label.textContent = t('language');
    });
    const languageSelects = document.querySelectorAll('[data-i18n-select="true"]');
    languageSelects.forEach(select => {
        const selectSelectedDiv = select.querySelector('.select-selected');
        const selectItems = select.querySelectorAll('.select-item');
        if (selectSelectedDiv) {
            const textSpan = selectSelectedDiv.querySelector('span');
            if (textSpan) {
                const currentLangText = currentLanguage === 'auto' ? t('auto') : t(currentLanguage === 'zh' ? 'chinese' : 'english');
                const icon = currentLanguage === 'auto' ? 'fa-solid fa-globe' : '';
                const emoji = currentLanguage === 'zh' ? '🇨🇳' : (currentLanguage === 'en' ? '🇺🇸' : '');
                if (emoji) {
                    textSpan.innerHTML = `<span class="emoji-icon">${emoji}</span> ${currentLangText}`;
                } else if (icon) {
                    textSpan.innerHTML = `<i class="${icon}"></i> ${currentLangText}`;
                } else {
                    textSpan.textContent = currentLangText;
                }
            }
        }
        selectItems.forEach(item => {
            const value = item.dataset.value;
            if (value === 'auto') {
                item.innerHTML = `<i class="fa-solid fa-globe mr-1"></i> ${t('auto')}`;
            } else if (value === 'zh') {
                item.innerHTML = `<span class="emoji-icon mr-1">🇨🇳</span> ${t('chinese')}`;
            } else if (value === 'en') {
                item.innerHTML = `<span class="emoji-icon mr-1">🇺🇸</span> ${t('english')}`;
            }
        });
    });
}
function updateThemeSelector() {
    const themeSelect = document.querySelector('#theme-toggle')?.parentElement;
    if (!themeSelect) return;
    const selectSelectedDiv = themeSelect.querySelector('.select-selected');
    const selectItems = themeSelect.querySelectorAll('.select-item');
    const themeToggle = document.querySelector('#theme-toggle');
    let currentTheme = themeToggle?.value || localStorage.getItem('2048-theme');
    if (selectSelectedDiv) {
        let themeText = '';
        let icon = '';
        let i18nKey = 'followBrowser';
        switch (currentTheme) {
            case 'auto':
                themeText = t('followBrowser');
                icon = 'fa-solid fa-desktop';
                i18nKey = 'followBrowser';
                break;
            case 'light':
                themeText = t('lightTheme');
                icon = 'fa-solid fa-sun';
                i18nKey = 'lightTheme';
                break;
            case 'dark':
                themeText = t('darkTheme');
                icon = 'fa-solid fa-moon';
                i18nKey = 'darkTheme';
                break;
            case 'custom':
                themeText = t('custom');
                icon = 'fa-solid fa-palette';
                i18nKey = 'custom';
                break;
        }
        selectSelectedDiv.innerHTML = `<span><i class="${icon} mr-1"></i><span data-i18n="${i18nKey}">${themeText}</span></span><i class="fa fa-chevron-down text-xs ml-2 text-gray-500 dark:text-gray-400"></i>`;
    }
    selectItems.forEach(item => {
        const value = item.dataset.value;
        if (value === 'auto') {
            item.innerHTML = `<i class="fa-solid fa-desktop mr-1"></i><span data-i18n="followBrowser">${t('followBrowser')}</span>`;
        } else if (value === 'light') {
            item.innerHTML = `<i class="fa-solid fa-sun mr-1"></i><span data-i18n="lightTheme">${t('lightTheme')}</span>`;
        } else if (value === 'dark') {
            item.innerHTML = `<i class="fa-solid fa-moon mr-1"></i><span data-i18n="darkTheme">${t('darkTheme')}</span>`;
        } else if (value === 'custom') {
            item.innerHTML = `<i class="fa-solid fa-palette mr-1"></i><span data-i18n="custom">${t('custom')}</span>`;
        }
    });
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
    customSelect.dataset.i18nSelect = 'true';
    const languages = [
        { value: 'auto', text: t('auto'), icon: 'fa-solid fa-globe' },
        { value: 'zh', text: t('chinese'), emoji: '🇨🇳' },
        { value: 'en', text: t('english'), emoji: '🇺🇸' }
    ];
    const selectSelected = document.createElement('div');
    selectSelected.className = 'select-selected flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 hover:border-primary/50';
    const selectedText = document.createElement('span');
    const currentLangText = currentLanguage === 'auto' ? t('auto') : t(currentLanguage === 'zh' ? 'chinese' : 'english');
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
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            setLang(lang.value);
            const newLangText = lang.value === 'auto' ? t('auto') : t(lang.value === 'zh' ? 'chinese' : 'english');
            if (lang.emoji) {
                selectedText.innerHTML = `<span class="emoji-icon">${lang.emoji}</span> ${newLangText}`;
            } else {
                selectedText.innerHTML = `<i class="${lang.icon}"></i> ${newLangText}`;
            }
            languages.forEach(l => {
                const langItem = selectItems.querySelector(`[data-value="${l.value}"]`);
                if (langItem) {
                    langItem.classList.toggle('selected', l.value === currentLanguage);
                    const updatedText = l.value === 'auto' ? t('auto') : t(l.value === 'zh' ? 'chinese' : 'english');
                    if (l.emoji) {
                        langItem.innerHTML = `<span class="emoji-icon mr-1">${l.emoji}</span> ${updatedText}`;
                    } else {
                        langItem.innerHTML = `<i class="${l.icon} mr-1"></i> ${updatedText}`;
                    }
                }
            });
            label.textContent = t('language');
            selectItems.style.maxHeight = null;
            selectItems.style.opacity = '0';
            selectSelected.classList.remove('active');
            setTimeout(() => selectItems.classList.add('hidden'), 300);
        });
        selectItems.appendChild(item);
    });
    selectSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        if (selectItems.style.maxHeight) {
            selectItems.style.maxHeight = null;
            selectItems.style.opacity = '0';
            selectSelected.classList.remove('active');
            setTimeout(() => selectItems.classList.add('hidden'), 300);
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
            selectItems.classList.remove('hidden');
            selectSelected.classList.add('active');
            setTimeout(() => {
                selectItems.style.maxHeight = "200px";
                selectItems.style.opacity = '1';
            }, 10);
        }
    });
    selectItems.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    document.addEventListener('click', () => {
        if (selectItems.style.maxHeight) {
            selectItems.style.maxHeight = null;
            selectItems.style.opacity = '0';
            selectSelected.classList.remove('active');
            setTimeout(() => selectItems.classList.add('hidden'), 300);
        }
    });
    customSelect.appendChild(selectSelected);
    customSelect.appendChild(selectItems);
    languageContainer.appendChild(label);
    languageContainer.appendChild(customSelect);
    const appearanceCategory = document.querySelector('.setting-category:nth-child(2)');
    if (appearanceCategory) {
        const customThemeButtonContainer = appearanceCategory.querySelector('#custom-theme-button-container');
        if (customThemeButtonContainer) {
            const separator = document.createElement('div');
            separator.className = 'border-b border-gray-200 dark:border-gray-700 my-3 mx-2';
            customThemeButtonContainer.parentNode.insertBefore(separator, customThemeButtonContainer.nextSibling);
            customThemeButtonContainer.parentNode.insertBefore(languageContainer, separator.nextSibling);
        } else {
            const themeToggleContainer = appearanceCategory.querySelector('.flex.items-center.justify-between');
            if (themeToggleContainer) {
                const separator = document.createElement('div');
                separator.className = 'border-b border-gray-200 dark:border-gray-700 my-3 mx-2';
                themeToggleContainer.parentNode.insertBefore(separator, themeToggleContainer.nextSibling);
                themeToggleContainer.parentNode.insertBefore(languageContainer, separator.nextSibling);
            }
        }
    }
}
function initI18n() {
    setupLanguageSelector();
    addI18nAttributes();
    updateAllTranslations();
    updateButtonWidths();
    updateHtmlLangAttribute();
    setTimeout(function() {
        if (typeof updateThemeSelector === 'function') {
            updateThemeSelector();
        }
    }, 100);
}
function setI18nAttribute(element, key) {
    if (element) {
        element.setAttribute('data-i18n', key);
    }
}
function setById(id, key, preferSpan = false) {
    const element = document.getElementById(id);
    if (!element) return;
    if (preferSpan) {
        const span = element.querySelector('span');
        setI18nAttribute(span || element, key);
    } else {
        setI18nAttribute(element, key);
    }
}
function setBySelector(selector, key, preferSpan = false) {
    const element = document.querySelector(selector);
    if (!element) return;
    if (preferSpan) {
        const span = element.querySelector('span');
        setI18nAttribute(span || element, key);
    } else {
        setI18nAttribute(element, key);
    }
}
const i18nConfig = {
    simpleIds: [
        ['game-title', 'gameTitle'],
        ['settings-modal-title', 'settings'],
        ['data-transfer-modal-title', 'dataTransfer'],
        ['custom-grid-modal-title', 'customGrid'],
        ['custom-theme-modal-title', 'customTheme'],
        ['export-theme-modal-title', 'exportThemeModal'],
        ['bluetooth-modal-title', 'bluetoothModalTitle'],
        ['easy-mode', 'easy'],
        ['medium-mode', 'medium'],
        ['hard-mode', 'hard'],
        ['custom-grid', 'custom'],
        ['apply-custom-grid', 'apply'],
        ['cancel-custom-grid', 'cancel'],
        ['game-message-title', 'gameWon'],
        ['game-message-text', 'gameWonText'],
        ['game-message-button', 'tryAgain'],
        ['custom-theme-button', 'customThemeButton'],
        ['bluetooth-export-pin-text', 'bluetoothExportPin'],
        ['bluetooth-import-pin-text', 'bluetoothImportPin'],
        ['bluetooth-device-label', 'bluetoothDevice'],
        ['bluetooth-pin-label', 'pinCode']
    ],
    buttonIds: [
        ['new-game', 'newGame'],
        ['endless-mode', 'endlessMode'],
        ['undo-button', 'undo'],
        ['pause-button', 'pause'],
        ['resume-button', 'resume'],
        ['restart-button', 'restart'],
        ['settings-button', 'settings'],
        ['reset-settings-button', 'resetSettings'],
        ['export-data-button', 'exportData'],
        ['import-data-button', 'importData'],
        ['save-custom-theme', 'save'],
        ['reset-custom-theme', 'reset'],
        ['export-custom-theme', 'exportTheme'],
        ['import-custom-theme', 'importTheme'],
        ['confirm-export-theme', 'export'],
        ['cancel-export-theme', 'cancel'],
        ['verify-pin-button', 'verify'],
        ['cancel-bluetooth-button', 'cancel'],
        ['export-bluetooth-button', 'exportViaBluetooth'],
        ['import-bluetooth-button', 'importViaBluetooth']
    ],
    selectors: [
        ['#game-header p', 'gameDescription'],
        ['.option-label:nth-child(1)', 'gridSize'],
        ['.option-label:nth-child(2)', 'difficulty'],
        ['.stats-container .text-xs:first-child', 'score'],
        ['.stats-container .text-xs:last-child', 'bestScore'],
        ['.category-title:nth-child(1)', 'gamePerformance'],
        ['.category-title:nth-child(2)', 'appearance'],
        ['.category-title:nth-child(3)', 'dataManagement'],
        ['label[for="export-settings-checkbox"]', 'includeSettings'],
        ['label[for="grid-size-input"]', 'gridSizeInput'],
        ['label[for="square-grid"]', 'squareGrid'],
        ['label[for="select-all-theme-items"]', 'selectAll'],
        ['footer p', 'footer']
    ]
};
function processBatch(items, handler) {
    items.forEach(([target, key]) => handler(target, key));
}
function processSpecialCases() {
    const toggleText = document.getElementById('toggle-text');
    if (toggleText) {
        const key = elements.controlsContainer.classList.contains('collapsed') ? 'expandControls' : 'toggleControls';
        toggleText.setAttribute('data-i18n', key);
    }
    const h3Element = document.querySelector('#theme-export-options').previousElementSibling;
    if (h3Element && h3Element.tagName === 'H3' && h3Element.textContent.trim() === '选择要导出的主题项') {
        h3Element.setAttribute('data-i18n', 'selectThemeItems');
    }
    const bluetoothSyncBtn = document.getElementById('bluetooth-sync-button');
    if (bluetoothSyncBtn) {
        const span = bluetoothSyncBtn.querySelector('span[data-i18n]');
        if (span) {
            span.setAttribute('data-i18n', 'bluetoothSync');
        }
    }
    setById('bluetooth-export-select', 'exportViaBluetooth', true);
    setById('bluetooth-import-select', 'importViaBluetooth', true);
    setById('cancel-bluetooth-select', 'cancel', true);
    setById('back-to-select-from-export', 'cancel', true);
    setById('back-to-select-from-import', 'cancel', true);
}
function addI18nAttributes() {
    processBatch(i18nConfig.simpleIds, (id, key) => setById(id, key));
    processBatch(i18nConfig.buttonIds, (id, key) => setById(id, key, true));
    processBatch(i18nConfig.selectors, (selector, key) => setBySelector(selector, key));
    processSpecialCases();
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