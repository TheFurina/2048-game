const aiAnalysisVersion = '2.3';
window.aiAnalysisVersion = aiAnalysisVersion;
let cachedAlgorithmResults = null;
let cachedAiResults = null;
let cachedGameStateSignature = null;
function getGameStateSignature(state) {
    if (!state) return '';
    return JSON.stringify({
        grid: state.grid,
        score: state.score,
        gridSize: state.gridSize,
        difficulty: state.difficulty
    });
}
function isGameStateChanged(state) {
    const signature = getGameStateSignature(state);
    return signature !== cachedGameStateSignature;
}
function updateGameStateCache(state, algorithmResults, aiResults) {
    cachedGameStateSignature = getGameStateSignature(state);
    if (algorithmResults !== undefined) cachedAlgorithmResults = algorithmResults;
    if (aiResults !== undefined) cachedAiResults = aiResults;
}
function loadAnalysisMode() {
    try {
        const saved = localStorage.getItem('2048-analysis-mode');
        return saved && (saved === 'ai' || saved === 'algorithm') ? saved : 'algorithm';
    } catch (e) {
        return 'algorithm';
    }
}
function saveAnalysisMode(mode) {
    try {
        localStorage.setItem('2048-analysis-mode', mode);
    } catch (e) {
        console.error('Failed to save analysis mode:', e);
    }
}
let currentAnalysisMode = loadAnalysisMode();
function setupAiAnalysis() {
    const aiAnalysisButton = document.getElementById('ai-analysis-button');
    if (!aiAnalysisButton) return;
    aiAnalysisButton.addEventListener('click', analyzeGameState);
    const algorithmBtn = document.getElementById('analysis-mode-algorithm');
    const aiBtn = document.getElementById('analysis-mode-ai');
    const analysisSlider = document.getElementById('analysis-slider');
    const sliderContainer = document.getElementById('analysis-switch-container');
    if (algorithmBtn && aiBtn && analysisSlider && sliderContainer) {
        let hasMoved = false;
        let startX, startLeft;
        const regenerateBtn = document.getElementById('ai-regenerate-button');
        const setRegenerateButtonLoading = (loading) => {
            if (!regenerateBtn) return;
            const icon = regenerateBtn.querySelector('i');
            const label = regenerateBtn.querySelector('span');
            if (loading) {
                regenerateBtn.disabled = true;
                regenerateBtn.classList.add('opacity-70', 'cursor-not-allowed');
                if (icon) icon.classList.add('fa-spin');
                if (label) label.textContent = i18n.t('regenerating');
            } else {
                regenerateBtn.disabled = false;
                regenerateBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                if (icon) icon.classList.remove('fa-spin');
                if (label) label.textContent = i18n.t('regenerate');
            }
        };
        const toggleRegenerateButton = (show) => {
            if (!regenerateBtn) return;
            if (show) {
                regenerateBtn.classList.remove('hidden');
            } else {
                regenerateBtn.classList.add('hidden');
            }
        };
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', async () => {
                if (currentAnalysisMode !== 'ai') return;
                showAnalysisLoading();
                setRegenerateButtonLoading(true);
                cachedAiResults = null;
                try {
                    const language = i18n.getLang();
                    const result = await window.aiRequest?.sendGameAnalysis(gameState, language);
                    if (result && result.success) {
                        cachedAiResults = result.data;
                        updateGameStateCache(gameState, undefined, result.data);
                        updateAnalysisResults(result.data);
                    } else {
                        let errorMsg = result?.error ? i18n.t(result.error) : i18n.t('aiApiRequestFailed');
                        if (result?.message) {
                            errorMsg += ': ' + result.message;
                        }
                        cachedAiResults = {
                            bestMove: '--',
                            mergeOpportunities: 0,
                            gameStateAssessment: 'safe',
                            scorePotential: 'medium',
                            aiSuggestion: errorMsg
                        };
                        updateGameStateCache(gameState, undefined, cachedAiResults);
                        updateAnalysisResults(cachedAiResults);
                    }
                } finally {
                    setRegenerateButtonLoading(false);
                }
            });
        }
        analysisSlider.classList.remove('left-0.5', 'transition-all', 'duration-300', 'ease-out');
        analysisSlider.style.transition = 'none';
        if (currentAnalysisMode === 'ai') {
            aiBtn.className = 'px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
            algorithmBtn.className = 'px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
            analysisSlider.style.left = 'calc(50% - 1px)';
            toggleRegenerateButton(true);
        } else {
            algorithmBtn.className = 'px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
            aiBtn.className = 'px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
            analysisSlider.style.left = '2px';
            toggleRegenerateButton(false);
        }
        toggleAiSuggestionVisibility(currentAnalysisMode === 'ai', true);
        analysisSlider.offsetHeight;
        analysisSlider.style.transition = 'left 0.3s ease-out';
        const updateMode = (mode, isInitializing = false) => {
            currentAnalysisMode = mode;
            saveAnalysisMode(mode);
            if (mode === 'algorithm') {
                algorithmBtn.className = 'px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
                aiBtn.className = 'px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
                toggleRegenerateButton(false);
            } else {
                aiBtn.className = 'px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
                algorithmBtn.className = 'px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
                toggleRegenerateButton(true);
            }
            toggleAiSuggestionVisibility(mode === 'ai', isInitializing);
            if (!isInitializing) {
                const gameChanged = isGameStateChanged(gameState);
                if (gameChanged) {
                    cachedAlgorithmResults = null;
                    cachedAiResults = null;
                }
                (async () => {
                    if (mode === 'algorithm') {
                        if (cachedAlgorithmResults && !gameChanged) {
                            updateAnalysisResults(cachedAlgorithmResults);
                        } else {
                            showAnalysisLoading();
                            toggleAiSuggestionVisibility(false, true);
                            const results = analyzeGameStateWithAlgorithm();
                            cachedAlgorithmResults = results;
                            updateGameStateCache(gameState, results, undefined);
                            updateAnalysisResults(results);
                        }
                    } else {
                        if (cachedAiResults && !gameChanged) {
                            updateAnalysisResults(cachedAiResults);
                        } else {
                            showAnalysisLoading();
                            toggleAiSuggestionVisibility(true, true);
                            const language = i18n.getLang();
                            const result = await window.aiRequest?.sendGameAnalysis(gameState, language);
                            if (result && result.success) {
                                cachedAiResults = result.data;
                                updateGameStateCache(gameState, undefined, result.data);
                                updateAnalysisResults(result.data);
                            } else {
                                let errorMsg = result?.error ? i18n.t(result.error) : i18n.t('aiApiRequestFailed');
                                if (result?.message) {
                                    errorMsg += ': ' + result.message;
                                }
                                cachedAiResults = {
                                    bestMove: '--',
                                    mergeOpportunities: 0,
                                    gameStateAssessment: 'safe',
                                    scorePotential: 'medium',
                                    aiSuggestion: errorMsg
                                };
                                updateGameStateCache(gameState, undefined, cachedAiResults);
                                updateAnalysisResults(cachedAiResults);
                            }
                        }
                    }
                })();
            }
        };
        const getSliderWidth = () => {
            return analysisSlider.offsetWidth || (sliderContainer.offsetWidth / 2 - 2);
        };
        window.initAnalysisModeState = () => {
            const containerWidth = sliderContainer.offsetWidth;
            const sliderWidth = getSliderWidth();
            analysisSlider.style.transition = 'none';
            if (currentAnalysisMode === 'ai') {
                analysisSlider.style.left = Math.max(2, containerWidth - sliderWidth - 2) + 'px';
            } else {
                analysisSlider.style.left = '2px';
            }
            analysisSlider.offsetHeight;
            analysisSlider.style.transition = 'left 0.3s ease-out';
        };
        const setSliderPosition = (left) => {
            const containerWidth = sliderContainer.offsetWidth;
            const sliderWidth = getSliderWidth();
            const minLeft = 2;
            const maxLeft = containerWidth - sliderWidth - 2;
            const clampedLeft = Math.max(minLeft, Math.min(left, maxLeft));
            analysisSlider.style.left = clampedLeft + 'px';
            const sliderCenter = clampedLeft + sliderWidth / 2;
            const containerCenter = containerWidth / 2;
            if (sliderCenter < containerCenter) {
                if (currentAnalysisMode !== 'algorithm') updateMode('algorithm');
            } else {
                if (currentAnalysisMode !== 'ai') updateMode('ai');
            }
        };
        sliderContainer.addEventListener('mousedown', (e) => {
            window.isSliderDragging = true;
            hasMoved = false;
            startX = e.clientX;
            const rect = analysisSlider.getBoundingClientRect();
            const containerRect = sliderContainer.getBoundingClientRect();
            startLeft = rect.left - containerRect.left;
            analysisSlider.style.transition = 'none';
            e.stopPropagation();
            if (e.target.tagName !== 'BUTTON') {
                e.preventDefault();
            }
        });
        sliderContainer.addEventListener('click', (e) => {
            if (hasMoved) {
                e.stopPropagation();
                e.preventDefault();
            }
            hasMoved = false;
        }, true);
        document.addEventListener('mousemove', (e) => {
            if (!window.isSliderDragging) return;
            const deltaX = e.clientX - startX;
            if (Math.abs(deltaX) > 2) hasMoved = true;
            setSliderPosition(startLeft + deltaX);
        });
        document.addEventListener('mouseup', () => {
            if (window.isSliderDragging) {
                window.isSliderDragging = false;
                analysisSlider.style.transition = 'left 0.3s ease-out';
                const containerWidth = sliderContainer.offsetWidth;
                const sliderWidth = getSliderWidth();
                const sliderCenter = parseInt(analysisSlider.style.left) + sliderWidth / 2;
                const containerCenter = containerWidth / 2;
                if (sliderCenter < containerCenter) {
                    analysisSlider.style.left = '2px';
                    updateMode('algorithm');
                } else {
                    analysisSlider.style.left = (containerWidth - sliderWidth - 2) + 'px';
                    updateMode('ai');
                }
                hasMoved = false;
            }
        });
        sliderContainer.addEventListener('touchstart', (e) => {
            window.isSliderDragging = true;
            hasMoved = false;
            startX = e.touches[0].clientX;
            const rect = analysisSlider.getBoundingClientRect();
            const containerRect = sliderContainer.getBoundingClientRect();
            startLeft = rect.left - containerRect.left;
            analysisSlider.style.transition = 'none';
            e.stopPropagation();
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (!window.isSliderDragging) return;
            const deltaX = e.touches[0].clientX - startX;
            if (Math.abs(deltaX) > 2) hasMoved = true;
            setSliderPosition(startLeft + deltaX);
        }, { passive: false });
        document.addEventListener('touchend', () => {
            if (window.isSliderDragging) {
                window.isSliderDragging = false;
                analysisSlider.style.transition = 'left 0.3s ease-out';
                const containerWidth = sliderContainer.offsetWidth;
                const sliderWidth = getSliderWidth();
                const sliderCenter = parseInt(analysisSlider.style.left) + sliderWidth / 2;
                const containerCenter = containerWidth / 2;
                if (sliderCenter < containerCenter) {
                    analysisSlider.style.left = '2px';
                    updateMode('algorithm');
                } else {
                    analysisSlider.style.left = (containerWidth - sliderWidth - 2) + 'px';
                    updateMode('ai');
                }
                hasMoved = false;
            }
        });
        algorithmBtn.addEventListener('click', () => {
            analysisSlider.style.transition = 'left 0.3s ease-out';
            analysisSlider.style.left = '2px';
            updateMode('algorithm');
        });
        aiBtn.addEventListener('click', () => {
            analysisSlider.style.transition = 'left 0.3s ease-out';
            const containerWidth = sliderContainer.offsetWidth;
            const sliderWidth = getSliderWidth();
            analysisSlider.style.left = (containerWidth - sliderWidth - 2) + 'px';
            updateMode('ai');
        });
    }
    const closeAiModalButton = document.getElementById('close-ai-modal');
    if (closeAiModalButton) {
        closeAiModalButton.addEventListener('click', function() {
            const content = document.querySelector('.ai-analysis-content');
            if (content) {
                content.style.left = '';
                content.style.top = '';
                content.style.transform = '';
                content.style.transition = '';
            }
            document.getElementById('ai-analysis-modal').classList.add('ai-modal-closed');
        });
    }
    const aiAnalysisModal = document.getElementById('ai-analysis-modal');
    if (aiAnalysisModal) {
        aiAnalysisModal.addEventListener('click', function(e) {
            if (e.target === aiAnalysisModal) {
                const content = document.querySelector('.ai-analysis-content');
                if (content) {
                    content.style.left = '';
                    content.style.top = '';
                    content.style.transform = '';
                    content.style.transition = '';
                }
                aiAnalysisModal.classList.add('ai-modal-closed');
            }
        });
    }
    const aiAnalysisContent = document.querySelector('.ai-analysis-content');
    const aiAnalysisTitle = document.getElementById('ai-analysis-modal-title');
    if (aiAnalysisTitle && aiAnalysisContent) {
        aiAnalysisTitle.style.cursor = 'move';
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        aiAnalysisTitle.addEventListener('mousedown', function(e) {
            if (e.target.closest('button') || e.target.closest('#analysis-switch-container') || window.isSliderDragging) return;
            isDragging = true;
            const rect = aiAnalysisContent.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;
            aiAnalysisContent.style.transition = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;
            const containerRect = aiAnalysisModal.getBoundingClientRect();
            const maxLeft = containerRect.width - aiAnalysisContent.offsetWidth;
            const maxTop = containerRect.height - aiAnalysisContent.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            aiAnalysisContent.style.left = newLeft + 'px';
            aiAnalysisContent.style.top = newTop + 'px';
            aiAnalysisContent.style.transform = 'none';
        });
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                aiAnalysisContent.style.transition = 'none';
            }
        });
    }
    const toggleBestMoveButton = document.getElementById('toggle-best-move');
    if (toggleBestMoveButton) {
        const bestMoveText = document.querySelector('#best-move-direction .best-move-text');
        const icon = toggleBestMoveButton.querySelector('i');
        if (bestMoveText && icon) {
            const isBestMoveHidden = localStorage.getItem('bestMoveHidden') === 'true';
            if (isBestMoveHidden) {
                bestMoveText.classList.add('blur-sm');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                toggleBestMoveButton.title = i18n.t('showBestMove');
            } else {
                bestMoveText.classList.remove('blur-sm');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                toggleBestMoveButton.title = i18n.t('hideBestMove');
            }
            toggleBestMoveButton.addEventListener('click', function() {
                if (bestMoveText.classList.contains('blur-sm')) {
                    bestMoveText.classList.remove('blur-sm');
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    this.title = i18n.t('hideBestMove');
                    localStorage.setItem('bestMoveHidden', 'false');
                } else {
                    bestMoveText.classList.add('blur-sm');
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                    this.title = i18n.t('showBestMove');
                    localStorage.setItem('bestMoveHidden', 'true');
                }
            });
        }
    }
}
let aiSuggestionHideTimer = null;
function toggleAiSuggestionVisibility(show, isInitializing = false) {
    const aiSuggestionItem = document.querySelector('.analysis-item:last-child');
    if (!aiSuggestionItem) return;
    if (aiSuggestionHideTimer) {
        clearTimeout(aiSuggestionHideTimer);
        aiSuggestionHideTimer = null;
    }
    aiSuggestionItem.style.overflow = 'hidden';
    if (isInitializing) {
        aiSuggestionItem.style.transition = 'none';
        if (show) {
            aiSuggestionItem.style.display = 'block';
            aiSuggestionItem.style.opacity = '1';
            aiSuggestionItem.style.transform = 'translateY(0)';
            aiSuggestionItem.style.maxHeight = '200px';
            aiSuggestionItem.style.marginBottom = '15px';
        } else {
            aiSuggestionItem.style.display = 'none';
            aiSuggestionItem.style.opacity = '0';
            aiSuggestionItem.style.transform = 'translateY(-10px)';
            aiSuggestionItem.style.maxHeight = '0';
            aiSuggestionItem.style.marginBottom = '0';
        }
        aiSuggestionItem.offsetHeight;
        aiSuggestionItem.style.transition = 'all 0.3s ease-out';
    } else {
        aiSuggestionItem.style.transition = 'all 0.3s ease-out';
        if (show) {
            if (aiSuggestionItem.style.display === 'none' || aiSuggestionItem.style.opacity === '0') {
                aiSuggestionItem.style.opacity = '0';
                aiSuggestionItem.style.transform = 'translateY(-10px)';
                aiSuggestionItem.style.maxHeight = '0';
                aiSuggestionItem.style.marginBottom = '0';
                aiSuggestionItem.style.display = 'block';
                requestAnimationFrame(() => {
                    aiSuggestionItem.style.opacity = '1';
                    aiSuggestionItem.style.transform = 'translateY(0)';
                    aiSuggestionItem.style.maxHeight = '200px';
                    aiSuggestionItem.style.marginBottom = '15px';
                });
            }
        } else {
            aiSuggestionItem.style.opacity = '0';
            aiSuggestionItem.style.transform = 'translateY(-10px)';
            aiSuggestionItem.style.maxHeight = '0';
            aiSuggestionItem.style.marginBottom = '0';
            aiSuggestionHideTimer = setTimeout(() => {
                aiSuggestionItem.style.display = 'none';
                aiSuggestionHideTimer = null;
            }, 300);
        }
    }
}
function showAnalysisLoading() {
    const directionNames = {
        up: i18n.t('up'), 
        down: i18n.t('down'), 
        left: i18n.t('left'), 
        right: i18n.t('right')
    };
    document.getElementById('best-move-direction').innerHTML = `<span class="best-move-text">${i18n.t('loading')}</span>`;
    document.getElementById('merge-opportunities').textContent = i18n.t('loading');
    document.getElementById('game-state-assessment').textContent = i18n.t('loading');
    document.getElementById('score-potential').textContent = i18n.t('loading');
    const aiSuggestionElement = document.getElementById('ai-suggestion');
    if (aiSuggestionElement) {
        aiSuggestionElement.textContent = i18n.t('loading');
    }
}
function updateAnalysisResults(results) {
    const directionNames = {
        up: i18n.t('up'), 
        down: i18n.t('down'), 
        left: i18n.t('left'), 
        right: i18n.t('right')
    };
    document.getElementById('best-move-direction').innerHTML = `<span class="best-move-text">${directionNames[results.bestMove] || results.bestMove}</span>`;
    const mergeOpportunitiesElement = document.getElementById('merge-opportunities');
    mergeOpportunitiesElement.className = 'analysis-value';
    mergeOpportunitiesElement.textContent = results.mergeOpportunities > 0 ? results.mergeOpportunities + i18n.t('mergeOpportunitiesSuffix') : i18n.t('noMergeOpportunities');
    const mergeCount = typeof results.mergeOpportunities === 'number' ? results.mergeOpportunities : 0;
    if (results.mergeOpportunitiesLevel === 'high' || mergeCount >= 3) mergeOpportunitiesElement.classList.add('high');
    else if (results.mergeOpportunitiesLevel === 'medium' || mergeCount >= 1) mergeOpportunitiesElement.classList.add('medium');
    else mergeOpportunitiesElement.classList.add('low');
    const gameStateElement = document.getElementById('game-state-assessment');
    gameStateElement.className = 'analysis-value';
    gameStateElement.textContent = i18n.t(results.gameStateAssessment) || results.gameStateAssessment;
    const assessment = results.gameStateAssessment || 'safe';
    if (assessment === 'danger' || assessment === 'danger') gameStateElement.classList.add('danger');
    else if (assessment === 'warning' || assessment === 'average') gameStateElement.classList.add('average');
    else gameStateElement.classList.add('good');
    const scorePotentialElement = document.getElementById('score-potential');
    scorePotentialElement.className = 'analysis-value';
    const scorePotential = results.scorePotential || 'medium';
    const scorePotentialDescriptions = {
        high: i18n.t('scorePotentialHigh'),
        medium: i18n.t('scorePotentialMedium'),
        low: i18n.t('limitedMergeOpportunities')
    };
    scorePotentialElement.textContent = `${i18n.t(scorePotential === 'medium' ? 'mediumScore' : scorePotential) || scorePotential} (${scorePotentialDescriptions[scorePotential] || ''})`;
    if (scorePotential === 'high') scorePotentialElement.classList.add('high');
    else if (scorePotential === 'medium') scorePotentialElement.classList.add('medium');
    else scorePotentialElement.classList.add('low');
    const aiSuggestionElement = document.getElementById('ai-suggestion');
    if (aiSuggestionElement) {
        aiSuggestionElement.textContent = results.aiSuggestion || i18n.t('notAvailable');
    }
}
function analyzeGameStateWithAlgorithm() {
    const directions = ['up', 'down', 'left', 'right'];
    let bestScore = -1;
    let bestDirection = 'up';
    let mergeOpportunities = 0;
    const gridCopy = JSON.parse(JSON.stringify(gameState.grid));
    const originalScore = gameState.score;
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    const gridSize = Math.max(gridRows, gridCols);
    let scoreDiffWeight, emptyCellsWeight, mergesWeight, positionWeight, maxValueWeight, continuityWeight, uniformityWeight, blockWeight, multiStepWeight, monotonicityWeight;
    let dangerThreshold, warningThreshold;
    let highPotentialThreshold, mediumPotentialThreshold;
    let directionPriority = {up: 1, down: 1, left: 1, right: 1};
    scoreDiffWeight = Math.min(0.3, 0.2 + (gridSize - 3) * 0.05);
    emptyCellsWeight = Math.max(0.1, 0.18 - (gridSize - 3) * 0.03);
    mergesWeight = Math.max(0.1, 0.15 - (gridSize - 3) * 0.015);
    positionWeight = 0.1;
    maxValueWeight = 0.1;
    continuityWeight = 0.05;
    uniformityWeight = 0.05;
    blockWeight = 0.05;
    multiStepWeight = 0.1;
    monotonicityWeight = Math.max(0, 0.02 - (gridSize - 3) * 0.005);
    directionPriority = {up: 1.1, down: 0.9, left: 1, right: 1};
    dangerThreshold = Math.max(1, Math.floor(gridSize * 0.67));
    warningThreshold = Math.max(2, Math.floor(gridSize * 1.33));
    highPotentialThreshold = Math.max(2, Math.floor(gridSize * 0.67));
    mediumPotentialThreshold = Math.max(1, Math.floor(gridSize * 0.33));
    directions.forEach(direction => {
        const tempGameState = {
            grid: JSON.parse(JSON.stringify(gridCopy)),
            score: originalScore,
            gridSize: gridSize,
            gridRows: gridRows,
            gridCols: gridCols
        };
        const moveResult = simulateMove(tempGameState, direction);
        if (moveResult.moved) {
            const scoreDiff = moveResult.score - originalScore;
            const emptyCells = countEmptyCells(tempGameState.grid);
            const merges = moveResult.merges;
            const positionScore = calculatePositionScore(tempGameState.grid);
            const maxValueScore = calculateMaxValueScore(tempGameState.grid);
            const continuityScore = calculateContinuityScore(tempGameState.grid);
            const uniformityScore = calculateUniformityScore(tempGameState.grid);
            const blockScore = calculateBlockScore(tempGameState.grid);
            const multiStepScore = calculateMultiStepScore(tempGameState.grid, direction);
            const monotonicityScore = calculateMonotonicityScore(tempGameState.grid);
            let totalScore = (
                scoreDiff * scoreDiffWeight +
                emptyCells * emptyCellsWeight +
                merges * mergesWeight +
                positionScore * positionWeight +
                maxValueScore * maxValueWeight +
                continuityScore * continuityWeight +
                uniformityScore * uniformityWeight +
                blockScore * blockWeight +
                multiStepScore * multiStepWeight +
                monotonicityScore * monotonicityWeight
            ) * directionPriority[direction];
            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestDirection = direction;
            }
            mergeOpportunities += merges;
        }
    });
    const assessment = evaluateGameState(gameState, dangerThreshold, warningThreshold);
    const potential = assessScorePotential(gameState, highPotentialThreshold, mediumPotentialThreshold);
    return {
        bestMove: bestDirection,
        mergeOpportunities: mergeOpportunities,
        gameStateAssessment: assessment === i18n.t('danger') ? 'danger' : (assessment === i18n.t('warning') ? 'warning' : 'safe'),
        scorePotential: potential === i18n.t('high') ? 'high' : (potential === i18n.t('mediumScore') ? 'medium' : 'low'),
        aiSuggestion: ''
    };
}
async function analyzeGameState() {
    const modal = document.getElementById('ai-analysis-modal');
    const overlay = document.getElementById('ai-analysis-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    showAnalysisLoading();
    modal.classList.remove('ai-modal-closed');
    setTimeout(() => {
        initAnalysisModeState();
        toggleAiSuggestionVisibility(currentAnalysisMode === 'ai', true);
    }, 50);
    const gameChanged = isGameStateChanged(gameState);
    if (!gameChanged) {
        if (currentAnalysisMode === 'ai') {
            if (cachedAiResults) {
                updateAnalysisResults(cachedAiResults);
                return;
            }
        } else {
            if (cachedAlgorithmResults) {
                updateAnalysisResults(cachedAlgorithmResults);
                return;
            }
        }
    } else {
        cachedAlgorithmResults = null;
        cachedAiResults = null;
    }
    if (currentAnalysisMode === 'ai') {
        const language = i18n.getLang();
        const result = await window.aiRequest?.sendGameAnalysis(gameState, language);
        if (result && result.success) {
            cachedAiResults = result.data;
            updateGameStateCache(gameState, undefined, result.data);
            updateAnalysisResults(result.data);
        } else {
            let errorMsg = result?.error ? i18n.t(result.error) : i18n.t('aiApiRequestFailed');
            if (result?.message) {
                errorMsg += ': ' + result.message;
            }
            cachedAiResults = {
                bestMove: '--',
                mergeOpportunities: 0,
                gameStateAssessment: 'safe',
                scorePotential: 'medium',
                aiSuggestion: errorMsg
            };
            updateGameStateCache(gameState, undefined, cachedAiResults);
            updateAnalysisResults(cachedAiResults);
        }
    } else {
        const results = analyzeGameStateWithAlgorithm();
        cachedAlgorithmResults = results;
        updateGameStateCache(gameState, results, undefined);
        updateAnalysisResults(results);
    }
}
function simulateMove(gameState, direction) {
    let moved = false;
    let score = gameState.score;
    let merges = 0;
    const grid = gameState.grid;
    const gridRows = gameState.gridRows;
    const gridCols = gameState.gridCols;
    const originalGrid = JSON.parse(JSON.stringify(grid));
    if (direction === 'left') {
        for (let row = 0; row < gridRows; row++) {
            const result = mergeRowLeft(grid[row]);
            grid[row] = result.row;
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    } else if (direction === 'right') {
        for (let row = 0; row < gridRows; row++) {
            grid[row].reverse();
            const result = mergeRowLeft(grid[row]);
            grid[row] = result.row.reverse();
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    } else if (direction === 'up') {
        for (let col = 0; col < gridCols; col++) {
            const column = [];
            for (let row = 0; row < gridRows; row++) {
                column.push(grid[row][col]);
            }
            const result = mergeRowLeft(column);
            for (let row = 0; row < gridRows; row++) {
                grid[row][col] = result.row[row];
            }
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    } else if (direction === 'down') {
        for (let col = 0; col < gridCols; col++) {
            const column = [];
            for (let row = 0; row < gridRows; row++) {
                column.push(grid[row][col]);
            }
            column.reverse();
            const result = mergeRowLeft(column);
            const mergedColumn = result.row.reverse();
            for (let row = 0; row < gridRows; row++) {
                grid[row][col] = mergedColumn[row];
            }
            if (result.moved) moved = true;
            score += result.score;
            merges += result.merges;
        }
    }
    return { moved, score, merges };
}
function mergeRowLeft(row) {
    let newRow = row.filter(cell => cell !== 0 && cell !== null);
    let score = 0;
    let merges = 0;
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            merges++;
            newRow.splice(i + 1, 1);
            newRow.push(0);
        }
    }
    while (newRow.length < row.length) {
        newRow.push(0);
    }
    const moved = JSON.stringify(row) !== JSON.stringify(newRow);
    return { row: newRow, score, merges, moved };
}
function createGridUtils(grid) {
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    return {
        gridRows,
        gridCols,
        isValidCell(row, col) {
            return row >= 0 && row < gridRows && col >= 0 && col < gridCols;
        },
        isEmpty(row, col) {
            return grid[row][col] === 0 || grid[row][col] === null;
        },
        hasEmptyNeighbor(row, col) {
            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1]
            ];
            return directions.some(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                return this.isValidCell(newRow, newCol) && this.isEmpty(newRow, newCol);
            });
        },
        forEachCell(callback) {
            for (let i = 0; i < gridRows; i++) {
                for (let j = 0; j < gridCols; j++) {
                    callback(grid[i][j], i, j);
                }
            }
        },
        forEachNonEmptyCell(callback) {
            this.forEachCell((cell, row, col) => {
                if (!this.isEmpty(row, col)) {
                    callback(cell, row, col);
                }
            });
        }
    };
}
function countEmptyCells(grid) {
    const utils = createGridUtils(grid);
    let count = 0;
    utils.forEachCell((cell, row, col) => {
        if (utils.isEmpty(row, col)) count++;
    });
    return count;
}
function calculatePositionScore(grid) {
    const utils = createGridUtils(grid);
    let score = 0;
    const weights = [];
    for (let i = 0; i < utils.gridRows; i++) {
        weights[i] = [];
        for (let j = 0; j < utils.gridCols; j++) {
            weights[i][j] = Math.pow(2, (utils.gridRows - i - 1) + (utils.gridCols - j - 1));
        }
    }
    utils.forEachNonEmptyCell((cell, row, col) => {
        score += cell * weights[row][col];
    });
    return score;
}
function calculateMaxValueScore(grid) {
    const utils = createGridUtils(grid);
    let maxValue = 0;
    utils.forEachNonEmptyCell((cell) => {
        if (cell > maxValue) maxValue = cell;
    });
    return maxValue;
}
function calculateContinuityScore(grid) {
    const utils = createGridUtils(grid);
    let score = 0;
    utils.forEachNonEmptyCell((cell, row, col) => {
        if (utils.isValidCell(row, col + 1) && !utils.isEmpty(row, col + 1)) {
            const rightCell = grid[row][col + 1];
            const ratio = Math.min(cell, rightCell) / Math.max(cell, rightCell);
            score += ratio;
        }
        if (utils.isValidCell(row + 1, col) && !utils.isEmpty(row + 1, col)) {
            const downCell = grid[row + 1][col];
            const ratio = Math.min(cell, downCell) / Math.max(cell, downCell);
            score += ratio;
        }
    });
    return score;
}
function calculateUniformityScore(grid) {
    const utils = createGridUtils(grid);
    const values = [];
    utils.forEachNonEmptyCell((cell) => {
        values.push(cell);
    });
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const uniformity = 1 / (1 + Math.sqrt(variance));
    return uniformity;
}
function calculateBlockScore(grid) {
    const utils = createGridUtils(grid);
    let blockScore = 0;
    utils.forEachNonEmptyCell((cell, row, col) => {
        if (!utils.hasEmptyNeighbor(row, col)) {
            const canMergeVertically = row > 0 && row < utils.gridRows - 1 && 
                grid[row - 1][col] === grid[row + 1][col] && !utils.isEmpty(row - 1, col);
            const canMergeHorizontally = col > 0 && col < utils.gridCols - 1 && 
                grid[row][col - 1] === grid[row][col + 1] && !utils.isEmpty(row, col - 1);
            if (!canMergeVertically && !canMergeHorizontally) {
                blockScore++;
            }
        }
    });
    return -blockScore;
}
function calculateMultiStepScore(grid, direction) {
    const utils = createGridUtils(grid);
    const tempGameState = {
        grid: JSON.parse(JSON.stringify(grid)),
        score: 0,
        gridSize: Math.max(utils.gridRows, utils.gridCols),
        gridRows: utils.gridRows,
        gridCols: utils.gridCols
    };
    let multiStepScore = 0;
    let steps = 0;
    while (steps < 2) {
        const result = simulateMove(tempGameState, direction);
        if (!result.moved) break;
        multiStepScore += result.score;
        steps++;
    }
    return multiStepScore;
}
function calculateMonotonicityScore(grid) {
    const utils = createGridUtils(grid);
    let monotonicity = 0;
    for (let i = 0; i < utils.gridRows; i++) {
        for (let j = 0; j < utils.gridCols - 1; j++) {
            if (!utils.isEmpty(i, j) && !utils.isEmpty(i, j + 1) && grid[i][j] <= grid[i][j + 1]) {
                monotonicity++;
            }
        }
    }
    for (let j = 0; j < utils.gridCols; j++) {
        for (let i = 0; i < utils.gridRows - 1; i++) {
            if (!utils.isEmpty(i, j) && !utils.isEmpty(i + 1, j) && grid[i][j] <= grid[i + 1][j]) {
                monotonicity++;
            }
        }
    }
    return monotonicity;
}
function evaluateGameState(gameState, dangerThreshold, warningThreshold) {
    const emptyCells = countEmptyCells(gameState.grid);
    if (emptyCells <= dangerThreshold) {
        return i18n.t('danger');
    } else if (emptyCells <= warningThreshold) {
        return i18n.t('warning');
    } else {
        return i18n.t('safe');
    }
}
function assessScorePotential(gameState, highPotentialThreshold, mediumPotentialThreshold) {
    const emptyCells = countEmptyCells(gameState.grid);
    if (emptyCells >= highPotentialThreshold) {
        return i18n.t('high');
    } else if (emptyCells >= mediumPotentialThreshold) {
        return i18n.t('mediumScore');
    } else {
        return i18n.t('low');
    }
}
if (typeof window !== 'undefined') {
    window.setupAiAnalysis = setupAiAnalysis;
    window.analyzeGameState = analyzeGameState;
}