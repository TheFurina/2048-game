const fullscreenModeVersion = '0.1';
window.fullscreenModeVersion = fullscreenModeVersion;
let isFullscreenMode = false;
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
}
function exitFullscreenMode() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
function handleFullscreenChange() {
    isFullscreenMode = !!document.fullscreenElement;
    const undoButton = document.getElementById('undo-button');
    const pauseButton = document.getElementById('pause-button');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const statsContainer = document.querySelector('.stats-container');
    const aiAnalysisButton = document.getElementById('ai-analysis-button');
    if (fullscreenButton) {
        fullscreenButton.innerHTML = '<i class="fa-solid fa-expand dark:text-[#282828]"></i>';
    }
    if (isFullscreenMode) {
        const gameHeaderButtons = document.getElementById('game-header')?.querySelector('div.flex.gap-2');
        if (gameHeaderButtons) {
            gameHeaderButtons.classList.add('fullscreen-hidden');
        }
        if (statsContainer && undoButton && pauseButton && fullscreenButton) {
            const buttonGroup = document.createElement('div');
            buttonGroup.id = 'fullscreen-button-group';
            buttonGroup.className = 'flex gap-2 items-center';
            const undoClone = undoButton.cloneNode(true);
            undoClone.id = 'fullscreen-undo-button';
            undoClone.addEventListener('click', function() {
                document.getElementById('undo-button')?.click();
            });
            const pauseClone = pauseButton.cloneNode(true);
            pauseClone.id = 'fullscreen-pause-button';
            pauseClone.addEventListener('click', function() {
                document.getElementById('pause-button')?.click();
            });
            const fullscreenClone = fullscreenButton.cloneNode(true);
            fullscreenClone.id = 'fullscreen-toggle-button';
            fullscreenClone.addEventListener('click', function() {
                toggleFullscreenMode();
            });
            buttonGroup.appendChild(undoClone);
            buttonGroup.appendChild(pauseClone);
            buttonGroup.appendChild(fullscreenClone);
            statsContainer.parentNode.insertBefore(buttonGroup, statsContainer.nextSibling);
        }
        const controlsContainer = document.getElementById('controls-container');
        const toggleControls = document.getElementById('toggle-controls');
        const modeDescription = document.getElementById('mode-description');
        const difficultyDescription = document.getElementById('difficulty-description');
        const gameTouchArea = document.getElementById('game-touch-area');
        if (controlsContainer) controlsContainer.classList.add('fullscreen-hidden');
        if (toggleControls) toggleControls.classList.add('fullscreen-hidden');
        if (modeDescription) modeDescription.classList.add('fullscreen-hidden');
        if (difficultyDescription) difficultyDescription.classList.add('fullscreen-hidden');
        if (aiAnalysisButton) aiAnalysisButton.classList.add('fullscreen-hidden');
        if (gameTouchArea) gameTouchArea.classList.add('fullscreen-hidden');
        if (fullscreenButton) fullscreenButton.classList.add('fullscreen-hidden');
        const gameTitle = document.getElementById('game-title');
        const gameHeaderDesc = document.getElementById('game-header')?.querySelector('p');
        if (gameTitle) gameTitle.classList.add('fullscreen-hidden');
        if (gameHeaderDesc) gameHeaderDesc.classList.add('fullscreen-hidden');
        const statsDescContainer = document.querySelector('#mode-description')?.parentElement;
        if (statsDescContainer) statsDescContainer.classList.add('fullscreen-hidden');
    } else {
        const existingButtonGroup = document.getElementById('fullscreen-button-group');
        if (existingButtonGroup) {
            existingButtonGroup.remove();
        }
        const gameHeaderButtons = document.getElementById('game-header')?.querySelector('div.flex.gap-2');
        if (gameHeaderButtons) {
            gameHeaderButtons.classList.remove('fullscreen-hidden');
        }
        if (aiAnalysisButton) aiAnalysisButton.classList.remove('fullscreen-hidden');
        if (fullscreenButton) fullscreenButton.classList.remove('fullscreen-hidden');
        const gameTitle = document.getElementById('game-title');
        const gameHeaderDesc = document.getElementById('game-header')?.querySelector('p');
        if (gameTitle) gameTitle.classList.remove('fullscreen-hidden');
        if (gameHeaderDesc) gameHeaderDesc.classList.remove('fullscreen-hidden');
        const controlsContainer = document.getElementById('controls-container');
        const toggleControls = document.getElementById('toggle-controls');
        const modeDescription = document.getElementById('mode-description');
        const difficultyDescription = document.getElementById('difficulty-description');
        const gameTouchArea = document.getElementById('game-touch-area');
        if (controlsContainer) controlsContainer.classList.remove('fullscreen-hidden');
        if (toggleControls) toggleControls.classList.remove('fullscreen-hidden');
        if (modeDescription) modeDescription.classList.remove('fullscreen-hidden');
        if (difficultyDescription) difficultyDescription.classList.remove('fullscreen-hidden');
        if (gameTouchArea) gameTouchArea.classList.remove('fullscreen-hidden');
        const statsDescContainer = document.querySelector('#mode-description')?.parentElement;
        if (statsDescContainer) statsDescContainer.classList.remove('fullscreen-hidden');
    }
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
    const fullscreenButton = document.createElement('button');
    fullscreenButton.id = 'fullscreen-button';
    fullscreenButton.className = 'bg-primary dark:bg-dark-primary hover:bg-primary/90 text-white w-12 h-12 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center';
    fullscreenButton.innerHTML = '<i class="fa-solid fa-expand dark:text-[#282828]"></i>';
    fullscreenButton.addEventListener('click', toggleFullscreenMode);
    buttonContainer.insertBefore(fullscreenButton, aiAnalysisButton);
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