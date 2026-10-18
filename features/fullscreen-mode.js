const fullscreenModeVersion = '0.6';
window.fullscreenModeVersion = fullscreenModeVersion;
let isFullscreenMode = false;
const FULLSCREEN_HIDDEN_ELEMENTS = [
    { selector: '#game-header div.flex.gap-2' },
    { selector: '#controls-container' },
    { selector: '#toggle-controls' },
    { selector: '#mode-description' },
    { selector: '#difficulty-description' },
    { selector: '#game-touch-area' },
    { selector: '#ai-analysis-button' },
    { selector: '#fullscreen-button' },
    { selector: '#game-title' },
    { selector: '#game-header p' },
    { selector: '#mode-description', query: 'parentElement' }
];
function getFullscreenElement() {
    return document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullScreenElement
        || document.msFullscreenElement
        || null;
}
let orientationLockRetryTimer = null;
let orientationLockSucceeded = false;
const ORIENTATION_LOCK_MAX_RETRIES = 15;
const ORIENTATION_LOCK_RETRY_INTERVAL = 200;
function stopOrientationLockRetries() {
    if (orientationLockRetryTimer) {
        clearTimeout(orientationLockRetryTimer);
        orientationLockRetryTimer = null;
    }
}
function tryLockPortraitOrientation(retries) {
    if (!getFullscreenElement()) return;
    if (!(screen.orientation && typeof screen.orientation.lock === 'function')) {
        updateRotateHint();
        return;
    }
    screen.orientation.lock('portrait').then(() => {
        orientationLockSucceeded = true;
        stopOrientationLockRetries();
        updateRotateHint();
    }).catch(() => {
        if (retries > 0 && getFullscreenElement()) {
            stopOrientationLockRetries();
            orientationLockRetryTimer = setTimeout(() => tryLockPortraitOrientation(retries - 1), ORIENTATION_LOCK_RETRY_INTERVAL);
        } else {
            updateRotateHint();
        }
    });
}
function unlockOrientation() {
    stopOrientationLockRetries();
    orientationLockSucceeded = false;
    removeRotateHint();
    try {
        if (screen.orientation && typeof screen.orientation.unlock === 'function') {
            screen.orientation.unlock();
        }
    } catch (e) {
    }
}
function toggleFullscreenMode() {
    if (!getFullscreenElement()) {
        enterFullscreenMode();
    } else {
        exitFullscreenMode();
    }
}
function enterFullscreenMode() {
    const elem = document.documentElement;
    let request = null;
    if (elem.requestFullscreen) {
        request = elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        request = elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        request = elem.msRequestFullscreen();
    }
    if (request && typeof request.catch === 'function') {
        request.catch(() => {});
    }
    tryLockPortraitOrientation(ORIENTATION_LOCK_MAX_RETRIES);
}
function exitFullscreenMode() {
    unlockOrientation();
    let request = null;
    if (document.exitFullscreen) {
        request = document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        request = document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        request = document.msExitFullscreen();
    }
    if (request && typeof request.catch === 'function') {
        request.catch(() => {});
    }
}
function showRotateHint() {
    if (document.getElementById('rotate-hint-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'rotate-hint-overlay';
    overlay.innerHTML = [
        '<div class="rotate-hint-content">',
        '    <i class="fa-solid fa-mobile-screen-button rotate-hint-icon"></i>',
        '    <p class="rotate-hint-text">请旋转至竖屏以获得最佳体验</p>',
        '    <p class="rotate-hint-text-en">Please rotate to portrait for the best experience</p>',
        '</div>'
    ].join('');
    document.body.appendChild(overlay);
}
function removeRotateHint() {
    const overlay = document.getElementById('rotate-hint-overlay');
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}
function isTouchPrimaryDevice() {
    if (window.matchMedia && typeof window.matchMedia === 'function') {
        const coarseQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
        if (coarseQuery && typeof coarseQuery.matches === 'boolean') {
            return coarseQuery.matches;
        }
    }
    return 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
}
function updateRotateHint() {
    if (!isFullscreenMode || orientationLockSucceeded || !isTouchPrimaryDevice()) {
        removeRotateHint();
        return;
    }
    if (window.innerWidth > window.innerHeight) {
        showRotateHint();
    } else {
        removeRotateHint();
    }
}
function handleViewportOrientationChange() {
    updateRotateHint();
}
function getElement(config) {
    if (config.query === 'parentElement') {
        return document.querySelector(config.selector)?.parentElement;
    }
    return document.querySelector(config.selector);
}
function toggleElementsVisibility(hide) {
    FULLSCREEN_HIDDEN_ELEMENTS.forEach(config => {
        const element = getElement(config);
        if (element) {
            if (hide) {
                element.classList.add('fullscreen-hidden');
            } else {
                element.classList.remove('fullscreen-hidden');
            }
        }
    });
}
function createFullscreenButtonGroup(undoButton, pauseButton, fullscreenButton, aiAnalysisButton) {
    const buttonGroup = document.createElement('div');
    buttonGroup.id = 'fullscreen-button-group';
    buttonGroup.className = 'flex gap-2 items-center';
    const undoClone = undoButton.cloneNode(true);
    undoClone.id = 'fullscreen-undo-button';
    undoClone.addEventListener('click', () => document.getElementById('undo-button')?.click());
    const pauseClone = pauseButton.cloneNode(true);
    pauseClone.id = 'fullscreen-pause-button';
    pauseClone.addEventListener('click', () => document.getElementById('pause-button')?.click());
    const fullscreenClone = fullscreenButton.cloneNode(true);
    fullscreenClone.id = 'fullscreen-toggle-button';
    fullscreenClone.addEventListener('click', toggleFullscreenMode);
    const aiAnalysisClone = aiAnalysisButton.cloneNode(true);
    aiAnalysisClone.id = 'fullscreen-ai-analysis-button';
    aiAnalysisClone.addEventListener('click', () => document.getElementById('ai-analysis-button')?.click());
    buttonGroup.appendChild(undoClone);
    buttonGroup.appendChild(pauseClone);
    buttonGroup.appendChild(fullscreenClone);
    buttonGroup.appendChild(aiAnalysisClone);
    return buttonGroup;
}
function handleFullscreenButtonGroup(show) {
    const existingButtonGroup = document.getElementById('fullscreen-button-group');
    if (show) {
        if (existingButtonGroup) return;
        const undoButton = document.getElementById('undo-button');
        const pauseButton = document.getElementById('pause-button');
        const fullscreenButton = document.getElementById('fullscreen-button');
        const aiAnalysisButton = document.getElementById('ai-analysis-button');
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer && undoButton && pauseButton && fullscreenButton && aiAnalysisButton) {
            const buttonGroup = createFullscreenButtonGroup(undoButton, pauseButton, fullscreenButton, aiAnalysisButton);
            statsContainer.parentNode.insertBefore(buttonGroup, statsContainer.nextSibling);
        }
    } else {
        if (existingButtonGroup) {
            existingButtonGroup.remove();
        }
    }
}
function updateFullscreenButtonIcon() {
    const iconHtml = '<i class="fa-solid ' + (isFullscreenMode ? 'fa-compress' : 'fa-expand') + ' dark:text-[#282828]"></i>';
    const fullscreenButton = document.getElementById('fullscreen-button');
    if (fullscreenButton) {
        fullscreenButton.innerHTML = iconHtml;
    }
    const fullscreenClone = document.getElementById('fullscreen-toggle-button');
    if (fullscreenClone) {
        fullscreenClone.innerHTML = iconHtml;
    }
}
function handleFullscreenChange() {
    isFullscreenMode = !!getFullscreenElement();
    updateFullscreenButtonIcon();
    handleFullscreenButtonGroup(isFullscreenMode);
    toggleElementsVisibility(isFullscreenMode);
    if (isFullscreenMode) {
        if (!orientationLockSucceeded) {
            tryLockPortraitOrientation(ORIENTATION_LOCK_MAX_RETRIES);
        }
        updateRotateHint();
    } else {
        unlockOrientation();
    }
}
function setupFullscreenMode() {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    if (window.matchMedia) {
        const portraitQuery = window.matchMedia('(orientation: portrait)');
        if (portraitQuery.addEventListener) {
            portraitQuery.addEventListener('change', handleViewportOrientationChange);
        } else if (portraitQuery.addListener) {
            portraitQuery.addListener(handleViewportOrientationChange);
        }
    }
    window.addEventListener('orientationchange', handleViewportOrientationChange);
    window.addEventListener('resize', handleViewportOrientationChange);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F11') {
            e.preventDefault();
            if (!getFullscreenElement()) {
                enterFullscreenMode();
            } else {
                exitFullscreenMode();
            }
        }
    });
    const aiAnalysisButton = document.getElementById('ai-analysis-button');
    if (!aiAnalysisButton) return;
    const buttonContainer = aiAnalysisButton.parentElement;
    if (!buttonContainer) return;
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'flex gap-2 justify-end';
    const fullscreenButton = document.createElement('button');
    fullscreenButton.id = 'fullscreen-button';
    fullscreenButton.className = 'bg-primary dark:bg-dark-primary hover:bg-primary/90 text-white w-12 h-12 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center';
    fullscreenButton.innerHTML = '<i class="fa-solid fa-expand dark:text-[#282828]"></i>';
    fullscreenButton.addEventListener('click', toggleFullscreenMode);
    buttonGroup.appendChild(fullscreenButton);
    buttonGroup.appendChild(aiAnalysisButton);
    buttonContainer.appendChild(buttonGroup);
    addFullscreenStyles();
}
function addFullscreenStyles() {
    let styleElement = document.getElementById('fullscreen-mode-styles');
    if (styleElement) return;
    styleElement = document.createElement('style');
    styleElement.id = 'fullscreen-mode-styles';
    styleElement.textContent = `
        .fullscreen-hidden {
            display: none !important;
        }
        :fullscreen .fullscreen-hidden,
        :-webkit-full-screen .fullscreen-hidden,
        :-ms-fullscreen .fullscreen-hidden {
            display: none !important;
        }
        #fullscreen-button-group {
            margin-left: auto;
        }
        :fullscreen .stats-container,
        :-webkit-full-screen .stats-container,
        :-ms-fullscreen .stats-container {
            margin-bottom: 0.5rem !important;
        }
        :fullscreen body,
        :-webkit-full-screen body,
        :-ms-fullscreen body {
            overflow: hidden;
        }
        :fullscreen .stats-container + .flex,
        :-webkit-full-screen .stats-container + .flex,
        :-ms-fullscreen .stats-container + .flex {
            margin-left: auto;
        }
        @media (orientation: portrait) {
            :fullscreen .game-container,
            :-webkit-full-screen .game-container,
            :-ms-fullscreen .game-container {
                padding: 0.5rem !important;
            }
            :fullscreen .grid-container,
            :-webkit-full-screen .grid-container,
            :-ms-fullscreen .grid-container {
                max-width: 100% !important;
            }
            :fullscreen .stats-container,
            :-webkit-full-screen .stats-container,
            :-ms-fullscreen .stats-container {
                flex-direction: column !important;
                gap: 0.25rem !important;
            }
            :fullscreen #fullscreen-button-group,
            :-webkit-full-screen #fullscreen-button-group,
            :-ms-fullscreen #fullscreen-button-group {
                position: fixed;
                bottom: 1rem;
                right: 1rem;
                z-index: 1000;
            }
        }
        #rotate-hint-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.78);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #rotate-hint-overlay .rotate-hint-content {
            text-align: center;
            color: #ffffff;
            padding: 2rem;
        }
        #rotate-hint-overlay .rotate-hint-icon {
            font-size: 3.5rem;
            color: #faa31b;
            display: inline-block;
            animation: rotate-hint-swing 1.8s ease-in-out infinite;
        }
        #rotate-hint-overlay .rotate-hint-text {
            margin-top: 1.25rem;
            font-size: 1.05rem;
            font-weight: 600;
        }
        #rotate-hint-overlay .rotate-hint-text-en {
            margin-top: 0.35rem;
            font-size: 0.8rem;
            opacity: 0.7;
        }
        @keyframes rotate-hint-swing {
            0%, 100% { transform: rotate(-90deg); }
            50% { transform: rotate(0deg); }
        }
    `;
    document.head.appendChild(styleElement);
}
window.setupFullscreenMode = setupFullscreenMode;
window.toggleFullscreenMode = toggleFullscreenMode;
window.isFullscreenMode = function() { return !!getFullscreenElement(); };
function initFullscreenMode() {
    try {
        setupFullscreenMode();
        window.fullscreenModeModuleLoaded = true;
    } catch (error) {
        console.warn('Fullscreen mode module loading failed:', error);
        window.fullscreenModeModuleLoaded = false;
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFullscreenMode);
} else {
    initFullscreenMode();
}