const fullscreenModeVersion = '0.3';
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
function toggleFullscreenMode() {
    if (!document.fullscreenElement) {
        enterFullscreenMode();
    } else {
        exitFullscreenMode();
    }
}
function enterFullscreenMode() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch(() => {
        });
    }
}
function exitFullscreenMode() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
    }
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
    const fullscreenButton = document.getElementById('fullscreen-button');
    if (fullscreenButton) {
        fullscreenButton.innerHTML = '<i class="fa-solid fa-expand dark:text-[#282828]"></i>';
    }
}
function handleFullscreenChange() {
    isFullscreenMode = !!document.fullscreenElement;
    updateFullscreenButtonIcon();
    handleFullscreenButtonGroup(isFullscreenMode);
    toggleElementsVisibility(isFullscreenMode);
}
function setupFullscreenMode() {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F11') {
            e.preventDefault();
            if (!document.fullscreenElement) {
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
    `;
    document.head.appendChild(styleElement);
}
window.setupFullscreenMode = setupFullscreenMode;
window.toggleFullscreenMode = toggleFullscreenMode;
window.isFullscreenMode = function() { return !!document.fullscreenElement; };
document.addEventListener('DOMContentLoaded', function() {
    try {
        setupFullscreenMode();
        window.fullscreenModeModuleLoaded = true;
    } catch (error) {
        console.warn('Fullscreen mode module loading failed:', error);
        window.fullscreenModeModuleLoaded = false;
    }
});