const i18nVersion = '2.1';
window.i18nVersion = i18nVersion;
const TILE_LEVELS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
function buildTileKeys(lang) {
    const result = {};
    for (let i = 0; i < TILE_LEVELS.length; i++) {
        const n = TILE_LEVELS[i];
        if (lang === 'en') {
            result['tile' + n + 'Bg'] = 'Tile ' + n + ' Background';
            result['tile' + n + 'Text'] = 'Tile ' + n + ' Text Color';
        } else {
            result['tile' + n + 'Bg'] = '数字 ' + n + ' 背景色';
            result['tile' + n + 'Text'] = '数字 ' + n + ' 文字颜色';
        }
    }
    return result;
}
const translations = {
    zh: {
        ...buildTileKeys('zh'),
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
        rotateHintTitle: '请旋转至竖屏以获得最佳体验',
        exitFullscreen: '退出全屏',
        gamePerformance: '性能',
        gpuAcceleration: 'GPU加速',
        vibration: '振动反馈',
        tileAnimation: '滑块动画',
        scorePopAnimation: '分数跳字动画',
        appearance: '外观',
        theme: '主题',
        dataManagement: '数据',
        dataTransfer: '数据管理',
        exportData: '导出数据',
        importData: '导入数据',
        dataTextareaPlaceholder: '在此复制导出的数据或输入要导入的数据...',
        customGrid: '自定义网格大小',
        gridSizeInput: '请输入网格大小 (3-10):',
        squareGrid: '正方形网格 (锁定宽高比)',
        apply: '应用',
        cancel: '取消',
        confirm: '确认',
        resetSettings: '重置所有设置',
        versionInfo: '2048 v{version} | by TheFurina',
        github: 'Github',
        footer: '滑动之间 数字新生',
        customTheme: '自定义主题',
        save: '保存',
        reset: '重置',
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
        vibrationWarning: '当前浏览器不支持振动功能',
        mergeVibration: '合并振动',
        winVibration: '获胜振动',
        lossVibration: '失败振动',
        appearAnimation: '新滑块出现动画',
        moveAnimation: '滑块移动动画',
        mergeAnimation: '滑块合并动画',
        animationDetails: '动画详情',
        vibrationDetails: '振动详情',
        loading: '加载中...',
        moduleLoading: '正在加载资源...',
        loadingFailed: '资源加载失败',
        loadingFailedDetail: '请检查网络连接后刷新页面',
        moduleLoaderFailedDetail: '模块加载器加载失败，请检查网络连接后刷新页面',
        reloadPage: '重新加载',
        error: '错误',
        success: '成功',
        info: '信息',
        warning: '警告',
        gamePaused: '游戏暂停',
        notAvailable: '不可用',
        followBrowser: '跟随浏览器',
        lightTheme: '浅色',
        darkTheme: '深色',
        done: '完成',
        notSet: '未设置'
    },
    en: {
        ...buildTileKeys('en'),
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
        rotateHintTitle: 'Please rotate to portrait for the best experience',
        exitFullscreen: 'Exit Fullscreen',
        gamePerformance: 'Performance',
        gpuAcceleration: 'GPU Acceleration',
        vibration: 'Vibration Feedback',
        tileAnimation: 'Tile Animation',
        scorePopAnimation: 'Score Pop Animation',
        appearance: 'Appearance',
        theme: 'Theme',
        dataManagement: 'Data',
        dataTransfer: 'Data Management',
        exportData: 'Export Data',
        importData: 'Import Data',
        dataTextareaPlaceholder: 'Copy exported data here or paste data to import...',
        customGrid: 'Custom Grid Size',
        gridSizeInput: 'Please enter grid size (3-10):',
        squareGrid: 'Square Grid (Lock aspect ratio)',
        apply: 'Apply',
        cancel: 'Cancel',
        confirm: 'Confirm',
        resetSettings: 'Reset All Settings',
        versionInfo: '2048 v{version} | by TheFurina',
        github: 'Github',
        footer: 'Numbers reborn with each swipe',
        customTheme: 'Custom Theme',
        save: 'Save',
        reset: 'Reset',
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
        vibrationWarning: 'Vibration is not supported in this browser',
        mergeVibration: 'Merge Vibration',
        winVibration: 'Win Vibration',
        lossVibration: 'Loss Vibration',
        appearAnimation: 'New Tile Appear Animation',
        moveAnimation: 'Tile Move Animation',
        mergeAnimation: 'Tile Merge Animation',
        animationDetails: 'Animation Details',
        vibrationDetails: 'Vibration Details',
        loading: 'Loading...',
        moduleLoading: 'Loading resources...',
        loadingFailed: 'Failed to load resources',
        loadingFailedDetail: 'Check your network connection and refresh the page',
        moduleLoaderFailedDetail: 'The module loader failed to load. Check your network and refresh the page',
        reloadPage: 'Reload',
        error: 'Error',
        success: 'Success',
        info: 'Info',
        warning: 'Warning',
        gamePaused: 'Game Paused',
        notAvailable: 'Not Available',
        followBrowser: 'Follow Browser',
        lightTheme: 'Light',
        darkTheme: 'Dark',
        done: 'Done',
        notSet: 'Not set'
    }
};
const MODULE_TRANSLATIONS = {
    theme: {
        zh: {
            customThemeButton: '自定义主题设置',
            themeActions: '主题操作',
            baseColors: '基础颜色',
            modalColors: '模态框颜色',
            tileColors: '滑块颜色',
            bgColor: '主背景色',
            mainBg: '主背景色',
            primaryColor: '主色调',
            secondaryColor: '次色调',
            gridColor: '网格颜色',
            cellEmptyColor: '空单元格颜色',
            scrollbarColor: '滚动条颜色',
            modalBgColor: '模态框背景色',
            modalTextColor: '模态框文字颜色',
            modalBg: '模态框背景色',
            modalText: '模态框文字颜色',
            opacity: '不透明度',
            tileSuperBg: '更大数字 背景色',
            tileSuperText: '更大数字 文字颜色',
            exportTheme: '导出主题',
            importTheme: '导入主题',
            themeSaved: '主题保存成功！',
            themeImported: '主题导入成功！',
            themeExported: '主题导出成功！',
            invalidThemeFile: '无效的主题文件',
            customThemeModuleMissing: '自定义主题模块未找到，请确保 features/custom-theme.js 文件存在。',
            customThemeModuleFailed: '自定义主题模块加载失败:',
            exportThemeModal: '导出主题',
            selectThemeItems: '选择要导出的主题项',
            selectThemeMode: '选择主题模式',
            selectAtLeastOneThemeMode: '请至少选择一种主题模式（浅色或深色）',
            selectAll: '全选',
            export: '导出'
        },
        en: {
            customThemeButton: 'Custom Theme Settings',
            themeActions: 'Theme Actions',
            baseColors: 'Base Colors',
            modalColors: 'Modal Colors',
            tileColors: 'Tile Colors',
            bgColor: 'Main Background',
            mainBg: 'Main Background',
            primaryColor: 'Primary Color',
            secondaryColor: 'Secondary Color',
            gridColor: 'Grid Color',
            cellEmptyColor: 'Empty Cell Color',
            scrollbarColor: 'Scrollbar Color',
            modalBgColor: 'Modal Background',
            modalTextColor: 'Modal Text',
            modalBg: 'Modal Background',
            modalText: 'Modal Text',
            opacity: 'Opacity',
            tileSuperBg: 'Larger Tiles Background',
            tileSuperText: 'Larger Tiles Text Color',
            exportTheme: 'Export Theme',
            importTheme: 'Import Theme',
            themeSaved: 'Theme saved successfully!',
            themeImported: 'Theme imported successfully!',
            themeExported: 'Theme exported successfully!',
            invalidThemeFile: 'Invalid theme file',
            customThemeModuleMissing: 'Custom theme module not found. Please ensure features/custom-theme.js file exists.',
            customThemeModuleFailed: 'Custom theme module loading failed:',
            exportThemeModal: 'Export Theme',
            selectThemeItems: 'Select theme items to export',
            selectThemeMode: 'Select Theme Modes',
            selectAtLeastOneThemeMode: 'Please select at least one theme mode (light or dark)',
            selectAll: 'Select All',
            export: 'Export'
        }
    },
    dataTransfer: {
        zh: {
            exportAsLink: '导出为链接',
            exportAsFile: '导出为文件',
            importFromFile: '从文件导入',
            copyLink: '复制链接',
            linkCopied: '链接已复制到剪贴板',
            linkExportSuccess: '链接已生成',
            encoding: '编码方式:',
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
            dataTransferModuleMissing: '数据传输模块未找到，请确保 features/data-transfer.js 文件存在。'
        },
        en: {
            exportAsLink: 'Export as Link',
            exportAsFile: 'Export as File',
            importFromFile: 'Import from File',
            copyLink: 'Copy Link',
            linkCopied: 'Link copied to clipboard',
            linkExportSuccess: 'Link generated',
            encoding: 'Encoding:',
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
            dataTransferModuleMissing: 'Data transfer module not found. Please ensure features/data-transfer.js file exists.'
        }
    },
    ai: {
        zh: {
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
            bestMoveDirection: '最佳移动方向',
            mergeOpportunitiesLabel: '潜在合并机会',
            gameStateAssessment: '游戏状态评估',
            scorePotentialLabel: '得分潜力分析',
            noMergeOpportunities: '无',
            mergeOpportunitiesSuffix: '处',
            safe: '安全',
            scorePotentialHigh: '预计可合并多个高价值方块',
            scorePotentialMedium: '有一定合并机会',
            hideBestMove: '隐藏最佳移动方向',
            showBestMove: '显示最佳移动方向',
            up: '向上',
            down: '向下',
            left: '向左',
            right: '向右',
            aiAnalysisModuleMissing: 'AI分析模块未找到，请确保 features/ai-analysis.js 文件存在。',
            aiAnalysisModuleFailed: 'AI分析模块加载失败:',
            aiAlgorithmAnalysis: '算法分析',
            aiAiAnalysis: 'AI分析',
            aiSuggestionLabel: 'AI建议',
            regenerate: '重新生成',
            regenerating: '重新生成中...',
            aiApiSettings: 'AI',
            aiApiSettingsItem: 'API设置',
            aiBestMoveOnly: '仅请求最佳移动方向',
            aiBestMoveOnlyHint: '自动操作时跳过详细分析，响应更快',
            aiAllowUndo: '允许推荐撤销',
            aiAllowUndoHint: 'AI 可以推荐撤销上一步来挽回失误',
            aiApiBaseUrl: 'API Base URL',
            aiApiKey: 'API Key',
            aiApiModel: '模型',
            aiApiSettingsSaved: 'API设置保存成功！',
            aiApiSaved: '已保存',
            aiApiSettingsSaveFailed: 'API设置保存失败！',
            aiApiConfirmReset: '确定要重置AI设置吗？',
            aiApiBaseUrlEmpty: 'API Base URL不能为空',
            aiApiBaseUrlInvalid: 'API Base URL格式无效',
            aiApiKeyEmpty: 'API Key不能为空',
            aiApiModelEmpty: '模型不能为空',
            aiApiRequestFailed: 'AI请求失败',
            aiApiParseError: 'AI响应解析失败',
            aiApiNetworkError: '网络错误',
            aiApiModuleMissing: 'AI API模块未找到，请确保 features/ai-api.js 文件存在。',
            aiApiLoading: '加载中...',
            aiApiModelsFailed: '无法获取模型列表',
            aiApiCheck: '检查可用性',
            aiApiChecking: '检查中...',
            aiApiAvailable: 'API可用',
            aiApiUnavailable: 'API不可用',
            aiApiMissingConfig: '缺少必要配置'
        },
        en: {
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
            bestMoveDirection: 'Best Move Direction',
            mergeOpportunitiesLabel: 'Potential Merge Opportunities',
            gameStateAssessment: 'Game State Assessment',
            scorePotentialLabel: 'Score Potential Analysis',
            noMergeOpportunities: 'None',
            mergeOpportunitiesSuffix: '',
            safe: 'Safe',
            scorePotentialHigh: 'Multiple high-value tiles can be merged',
            scorePotentialMedium: 'Some merge opportunities available',
            hideBestMove: 'Hide Best Move Direction',
            showBestMove: 'Show Best Move Direction',
            up: 'Up',
            down: 'Down',
            left: 'Left',
            right: 'Right',
            aiAnalysisModuleMissing: 'AI analysis module not found. Please ensure features/ai-analysis.js file exists.',
            aiAnalysisModuleFailed: 'AI analysis module loading failed:',
            aiAlgorithmAnalysis: 'Algorithm Analysis',
            aiAiAnalysis: 'AI Analysis',
            aiSuggestionLabel: 'AI Suggestion',
            regenerate: 'Regenerate',
            regenerating: 'Regenerating...',
            aiApiSettings: 'AI',
            aiApiSettingsItem: 'API Settings',
            aiBestMoveOnly: 'Request best move only',
            aiBestMoveOnlyHint: 'Skip detailed analysis during auto play for faster responses',
            aiAllowUndo: 'Allow undo recommendation',
            aiAllowUndoHint: 'AI may recommend undoing the last move to recover from a mistake',
            aiApiBaseUrl: 'API Base URL',
            aiApiKey: 'API Key',
            aiApiModel: 'Model',
            aiApiSettingsSaved: 'API settings saved successfully!',
            aiApiSaved: 'Saved',
            aiApiSettingsSaveFailed: 'Failed to save API settings!',
            aiApiConfirmReset: 'Are you sure you want to reset AI settings?',
            aiApiBaseUrlEmpty: 'API Base URL cannot be empty',
            aiApiBaseUrlInvalid: 'Invalid API Base URL format',
            aiApiKeyEmpty: 'API Key cannot be empty',
            aiApiModelEmpty: 'Model cannot be empty',
            aiApiRequestFailed: 'AI request failed',
            aiApiParseError: 'AI response parse error',
            aiApiNetworkError: 'Network error',
            aiApiModuleMissing: 'AI API module not found. Please ensure features/ai-api.js file exists.',
            aiApiLoading: 'Loading...',
            aiApiModelsFailed: 'Failed to fetch models',
            aiApiCheck: 'Check Availability',
            aiApiChecking: 'Checking...',
            aiApiAvailable: 'API Available',
            aiApiUnavailable: 'API Unavailable',
            aiApiMissingConfig: 'Missing required configuration'
        }
    },
    autoPlay: {
        zh: {
            autoPlayTitle: 'AI自动操作',
            autoPlayStart: '自动操作',
            autoPlayPause: '暂停',
            autoPlayResume: '继续',
            autoPlayStop: '停止',
            autoPlayStatusIdle: '未启动',
            autoPlayBadgeRunning: 'AI自动操作中 · 已执行 {steps} 步',
            autoPlayBadgePaused: '自动操作已暂停 · {steps} 步',
            autoPlayRunning: '自动操作中 · 已执行 {steps} 步',
            autoPlayPausedStatus: '已暂停 · 已执行 {steps} 步',
            autoPlayGameEnded: '游戏已结束，自动操作已停止',
            autoPlayMoveBlocked: '无法移动，自动操作已停止',
            autoPlayAiUnavailable: 'AI请求模块不可用，自动操作已停止',
            autoPlayAiFailed: 'AI请求失败，自动操作已停止',
            autoPlayKeepAwake: '自动操作时保持屏幕常亮',
            autoPlayKeepAwakeHint: '自动操作运行期间防止屏幕休眠',
            autoPlayAiSettingsRequired: '请先完成 API 设置',
            aiApiConfigIncomplete: 'API 设置未完成，请点击下方“API设置”进入配置'
        },
        en: {
            autoPlayTitle: 'AI Auto Play',
            autoPlayStart: 'Auto Play',
            autoPlayPause: 'Pause',
            autoPlayResume: 'Resume',
            autoPlayStop: 'Stop',
            autoPlayStatusIdle: 'Not started',
            autoPlayBadgeRunning: 'AI auto play · {steps} moves',
            autoPlayBadgePaused: 'Auto play paused · {steps} moves',
            autoPlayRunning: 'Running · {steps} moves',
            autoPlayPausedStatus: 'Paused · {steps} moves',
            autoPlayGameEnded: 'Game over, auto play stopped',
            autoPlayMoveBlocked: 'Cannot move, auto play stopped',
            autoPlayAiUnavailable: 'AI request module unavailable, auto play stopped',
            autoPlayAiFailed: 'AI request failed, auto play stopped',
            autoPlayKeepAwake: 'Keep screen awake during auto play',
            autoPlayKeepAwakeHint: 'Prevent the screen from sleeping while auto play is running',
            autoPlayAiSettingsRequired: 'Please complete the API settings first',
            aiApiConfigIncomplete: 'API settings are incomplete. Tap "API Settings" below to configure'
        }
    },
    webrtc: {
        zh: {
            webrtcModalTitle: '局域网同步',
            webrtcSelectDesc: '通过 6 位连接码与另一台设备快速配对同步（信令经公共服务器，游戏数据仍为设备间点对点直连）。也可展开手动模式互换连接码。',
            webrtcCreateConnection: '创建连接',
            webrtcJoinConnection: '加入连接',
            webrtcHostStep1: '第 1 步：将此连接码发给对方',
            webrtcCopyOffer: '复制连接码',
            webrtcHostStep2: '第 2 步：粘贴对方的应答码',
            webrtcFinishConnection: '完成连接',
            webrtcJoinPasteOffer: '粘贴对方的连接码',
            webrtcGenerateAnswer: '生成应答码',
            webrtcJoinStep2: '将此应答码发回给对方',
            webrtcCopyAnswer: '复制应答码',
            webrtcConnected: '已建立连接',
            webrtcSendData: '发送游戏数据',
            webrtcModuleMissing: '局域网同步模块未找到，请确保 features/webrtc-sync.js 文件存在。',
            webrtcConnectedReady: '已连接，可以发送游戏数据',
            webrtcDisconnected: '连接已断开',
            webrtcGeneratingCode: '正在生成连接码...',
            webrtcHostInstructions: '1. 将连接码发送给对方\n2. 把对方回传的应答码粘贴到下方并点击"完成连接"',
            webrtcGenerateFailed: '生成连接码失败',
            webrtcConnecting: '正在建立连接...',
            webrtcInvalidAnswer: '应答码无效',
            webrtcGeneratingAnswer: '正在生成应答码...',
            webrtcSendAnswerBack: '将应答码发回给对方，等待连接建立...',
            webrtcInvalidOffer: '连接码无效',
            webrtcDataSent: '已发送游戏数据',
            webrtcSendFailed: '发送失败',
            webrtcConfirmApply: '收到对方发来的游戏数据，是否应用？',
            webrtcPasteAnswer: '粘贴对方的应答码',
            webrtcQuickHostTitle: '将此 6 位连接码告诉对方',
            webrtcQuickJoinTitle: '输入对方的 6 位连接码',
            webrtcCopyRoomCode: '复制连接码',
            webrtcRoomRegenerate: '重新生成',
            webrtcConnectRoom: '连接',
            webrtcCopied: '已复制',
            webrtcCreatingRoom: '正在获取连接码...',
            webrtcWaitingForPeer: '等待对方加入...',
            webrtcRoomFailed: '获取连接码失败，请检查网络后重试',
            webrtcCodeInvalid: '请输入 6 位数字连接码',
            webrtcJoiningRoom: '正在连接...',
            webrtcJoinRoomFailed: '连接失败',
            webrtcPeerUnavailable: '未找到该连接码对应的设备，请确认对方已创建连接且连接码正确',
            webrtcServerUnreachable: '无法连接公共信令服务器，请检查网络或展开下方手动模式',
            webrtcBrowserIncompatible: '当前浏览器不支持 WebRTC，请更换浏览器或使用手动模式',
            webrtcManualMode: '手动模式（备用）：互换长连接码',
            webrtcConnectedBadge: '局域网已连接',
            ready: '准备就绪',
            connected: '已连接',
            receiving: '接收中',
            receivingBytes: '接收中: {bytes} 字节',
            receivingBytesTotal: '接收中: {bytes} / {total} 字节',
            includeSettings: '包含设置数据',
            disconnectConnection: '断开连接',
            disconnect: '断开',
            syncLiveHint: '连接保持中，游戏状态与设置更改将自动同步',
            liveSyncData: '实时同步数据'
        },
        en: {
            webrtcModalTitle: 'LAN Sync',
            webrtcSelectDesc: 'Pair with another device via a 6-digit code (signaling goes through a public server, game data is still peer-to-peer). Or expand manual mode to exchange codes.',
            webrtcCreateConnection: 'Create Connection',
            webrtcJoinConnection: 'Join Connection',
            webrtcHostStep1: 'Step 1: Send this code to the other device',
            webrtcCopyOffer: 'Copy Code',
            webrtcHostStep2: 'Step 2: Paste the answer code from the other device',
            webrtcFinishConnection: 'Finish Connection',
            webrtcJoinPasteOffer: 'Paste the connection code',
            webrtcGenerateAnswer: 'Generate Answer Code',
            webrtcJoinStep2: 'Send this answer code back',
            webrtcCopyAnswer: 'Copy Answer Code',
            webrtcConnected: 'Connected',
            webrtcSendData: 'Send Game Data',
            webrtcModuleMissing: 'LAN sync module not found. Please ensure features/webrtc-sync.js file exists.',
            webrtcConnectedReady: 'Connected. You can send game data now',
            webrtcDisconnected: 'Disconnected',
            webrtcGeneratingCode: 'Generating connection code...',
            webrtcHostInstructions: '1. Send the code to the other device\n2. Paste the answer code below and click "Finish Connection"',
            webrtcGenerateFailed: 'Failed to generate code',
            webrtcConnecting: 'Connecting...',
            webrtcInvalidAnswer: 'Invalid answer code',
            webrtcGeneratingAnswer: 'Generating answer code...',
            webrtcSendAnswerBack: 'Send the answer code back and wait for connection...',
            webrtcInvalidOffer: 'Invalid connection code',
            webrtcDataSent: 'Game data sent',
            webrtcSendFailed: 'Send failed',
            webrtcConfirmApply: 'Received game data from the other device. Apply it?',
            webrtcPasteAnswer: 'Paste the answer code',
            webrtcQuickHostTitle: 'Share this 6-digit code with the other device',
            webrtcQuickJoinTitle: 'Enter the 6-digit code',
            webrtcCopyRoomCode: 'Copy Code',
            webrtcRoomRegenerate: 'Regenerate',
            webrtcConnectRoom: 'Connect',
            webrtcCopied: 'Copied',
            webrtcCreatingRoom: 'Getting connection code...',
            webrtcWaitingForPeer: 'Waiting for the other device...',
            webrtcRoomFailed: 'Failed to get connection code. Check your network and retry',
            webrtcCodeInvalid: 'Please enter a 6-digit code',
            webrtcJoiningRoom: 'Connecting...',
            webrtcJoinRoomFailed: 'Connection failed',
            webrtcPeerUnavailable: 'No device found for this code. Make sure the other device has created a connection and the code is correct',
            webrtcServerUnreachable: 'Cannot reach the public signaling server. Check your network or expand manual mode below',
            webrtcBrowserIncompatible: 'This browser does not support WebRTC. Try another browser or use manual mode',
            webrtcManualMode: 'Manual mode (fallback): exchange long codes',
            webrtcConnectedBadge: 'LAN connected',
            ready: 'Ready',
            connected: 'Connected',
            receiving: 'Receiving',
            receivingBytes: 'Receiving: {bytes} bytes',
            receivingBytesTotal: 'Receiving: {bytes} / {total} bytes',
            includeSettings: 'Include settings data',
            disconnectConnection: 'Disconnect',
            disconnect: 'Disconnect',
            syncLiveHint: 'Connection active. Game and setting changes sync automatically.',
            liveSyncData: 'Live sync data'
        }
    },
    keybind: {
        zh: {
            operations: '操作',
            keybindingsSettings: '快捷键设置',
            keybindingsTip: '方向键与 Esc 始终可用；点击按键按钮后按下新键即可修改，按 Esc 取消。',
            resetToDefault: '重置默认',
            pressKey: '按下按键...',
            keybindingConflict: '快捷键冲突，请修改为其他按键',
            kbUp: '向上移动',
            kbDown: '向下移动',
            kbLeft: '向左移动',
            kbRight: '向右移动',
            kbPause: '暂停/继续',
            kbUndo: '撤销',
            kbNewGame: '新游戏',
            kbGrid: '切换网格大小',
            kbAiAutoPlay: 'AI自动操作',
            i18nModuleMissing: 'i18n模块未找到，请确保 features/i18n.js 文件存在。',
            i18nModuleFailed: 'i18n模块加载失败:'
        },
        en: {
            operations: 'Controls',
            keybindingsSettings: 'Keyboard Shortcuts',
            keybindingsTip: 'Arrow keys and Esc always work; click a key button then press a new key to rebind, Esc to cancel.',
            resetToDefault: 'Reset Defaults',
            pressKey: 'Press a key...',
            keybindingConflict: 'Shortcut conflict, please choose another key',
            kbUp: 'Move Up',
            kbDown: 'Move Down',
            kbLeft: 'Move Left',
            kbRight: 'Move Right',
            kbPause: 'Pause/Resume',
            kbUndo: 'Undo',
            kbNewGame: 'New Game',
            kbGrid: 'Cycle Grid Size',
            kbAiAutoPlay: 'AI Auto Play',
            i18nModuleMissing: 'i18n module not found. Please ensure features/i18n.js file exists.',
            i18nModuleFailed: 'i18n module loading failed:'
        }
    }
};
const REGISTERED_MODULES = new Set();
function registerModule(name) {
    if (!MODULE_TRANSLATIONS[name]) {
        console.warn('[i18n] registerModule: unknown module "' + name + '"');
        return;
    }
    if (REGISTERED_MODULES.has(name)) {
        return;
    }
    const moduleTable = MODULE_TRANSLATIONS[name];
    const langs = Object.keys(moduleTable);
    for (let i = 0; i < langs.length; i++) {
        const lang = langs[i];
        Object.assign(translations[lang], moduleTable[lang]);
    }
    REGISTERED_MODULES.add(name);
    clearTranslationCache();
}
let currentLanguage = localStorage.getItem('2048-setting-language') || 'auto';
function getLang() {
    if (currentLanguage === 'auto') {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return translations[langCode] ? langCode : 'zh';
    }
    return currentLanguage;
}
function setLang(lang) {
    if (lang !== 'auto' && !translations[lang]) {
        return false;
    }
    if (lang === currentLanguage) {
        return true;
    }
    currentLanguage = lang;
    localStorage.setItem('2048-setting-language', lang);
    clearTranslationCache();
    updateAllTranslations();
    if (typeof window.updateDocumentTitle === 'function') {
        window.updateDocumentTitle();
    }
    return true;
}
const translationCache = new Map();
function clearTranslationCache() {
    translationCache.clear();
}
function resolveTranslation(key, lang) {
    return key in translations[lang] ? translations[lang][key] : (key in translations['zh'] ? translations['zh'][key] : '[' + key + ']');
}
function t(key, params = {}) {
    const hasParams = !!params && typeof params === 'object' && Object.keys(params).length > 0;
    if (hasParams) {
        let text = resolveTranslation(key, getLang());
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`{${param}}`, value);
        }
        return text;
    }
    const lang = getLang();
    const cacheKey = lang + ' ' + key;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }
    const resolved = resolveTranslation(key, lang);
    translationCache.set(cacheKey, resolved);
    return resolved;
}
function updateIconTextElement(element, key) {
    const text = t(key);
    const icon = element.querySelector('i');
    if (!icon) {
        element.textContent = text;
        return;
    }
    let updated = false;
    Array.from(element.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!updated) {
                node.nodeValue = ' ' + text;
                updated = true;
            } else {
                node.nodeValue = '';
            }
        }
    });
    if (!updated) {
        element.appendChild(document.createTextNode(' ' + text));
    }
}
function updateDecoratedText(container, emoji, iconClass, text) {
    if (!container) return;
    let deco = container.firstElementChild;
    const decoIsEmoji = !!deco && deco.classList && deco.classList.contains('emoji-icon');
    const decoIsIcon = !!deco && deco.tagName === 'I';
    if (emoji) {
        if (decoIsEmoji) {
            deco.textContent = emoji;
        } else {
            if (deco && decoIsIcon) {
                deco.remove();
            }
            deco = document.createElement('span');
            deco.className = 'emoji-icon';
            if (iconClass && iconClass.indexOf('mr-1') !== -1) {
                deco.classList.add('mr-1');
            }
            deco.textContent = emoji;
            container.insertBefore(deco, container.firstChild);
        }
    } else if (iconClass) {
        if (decoIsIcon) {
            deco.className = iconClass;
        } else {
            if (deco && decoIsEmoji) {
                deco.remove();
            }
            deco = document.createElement('i');
            deco.className = iconClass;
            container.insertBefore(deco, container.firstChild);
        }
    } else if (deco && (decoIsIcon || decoIsEmoji)) {
        deco.remove();
        deco = null;
    }
    const textValue = deco ? ' ' + text : text;
    let textNode = null;
    Array.from(container.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!textNode) {
                textNode = node;
            } else {
                node.remove();
            }
        }
    });
    if (!textNode) {
        textNode = document.createTextNode(textValue);
        container.appendChild(textNode);
    } else {
        textNode.nodeValue = textValue;
    }
}
function updateAllTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (!key) return;
        const mode = element.getAttribute('data-i18n-mode');
        if (mode === 'icon+text') {
            updateIconTextElement(element, key);
        } else if (mode === 'span-text') {
            const span = element.querySelector('span[data-i18n]') || element.querySelector('span');
            if (span) {
                span.textContent = t(key);
            } else {
                element.textContent = t(key);
            }
        } else if (mode === 'text' || mode) {
            element.textContent = t(key);
        } else {
            if (key === 'footer') {
                updateIconTextElement(element, key);
            } else if (element.classList.contains('category-title')) {
                const span = element.querySelector('span[data-i18n]');
                if (span) {
                    span.textContent = t(key);
                }
            } else if (element.tagName === 'BUTTON') {
                const span = element.querySelector('span');
                if (span) {
                    span.textContent = t(key);
                } else {
                    element.textContent = t(key);
                }
            } else {
                element.textContent = t(key);
            }
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (key) {
            element.placeholder = t(key);
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
    const gridButtons = [
        document.getElementById('grid-3x3'),
        document.getElementById('grid-4x4'),
        document.getElementById('grid-5x5')
    ];
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
    gridButtons.forEach(btn => {
        if (!btn) return;
        btn.style.width = lang === 'en' ? '80px' : '';
    });
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
        const webrtcAnswerInput = document.getElementById('webrtc-answer-input');
        if (webrtcAnswerInput) {
            webrtcAnswerInput.placeholder = t('webrtcPasteAnswer');
        }
        const webrtcOfferInput = document.getElementById('webrtc-offer-input');
        if (webrtcOfferInput) {
            webrtcOfferInput.placeholder = t('webrtcJoinPasteOffer');
        }
        if (window.renderKeybindingsList && document.getElementById('keybindings-list')) {
            window.renderKeybindingsList();
        }
    }
    if (window.SyncIndicator) {
        window.SyncIndicator.refresh();
    }
    if (window.aiAutoPlay && typeof window.aiAutoPlay.refresh === 'function') {
        window.aiAutoPlay.refresh();
    }
    updateLanguageSelector();
    updateThemeSelector();
}
function updateLanguageSelector() {
    const languageLabels = document.querySelectorAll('[for="language-toggle"]');
    languageLabels.forEach(label => {
        label.textContent = t('language');
    });
    const currentLangText = currentLanguage === 'auto' ? t('auto') : t(currentLanguage === 'zh' ? 'chinese' : 'english');
    const selectedEmoji = currentLanguage === 'zh' ? '🇨🇳' : (currentLanguage === 'en' ? '🇺🇸' : '');
    const selectedIcon = currentLanguage === 'auto' ? 'fa-solid fa-globe' : '';
    const languageSelects = document.querySelectorAll('[data-i18n-select="true"]');
    languageSelects.forEach(select => {
        const selectSelectedDiv = select.querySelector('.select-selected');
        const selectItems = select.querySelectorAll('.select-item');
        if (selectSelectedDiv) {
            const textSpan = selectSelectedDiv.querySelector('span');
            if (textSpan) {
                updateDecoratedText(textSpan, selectedEmoji, selectedIcon, currentLangText);
            }
        }
        selectItems.forEach(item => {
            const value = item.dataset.value;
            if (value === 'auto') {
                updateDecoratedText(item, '', 'fa-solid fa-globe mr-1', t('auto'));
            } else if (value === 'zh') {
                updateDecoratedText(item, '🇨🇳', 'fa-solid fa-globe mr-1', t('chinese'));
            } else if (value === 'en') {
                updateDecoratedText(item, '🇺🇸', 'fa-solid fa-globe mr-1', t('english'));
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
    let currentTheme = themeToggle?.value || localStorage.getItem('2048-setting-theme');
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
    if (selectSelectedDiv) {
        let wrapper = selectSelectedDiv.querySelector('span');
        if (!wrapper) {
            wrapper = document.createElement('span');
            selectSelectedDiv.insertBefore(wrapper, selectSelectedDiv.firstChild);
        }
        let iconEl = wrapper.querySelector('i');
        if (!iconEl) {
            iconEl = document.createElement('i');
            wrapper.insertBefore(iconEl, wrapper.firstChild);
        }
        iconEl.className = icon + ' mr-1';
        let textSpan = wrapper.querySelector('span[data-i18n]');
        if (!textSpan) {
            textSpan = document.createElement('span');
            wrapper.appendChild(textSpan);
        }
        textSpan.setAttribute('data-i18n', i18nKey);
        textSpan.textContent = themeText;
        if (!selectSelectedDiv.querySelector('i.fa-chevron-down')) {
            const chevron = document.createElement('i');
            chevron.className = 'fa fa-chevron-down text-xs ml-2 text-gray-500 dark:text-gray-400';
            selectSelectedDiv.appendChild(chevron);
        }
    }
    const themeItemConfig = {
        auto: { icon: 'fa-solid fa-desktop mr-1', key: 'followBrowser' },
        light: { icon: 'fa-solid fa-sun mr-1', key: 'lightTheme' },
        dark: { icon: 'fa-solid fa-moon mr-1', key: 'darkTheme' },
        custom: { icon: 'fa-solid fa-palette mr-1', key: 'custom' }
    };
    selectItems.forEach(item => {
        const config = themeItemConfig[item.dataset.value];
        if (!config) return;
        let iconEl = item.querySelector('i');
        if (!iconEl) {
            iconEl = document.createElement('i');
            item.insertBefore(iconEl, item.firstChild);
        }
        iconEl.className = config.icon;
        let textSpan = item.querySelector('span[data-i18n]');
        if (!textSpan) {
            textSpan = document.createElement('span');
            item.appendChild(textSpan);
        }
        textSpan.setAttribute('data-i18n', config.key);
        textSpan.textContent = t(config.key);
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
            updateDecoratedText(selectedText, lang.emoji || '', lang.icon || '', newLangText);
            languages.forEach(l => {
                const langItem = selectItems.querySelector(`[data-value="${l.value}"]`);
                if (langItem) {
                    langItem.classList.toggle('selected', l.value === currentLanguage);
                    const updatedText = l.value === 'auto' ? t('auto') : t(l.value === 'zh' ? 'chinese' : 'english');
                    updateDecoratedText(langItem, l.emoji || '', l.icon ? l.icon + ' mr-1' : '', updatedText);
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
        const anchor = appearanceCategory.querySelector('#settings-module-appearance') ||
            appearanceCategory.querySelector('#custom-theme-button-container') ||
            appearanceCategory.querySelector('.flex.items-center.justify-between');
        if (anchor) {
            const separator = document.createElement('div');
            separator.className = 'border-b border-gray-200 dark:border-gray-700 my-3 mx-2';
            anchor.parentNode.insertBefore(separator, anchor.nextSibling);
            anchor.parentNode.insertBefore(languageContainer, separator.nextSibling);
        }
    }
}
function initI18n() {
    registerModule('keybind');
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
        ['ai-settings-modal-title', 'aiApiSettingsItem'],
        ['easy-mode', 'easy'],
        ['medium-mode', 'medium'],
        ['hard-mode', 'hard'],
        ['custom-grid', 'custom'],
        ['apply-custom-grid', 'apply'],
        ['cancel-custom-grid', 'cancel'],
        ['game-message-title', 'gameWon'],
        ['game-message-text', 'gameWonText'],
        ['game-message-button', 'tryAgain'],
        ['custom-theme-button', 'customThemeButton']
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
        ['export-link-button', 'exportAsLink'],
        ['export-file-button', 'exportAsFile'],
        ['import-file-button', 'importFromFile'],
        ['save-custom-theme', 'save'],
        ['reset-custom-theme', 'reset'],
        ['export-custom-theme', 'exportTheme'],
        ['import-custom-theme', 'importTheme'],
        ['confirm-export-theme', 'export'],
        ['cancel-export-theme', 'cancel'],
        ['save-ai-settings', 'save'],
        ['reset-ai-settings', 'reset']
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
    const themeExportOptions = document.querySelector('#theme-export-options');
    if (themeExportOptions) {
        const h3Element = themeExportOptions.previousElementSibling;
        if (h3Element && h3Element.tagName === 'H3' && h3Element.textContent.trim() === '选择要导出的主题项') {
            h3Element.setAttribute('data-i18n', 'selectThemeItems');
        }
    }
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
    updateDynamicContent: updateDynamicContent,
    clearTranslationCache: clearTranslationCache,
    registerModule: registerModule,
    init: initI18n
};
window.i18nModuleLoaded = true;
console.log('i18n Module v' + i18nVersion + ' loaded');