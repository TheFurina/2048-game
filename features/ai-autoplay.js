const aiAutoPlayVersion = '1.2';
window.aiAutoPlayVersion = aiAutoPlayVersion;
window.aiAutoPlayLoaded = true;
const AUTO_PLAY_DIRECTIONS = ['up', 'down', 'left', 'right'];
const AUTO_PLAY_ALGORITHM_INTERVAL = 350;
const AUTO_PLAY_AI_INTERVAL = 500;
const AUTO_PLAY_MAX_CONSECUTIVE_FAILURES = 6;
const autoPlayStatus = {
    running: false,
    paused: false,
    steps: 0,
    failCount: 0,
    stopReason: null,
    timer: null
};
function autoPlayT(key, params) {
    return window.i18n && window.i18n.t ? window.i18n.t(key, params) : key;
}
function getAutoPlayAnalysisMode() {
    try {
        if (typeof currentAnalysisMode !== 'undefined' && (currentAnalysisMode === 'ai' || currentAnalysisMode === 'algorithm')) {
            return currentAnalysisMode;
        }
    } catch (e) {}
    try {
        const saved = localStorage.getItem('2048-analysis-mode');
        if (saved === 'ai' || saved === 'algorithm') {
            return saved;
        }
    } catch (e) {}
    return 'algorithm';
}
function isAutoPlayKeepAwakeEnabled() {
    if (window.settingsManager && typeof window.settingsManager.load === 'function') {
        return window.settingsManager.load('auto-play-keep-screen-awake');
    }
    return false;
}
let autoPlayWakeLock = null;
async function requestAutoPlayWakeLock() {
    if (!isAutoPlayKeepAwakeEnabled()) return;
    if (!navigator.wakeLock || typeof navigator.wakeLock.request !== 'function') return;
    if (autoPlayWakeLock) return;
    try {
        autoPlayWakeLock = await navigator.wakeLock.request('screen');
        autoPlayWakeLock.addEventListener('release', function() {
            autoPlayWakeLock = null;
        });
    } catch (e) {
        autoPlayWakeLock = null;
    }
}
function releaseAutoPlayWakeLock() {
    const lock = autoPlayWakeLock;
    autoPlayWakeLock = null;
    if (!lock) return;
    try {
        lock.release();
    } catch (e) {}
}
function isAutoPlayAiConfigComplete() {
    if (!window.aiRequest || typeof window.aiRequest.validateConfig !== 'function' || typeof window.aiRequest.getConfig !== 'function') {
        return true;
    }
    try {
        const errors = window.aiRequest.validateConfig(window.aiRequest.getConfig());
        return !(Array.isArray(errors) && errors.length > 0);
    } catch (e) {
        return true;
    }
}
function isAutoPlayBestMoveOnlyEnabled() {
    if (window.settingsManager && typeof window.settingsManager.load === 'function') {
        return window.settingsManager.load('ai-best-move-only');
    }
    return true;
}
function isAutoPlayAllowUndoEnabled() {
    if (window.settingsManager && typeof window.settingsManager.load === 'function') {
        return window.settingsManager.load('ai-allow-undo');
    }
    return true;
}
function getAutoPlayValidMoves() {
    const hasHistory = window.gameState && Array.isArray(window.gameState.history) && window.gameState.history.length > 0;
    return isAutoPlayAllowUndoEnabled() && hasHistory ? AUTO_PLAY_DIRECTIONS.concat('undo') : AUTO_PLAY_DIRECTIONS;
}
async function getAutoPlayBestMove(mode) {
    if (mode === 'ai') {
        if (typeof requestGameAnalysis !== 'function') {
            return { error: 'ai-unavailable' };
        }
        try {
            const language = window.i18n && window.i18n.getLang ? window.i18n.getLang() : 'zh';
            const bestMoveOnly = isAutoPlayBestMoveOnlyEnabled();
            const result = await requestGameAnalysis(window.gameState, language, { bestMoveOnly: bestMoveOnly });
            if (result && result.success && result.data && getAutoPlayValidMoves().indexOf(result.data.bestMove) !== -1) {
                return { move: result.data.bestMove, results: bestMoveOnly ? null : result.data };
            }
            return { error: 'ai-failed' };
        } catch (e) {
            return { error: 'ai-failed' };
        }
    }
    if (typeof analyzeGameStateWithAlgorithm !== 'function') {
        return { error: 'ai-unavailable' };
    }
    try {
        const results = analyzeGameStateWithAlgorithm();
        if (results && getAutoPlayValidMoves().indexOf(results.bestMove) !== -1) {
            return { move: results.bestMove, results: results };
        }
        return { error: 'ai-failed' };
    } catch (e) {
        return { error: 'ai-failed' };
    }
}
function isAutoPlayGameActive() {
    const state = window.gameState;
    if (!state) return false;
    if (state.gameOver) return false;
    if (state.gameWon && !state.isEndlessMode) return false;
    return true;
}
function updateAutoPlayStatusText(text) {
    const statusElement = document.getElementById('auto-play-status');
    if (statusElement) {
        statusElement.textContent = text;
    }
}
function ensureAutoPlayBadgeStyles() {
    if (document.getElementById('auto-play-badge-styles')) return;
    const style = document.createElement('style');
    style.id = 'auto-play-badge-styles';
    style.textContent = [
        '@keyframes autoPlayBadgePopIn {',
        '    0% { opacity: 0; transform: scale(0.7); }',
        '    60% { transform: scale(1.06); }',
        '    100% { opacity: 1; transform: scale(1); }',
        '}',
        '@keyframes autoPlayBadgeGlow {',
        '    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }',
        '    50% { box-shadow: 0 0 0 7px rgba(255,255,255,0); }',
        '}',
        '@keyframes autoPlayBadgeShake {',
        '    0%, 100% { transform: translateX(0); }',
        '    20% { transform: translateX(-5px); }',
        '    40% { transform: translateX(5px); }',
        '    60% { transform: translateX(-3px); }',
        '    80% { transform: translateX(3px); }',
        '}'
    ].join('\n');
    document.head.appendChild(style);
}
function buildAutoPlayBadgeElement(styleText) {
    const badge = document.createElement('div');
    badge.id = 'auto-play-board-badge';
    badge.style.cssText = styleText;
    const dot = document.createElement('span');
    dot.className = 'auto-play-dot';
    dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#ffffff;display:inline-block;';
    const text = document.createElement('span');
    text.className = 'auto-play-badge-text';
    const controlButton = document.createElement('button');
    controlButton.className = 'auto-play-badge-control';
    controlButton.type = 'button';
    controlButton.style.cssText = 'display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:none;border-radius:50%;background:rgba(255,255,255,0.25);color:#ffffff;cursor:pointer;font-size:10px;padding:0;flex:0 0 auto;';
    controlButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    controlButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleAutoPlay();
    });
    const closeButton = document.createElement('button');
    closeButton.className = 'auto-play-badge-close';
    closeButton.type = 'button';
    closeButton.style.cssText = 'display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:none;border-radius:50%;background:rgba(255,255,255,0.25);color:#ffffff;cursor:pointer;font-size:10px;padding:0;flex:0 0 auto;';
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        stopAutoPlay();
    });
    badge.appendChild(dot);
    badge.appendChild(text);
    badge.appendChild(controlButton);
    badge.appendChild(closeButton);
    return badge;
}
function ensureAutoPlayBoardBadge() {
    ensureAutoPlayBadgeStyles();
    let badge = document.getElementById('auto-play-board-badge');
    if (badge) return badge;
    const touchArea = document.getElementById('game-touch-area');
    if (touchArea) {
        badge = buildAutoPlayBadgeElement('display:none;position:absolute;left:50%;top:50%;translate:-50% -50%;align-items:center;justify-content:center;gap:8px;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:bold;width:fit-content;max-width:100%;white-space:nowrap;z-index:10;');
        touchArea.style.position = 'relative';
        touchArea.appendChild(badge);
        return badge;
    }
    const board = document.getElementById('game-container');
    if (!board || !board.parentNode) return null;
    badge = buildAutoPlayBadgeElement('display:none;align-items:center;justify-content:center;gap:8px;margin:10px auto 0;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:bold;width:fit-content;max-width:100%;');
    board.parentNode.insertBefore(badge, board.nextSibling);
    return badge;
}
const AUTO_PLAY_BADGE_ANIMATIONS = {
    running: 'autoPlayBadgePopIn 0.25s ease forwards, autoPlayBadgeGlow 1.8s ease-in-out 0.3s infinite',
    paused: 'autoPlayBadgePopIn 0.25s ease forwards',
    blocked: 'autoPlayBadgePopIn 0.25s ease forwards, autoPlayBadgeShake 0.45s ease 0.3s'
};
function updateAutoPlayBoardBadge() {
    const badge = ensureAutoPlayBoardBadge();
    if (!badge) return;
    const dot = badge.querySelector('.auto-play-dot');
    const text = badge.querySelector('.auto-play-badge-text');
    const controlIcon = badge.querySelector('.auto-play-badge-control i');
    const showBlocked = !autoPlayStatus.running && autoPlayStatus.stopReason === 'blocked';
    const stateKey = autoPlayStatus.running
        ? (autoPlayStatus.paused ? 'paused' : 'running')
        : (showBlocked ? 'blocked' : 'hidden');
    const stateChanged = autoPlayStatus.badgeState !== stateKey;
    autoPlayStatus.badgeState = stateKey;
    if (stateKey === 'hidden') {
        badge.style.display = 'none';
        badge.style.animation = '';
        return;
    }
    badge.style.display = 'flex';
    if (stateChanged) {
        badge.style.animation = 'none';
        void badge.offsetWidth;
        badge.style.animation = AUTO_PLAY_BADGE_ANIMATIONS[stateKey];
    }
    if (stateKey === 'running') {
        badge.className = 'bg-primary dark:bg-dark-primary text-white';
        if (dot) dot.className = 'auto-play-dot animate-pulse';
        if (text) text.textContent = autoPlayT('autoPlayBadgeRunning', { steps: autoPlayStatus.steps });
        if (controlIcon) controlIcon.className = 'fa-solid fa-pause';
    } else if (stateKey === 'paused') {
        badge.className = 'bg-gray-400 dark:bg-gray-600 text-white';
        if (dot) dot.className = 'auto-play-dot';
        if (text) text.textContent = autoPlayT('autoPlayBadgePaused', { steps: autoPlayStatus.steps });
        if (controlIcon) controlIcon.className = 'fa-solid fa-play';
    } else {
        badge.className = 'bg-gray-400 dark:bg-gray-600 text-white';
        if (dot) dot.className = 'auto-play-dot';
        if (text) text.textContent = autoPlayT('autoPlayMoveBlocked');
        if (controlIcon) controlIcon.className = 'fa-solid fa-play';
    }
}
function updateAutoPlayUI() {
    const toggleButton = document.getElementById('auto-play-toggle-button');
    const stopButton = document.getElementById('auto-play-stop-button');
    const icon = toggleButton ? toggleButton.querySelector('i') : null;
    const label = toggleButton ? toggleButton.querySelector('span') : null;
    if (autoPlayStatus.running && !autoPlayStatus.paused) {
        if (icon) icon.className = 'fa-solid fa-pause';
        if (label) label.textContent = autoPlayT('autoPlayPause');
        if (stopButton) stopButton.classList.remove('hidden');
        updateAutoPlayStatusText(autoPlayT('autoPlayRunning', { steps: autoPlayStatus.steps }));
    } else if (autoPlayStatus.running && autoPlayStatus.paused) {
        if (icon) icon.className = 'fa-solid fa-play';
        if (label) label.textContent = autoPlayT('autoPlayResume');
        if (stopButton) stopButton.classList.remove('hidden');
        updateAutoPlayStatusText(autoPlayT('autoPlayPausedStatus', { steps: autoPlayStatus.steps }));
    } else {
        if (icon) icon.className = 'fa-solid fa-play';
        if (label) label.textContent = autoPlayT('autoPlayStart');
        if (stopButton) stopButton.classList.add('hidden');
        updateAutoPlayStatusText(autoPlayT('autoPlayStatusIdle'));
    }
    updateAutoPlayBoardBadge();
}
function clearAutoPlayTimer() {
    if (autoPlayStatus.timer) {
        clearTimeout(autoPlayStatus.timer);
        autoPlayStatus.timer = null;
    }
}
function scheduleAutoPlayStep(delay) {
    clearAutoPlayTimer();
    autoPlayStatus.timer = setTimeout(performAutoPlayStep, delay);
}
async function performAutoPlayStep() {
    if (!autoPlayStatus.running || autoPlayStatus.paused) return;
    if (!isAutoPlayGameActive()) {
        stopAutoPlay();
        updateAutoPlayStatusText(autoPlayT('autoPlayGameEnded'));
        return;
    }
    const mode = getAutoPlayAnalysisMode();
    const outcome = await getAutoPlayBestMove(mode);
    if (!autoPlayStatus.running || autoPlayStatus.paused) return;
    if (outcome.error) {
        stopAutoPlay();
        updateAutoPlayStatusText(outcome.error === 'ai-unavailable' ? autoPlayT('autoPlayAiUnavailable') : autoPlayT('autoPlayAiFailed'));
        return;
    }
    if (outcome.results && typeof updateAnalysisResults === 'function') {
        try {
            updateAnalysisResults(outcome.results);
        } catch (e) {}
    }
    let moved = false;
    if (outcome.move === 'undo') {
        if (typeof undoMove === 'function' && window.gameState && Array.isArray(window.gameState.history) && window.gameState.history.length > 0) {
            try {
                undoMove();
                moved = true;
            } catch (e) {
                moved = false;
            }
        }
    } else if (typeof move === 'function') {
        try {
            const result = move(outcome.move);
            moved = result !== false;
        } catch (e) {
            moved = false;
        }
    }
    if (moved) {
        autoPlayStatus.steps++;
        autoPlayStatus.failCount = 0;
        updateAutoPlayUI();
        scheduleAutoPlayStep(mode === 'ai' ? AUTO_PLAY_AI_INTERVAL : AUTO_PLAY_ALGORITHM_INTERVAL);
    } else {
        autoPlayStatus.failCount++;
        if (!isAutoPlayGameActive()) {
            stopAutoPlay();
            updateAutoPlayStatusText(autoPlayT('autoPlayGameEnded'));
        } else if (autoPlayStatus.failCount >= AUTO_PLAY_MAX_CONSECUTIVE_FAILURES) {
            stopAutoPlay('blocked');
            updateAutoPlayStatusText(autoPlayT('autoPlayMoveBlocked'));
        } else {
            updateAutoPlayUI();
            scheduleAutoPlayStep(300);
        }
    }
}
function startAutoPlay() {
    if (autoPlayStatus.running && !autoPlayStatus.paused) return;
    if (getAutoPlayAnalysisMode() === 'ai' && !isAutoPlayAiConfigComplete()) {
        updateAutoPlayStatusText(autoPlayT('autoPlayAiSettingsRequired'));
        return;
    }
    if (!autoPlayStatus.running) {
        autoPlayStatus.steps = 0;
        autoPlayStatus.failCount = 0;
        autoPlayStatus.stopReason = null;
    }
    autoPlayStatus.running = true;
    autoPlayStatus.paused = false;
    window.autoPlayActive = true;
    updateAutoPlayUI();
    requestAutoPlayWakeLock();
    scheduleAutoPlayStep(150);
}
function pauseAutoPlay() {
    if (!autoPlayStatus.running || autoPlayStatus.paused) return;
    autoPlayStatus.paused = true;
    clearAutoPlayTimer();
    releaseAutoPlayWakeLock();
    window.autoPlayActive = false;
    updateAutoPlayUI();
}
function resumeAutoPlay() {
    if (!autoPlayStatus.running || !autoPlayStatus.paused) return;
    autoPlayStatus.paused = false;
    window.autoPlayActive = true;
    updateAutoPlayUI();
    requestAutoPlayWakeLock();
    scheduleAutoPlayStep(200);
}
function stopAutoPlay(stopReason) {
    autoPlayStatus.running = false;
    autoPlayStatus.paused = false;
    clearAutoPlayTimer();
    releaseAutoPlayWakeLock();
    window.autoPlayActive = false;
    autoPlayStatus.failCount = 0;
    autoPlayStatus.stopReason = stopReason || null;
    updateAutoPlayUI();
}
function toggleAutoPlay() {
    if (autoPlayStatus.running && !autoPlayStatus.paused) {
        pauseAutoPlay();
    } else {
        startAutoPlay();
    }
}
function setupAiAutoPlay() {
    const toggleButton = document.getElementById('auto-play-toggle-button');
    const stopButton = document.getElementById('auto-play-stop-button');
    if (!toggleButton) return;
    toggleButton.addEventListener('click', toggleAutoPlay);
    if (stopButton) {
        stopButton.addEventListener('click', stopAutoPlay);
    }
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && autoPlayStatus.running && !autoPlayStatus.paused) {
            requestAutoPlayWakeLock();
        }
    });
    updateAutoPlayUI();
}
if (typeof window !== 'undefined') {
    window.aiAutoPlay = {
        version: aiAutoPlayVersion,
        start: startAutoPlay,
        pause: pauseAutoPlay,
        resume: resumeAutoPlay,
        stop: stopAutoPlay,
        toggle: toggleAutoPlay,
        setKeepScreenAwake: function(enabled) {
            if (enabled && autoPlayStatus.running && !autoPlayStatus.paused) {
                requestAutoPlayWakeLock();
            } else {
                releaseAutoPlayWakeLock();
            }
        },
        isActive: function() { return autoPlayStatus.running; }
    };
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAiAutoPlay);
} else {
    setupAiAutoPlay();
}