const aiAnalysisVersion = '2.7';
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
function getAiConfigErrors() {
    if (!window.aiRequest || typeof window.aiRequest.validateConfig !== 'function' || typeof window.aiRequest.getConfig !== 'function') {
        return [];
    }
    try {
        const errors = window.aiRequest.validateConfig(window.aiRequest.getConfig());
        return Array.isArray(errors) ? errors : [];
    } catch (e) {
        return [];
    }
}
function hasIncompleteAiConfig() {
    return getAiConfigErrors().length > 0;
}
function buildAiConfigPromptMessage() {
    const errors = getAiConfigErrors().map(key => i18n.t(key)).join('；');
    const prompt = i18n.t('aiApiConfigIncomplete');
    return errors ? prompt + '：' + errors : prompt;
}
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
        const apiSettingsEntry = document.getElementById('ai-analysis-api-settings-entry');
        const toggleApiSettingsEntry = (show) => {
            if (!apiSettingsEntry) return;
            if (show) {
                apiSettingsEntry.classList.remove('hidden');
            } else {
                apiSettingsEntry.classList.add('hidden');
            }
        };
        const apiSettingsButton = document.getElementById('ai-analysis-api-settings-button');
        if (apiSettingsButton) {
            apiSettingsButton.addEventListener('click', () => {
                if (typeof showModal === 'function') {
                    showModal('ai-settings-modal');
                }
            });
        }
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', async () => {
                if (currentAnalysisMode !== 'ai') return;
                if (hasIncompleteAiConfig()) {
                    const suggestionEl = document.getElementById('ai-suggestion');
                    if (suggestionEl) suggestionEl.textContent = buildAiConfigPromptMessage();
                    return;
                }
                showAnalysisLoading();
                setRegenerateButtonLoading(true);
                cachedAiResults = null;
                try {
                    const language = i18n.getLang();
                    const result = await requestGameAnalysis(gameState, language);
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
            toggleApiSettingsEntry(true);
        } else {
            algorithmBtn.className = 'px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
            aiBtn.className = 'px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
            analysisSlider.style.left = '2px';
            toggleRegenerateButton(false);
            toggleApiSettingsEntry(false);
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
                toggleApiSettingsEntry(false);
            } else {
                aiBtn.className = 'px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
                algorithmBtn.className = 'px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors relative z-10 bg-transparent';
                toggleRegenerateButton(true);
                toggleApiSettingsEntry(true);
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
                        if (hasIncompleteAiConfig()) {
                            const configErrorMsg = buildAiConfigPromptMessage();
                            cachedAiResults = {
                                bestMove: '--',
                                mergeOpportunities: 0,
                                gameStateAssessment: 'safe',
                                scorePotential: 'medium',
                                aiSuggestion: configErrorMsg
                            };
                            updateGameStateCache(gameState, undefined, cachedAiResults);
                            updateAnalysisResults(cachedAiResults);
                            return;
                        }
                        if (cachedAiResults && !gameChanged) {
                            updateAnalysisResults(cachedAiResults);
                        } else {
                            showAnalysisLoading();
                            toggleAiSuggestionVisibility(true, true);
                            const language = i18n.getLang();
                            const result = await requestGameAnalysis(gameState, language);
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
            document.getElementById('ai-analysis-modal').classList.add('ai-modal-closed');
        });
    }
    const aiAnalysisModal = document.getElementById('ai-analysis-modal');
    let backdropPressed = false;
    if (aiAnalysisModal) {
        aiAnalysisModal.addEventListener('mousedown', function(e) {
            backdropPressed = e.target === aiAnalysisModal;
        });
        aiAnalysisModal.addEventListener('touchstart', function(e) {
            backdropPressed = e.target === aiAnalysisModal;
        }, { passive: true });
        aiAnalysisModal.addEventListener('click', function(e) {
            const fromBackdrop = e.target === aiAnalysisModal && backdropPressed;
            backdropPressed = false;
            if (fromBackdrop) {
                aiAnalysisModal.classList.add('ai-modal-closed');
            }
        });
    }
    const aiAnalysisContent = document.querySelector('.ai-analysis-content');
    const aiAnalysisTitle = document.getElementById('ai-analysis-modal-title');
    let aiResizeHandle = null;
    function positionAiResizeHandle() {
        if (!aiResizeHandle || !aiAnalysisContent || !aiAnalysisModal) return;
        const overlayWidth = aiAnalysisModal.clientWidth;
        const overlayHeight = aiAnalysisModal.clientHeight;
        const contentWidth = aiAnalysisContent.offsetWidth;
        const contentHeight = aiAnalysisContent.offsetHeight;
        let left;
        let top;
        const inlineLeft = parseFloat(aiAnalysisContent.style.left);
        const inlineTop = parseFloat(aiAnalysisContent.style.top);
        if (!isNaN(inlineLeft) && !isNaN(inlineTop)) {
            left = inlineLeft;
            top = inlineTop;
        } else {
            left = (overlayWidth - contentWidth) / 2;
            top = (overlayHeight - contentHeight) / 2;
        }
        aiResizeHandle.style.right = Math.max(0, overlayWidth - (left + contentWidth)) + 'px';
        aiResizeHandle.style.bottom = Math.max(0, overlayHeight - (top + contentHeight)) + 'px';
    }
    if (aiAnalysisTitle && aiAnalysisContent) {
        aiAnalysisTitle.style.cursor = 'move';
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        aiAnalysisTitle.addEventListener('mousedown', function(e) {
            if (e.target.closest('button') || e.target.closest('#analysis-switch-container') || window.isSliderDragging) return;
            isDragging = true;
            backdropPressed = false;
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
            positionAiResizeHandle();
        });
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                aiAnalysisContent.style.transition = 'none';
            }
        });
    }
    if (aiAnalysisContent && aiAnalysisModal) {
        aiResizeHandle = document.createElement('div');
        aiResizeHandle.id = 'ai-analysis-resize-handle';
        aiResizeHandle.className = 'ai-analysis-resize-handle';
        aiAnalysisModal.appendChild(aiResizeHandle);
        positionAiResizeHandle();
        if (typeof ResizeObserver === 'function') {
            new ResizeObserver(positionAiResizeHandle).observe(aiAnalysisContent);
        }
        if (typeof MutationObserver === 'function') {
            new MutationObserver(positionAiResizeHandle).observe(aiAnalysisModal, { attributes: true, attributeFilter: ['class'] });
        }
        window.addEventListener('resize', positionAiResizeHandle);
        let isResizing = false;
        let resizeStartX = 0;
        let resizeStartY = 0;
        let resizeStartWidth = 0;
        let resizeStartHeight = 0;
        const AI_MODAL_MIN_WIDTH = 320;
        const AI_MODAL_MIN_HEIGHT = 280;
        const AI_MODAL_MAX_WIDTH = 760;
        aiResizeHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            backdropPressed = false;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            resizeStartWidth = aiAnalysisContent.offsetWidth;
            resizeStartHeight = aiAnalysisContent.offsetHeight;
            if (isNaN(parseFloat(aiAnalysisContent.style.left)) || isNaN(parseFloat(aiAnalysisContent.style.top))) {
                aiAnalysisContent.style.left = ((aiAnalysisModal.clientWidth - resizeStartWidth) / 2) + 'px';
                aiAnalysisContent.style.top = ((aiAnalysisModal.clientHeight - resizeStartHeight) / 2) + 'px';
                aiAnalysisContent.style.transform = 'none';
            }
            aiAnalysisContent.style.transition = 'none';
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            const containerRect = aiAnalysisModal.getBoundingClientRect();
            const contentRect = aiAnalysisContent.getBoundingClientRect();
            const maxAvailableWidth = containerRect.right - contentRect.left;
            const maxAvailableHeight = containerRect.bottom - contentRect.top;
            let newWidth = resizeStartWidth + (e.clientX - resizeStartX);
            let newHeight = resizeStartHeight + (e.clientY - resizeStartY);
            newWidth = Math.max(AI_MODAL_MIN_WIDTH, Math.min(newWidth, AI_MODAL_MAX_WIDTH, maxAvailableWidth));
            newHeight = Math.max(AI_MODAL_MIN_HEIGHT, Math.min(newHeight, containerRect.height * 0.92, maxAvailableHeight));
            aiAnalysisContent.style.width = newWidth + 'px';
            aiAnalysisContent.style.height = newHeight + 'px';
            aiAnalysisContent.style.maxWidth = 'none';
            aiAnalysisContent.style.maxHeight = 'none';
            positionAiResizeHandle();
        });
        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                aiAnalysisContent.style.transition = 'none';
                document.body.style.userSelect = '';
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
    const aiSuggestionValue = document.getElementById('ai-suggestion');
    const aiSuggestionItem = aiSuggestionValue ? aiSuggestionValue.closest('.analysis-item') : null;
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
    directionNames.undo = i18n.t('undo');
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
function normalizeGridToNumbers(grid) {
    return grid.map(row => row.map(cell => {
        if (cell && typeof cell === 'object') return cell.value || 0;
        return cell || 0;
    }));
}
const AI_DIRECTIONS = ['up', 'down', 'left', 'right'];
const AI_SPAWN_FOUR_PROBABILITY = 0.1;
const AI_SEARCH_TIME_BUDGET = 90;
const AI_UNDO_ADVANTAGE_MARGIN = 1.5;
function aiNow() {
    return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
}
function aiLegalMoves(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const moves = [];
    for (let i = 0; i < AI_DIRECTIONS.length; i++) {
        const direction = AI_DIRECTIONS[i];
        const state = {
            grid: grid.map(row => row.slice()),
            score: 0,
            gridSize: Math.max(rows, cols),
            gridRows: rows,
            gridCols: cols
        };
        const result = simulateMove(state, direction);
        if (result.moved) {
            moves.push({ direction: direction, grid: state.grid, gained: result.score, merges: result.merges });
        }
    }
    return moves;
}
function aiCountMergePairs(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const value = grid[r][c];
            if (!value) continue;
            if (c + 1 < cols && grid[r][c + 1] === value) count++;
            if (r + 1 < rows && grid[r + 1][c] === value) count++;
        }
    }
    return count;
}
function aiSnakeScore(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const total = rows * cols;
    const corners = [[0, 0], [0, cols - 1], [rows - 1, 0], [rows - 1, cols - 1]];
    let best = -Infinity;
    for (let k = 0; k < corners.length; k++) {
        const startRow = corners[k][0];
        const startCol = corners[k][1];
        const rowStep = startRow === 0 ? 1 : -1;
        let score = 0;
        let index = 0;
        for (let i = 0; i < rows; i++) {
            const r = startRow + rowStep * i;
            const leftToRight = i % 2 === 0;
            for (let j = 0; j < cols; j++) {
                const c = leftToRight ? j : cols - 1 - j;
                const value = grid[r][c];
                if (value) score += Math.log2(value) * (1 - index / total);
                index++;
            }
        }
        if (score > best) best = score;
    }
    return best;
}
function aiMonotonicityScore(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let score = 0;
    const lineScore = (values) => {
        let rising = 0;
        let falling = 0;
        for (let i = 0; i < values.length - 1; i++) {
            if (!values[i] || !values[i + 1]) continue;
            const left = Math.log2(values[i]);
            const right = Math.log2(values[i + 1]);
            if (left > right) falling += right - left;
            else rising += left - right;
        }
        return Math.max(rising, falling);
    };
    for (let r = 0; r < rows; r++) score += lineScore(grid[r]);
    for (let c = 0; c < cols; c++) {
        const column = [];
        for (let r = 0; r < rows; r++) column.push(grid[r][c]);
        score += lineScore(column);
    }
    return score;
}
function aiEvaluateGrid(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let empty = 0;
    let mergePairs = 0;
    let smoothness = 0;
    let maxValue = 0;
    let maxRow = 0;
    let maxCol = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const value = grid[r][c];
            if (!value) {
                empty++;
                continue;
            }
            const logValue = Math.log2(value);
            if (value > maxValue) {
                maxValue = value;
                maxRow = r;
                maxCol = c;
            }
            if (c + 1 < cols && grid[r][c + 1]) {
                const right = grid[r][c + 1];
                smoothness -= Math.abs(logValue - Math.log2(right));
                if (right === value) mergePairs++;
            }
            if (r + 1 < rows && grid[r + 1][c]) {
                const down = grid[r + 1][c];
                smoothness -= Math.abs(logValue - Math.log2(down));
                if (down === value) mergePairs++;
            }
        }
    }
    let cornerBonus = 0;
    if (maxValue) {
        const maxLog = Math.log2(maxValue);
        const cornerDistance = Math.min(
            maxRow + maxCol,
            maxRow + (cols - 1 - maxCol),
            (rows - 1 - maxRow) + maxCol,
            (rows - 1 - maxRow) + (cols - 1 - maxCol)
        );
        cornerBonus = cornerDistance === 0 ? maxLog * 1.5 : -maxLog * Math.min(cornerDistance, 4) * 0.25;
    }
    const monotonicity = aiMonotonicityScore(grid);
    const snake = aiSnakeScore(grid);
    return empty * 3.2 + mergePairs * 1.2 + smoothness * 0.12 + monotonicity * 0.9 + snake * 0.35 + cornerBonus;
}
function aiChanceValue(grid, depth, deadline) {
    if (depth <= 0 || aiNow() > deadline) return aiEvaluateGrid(grid);
    const empties = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (!grid[r][c]) empties.push([r, c]);
        }
    }
    if (!empties.length) return aiSearchValue(grid, depth, deadline);
    let total = 0;
    for (let i = 0; i < empties.length; i++) {
        const row = empties[i][0];
        const col = empties[i][1];
        const withTwo = grid.map(line => line.slice());
        withTwo[row][col] = 2;
        total += (1 - AI_SPAWN_FOUR_PROBABILITY) * aiSearchValue(withTwo, depth, deadline);
        const withFour = grid.map(line => line.slice());
        withFour[row][col] = 4;
        total += AI_SPAWN_FOUR_PROBABILITY * aiSearchValue(withFour, depth, deadline);
    }
    return total / empties.length;
}
function aiSearchValue(grid, depth, deadline) {
    if (depth <= 0 || aiNow() > deadline) return aiEvaluateGrid(grid);
    const moves = aiLegalMoves(grid);
    if (!moves.length) return aiEvaluateGrid(grid) - 500;
    let best = -Infinity;
    for (let i = 0; i < moves.length; i++) {
        const value = aiChanceValue(moves[i].grid, depth - 1, deadline) + Math.log2(moves[i].gained + 1) * 0.6;
        if (value > best) best = value;
    }
    return best;
}
function analyzeGameStateWithAlgorithm() {
    if (!gameState || !gameState.grid || !gameState.grid.length) {
        return {
            bestMove: 'up',
            mergeOpportunities: 0,
            gameStateAssessment: 'safe',
            scorePotential: 'low',
            aiSuggestion: ''
        };
    }
    const grid = normalizeGridToNumbers(gameState.grid);
    const rows = grid.length;
    const cols = grid[0].length;
    const cells = rows * cols;
    const deadline = aiNow() + AI_SEARCH_TIME_BUDGET;
    const emptyCells = countEmptyCells(grid);
    const depth = emptyCells <= 2 ? 3 : 2;
    const moves = aiLegalMoves(grid);
    let bestDirection = 'up';
    let bestValue = -Infinity;
    for (let i = 0; i < moves.length; i++) {
        const value = aiChanceValue(moves[i].grid, depth - 1, deadline) + Math.log2(moves[i].gained + 1) * 0.6;
        if (value > bestValue) {
            bestValue = value;
            bestDirection = moves[i].direction;
        }
    }
    const allowUndo = !window.settingsManager || typeof window.settingsManager.load !== 'function' || window.settingsManager.load('ai-allow-undo');
    if (allowUndo && gameState.history && gameState.history.length > 0) {
        const prevGrid = normalizeGridToNumbers(gameState.history[gameState.history.length - 1].grid);
        const prevMoves = aiLegalMoves(prevGrid);
        if (prevMoves.length > 0) {
            const undoDeadline = aiNow() + AI_SEARCH_TIME_BUDGET;
            let undoValue = -Infinity;
            for (let i = 0; i < prevMoves.length; i++) {
                const value = aiChanceValue(prevMoves[i].grid, depth - 1, undoDeadline) + Math.log2(prevMoves[i].gained + 1) * 0.6;
                if (value > undoValue) undoValue = value;
            }
            if (undoValue > bestValue + AI_UNDO_ADVANTAGE_MARGIN) {
                bestDirection = 'undo';
            }
        }
    }
    const mergeOpportunities = aiCountMergePairs(grid);
    const mobility = moves.length;
    const dangerEmpty = Math.max(1, Math.round(cells * 0.12));
    const warningEmpty = Math.max(2, Math.round(cells * 0.35));
    let gameStateAssessment = 'safe';
    if (emptyCells <= dangerEmpty || mobility <= 1) {
        gameStateAssessment = 'danger';
    } else if ((emptyCells <= warningEmpty && mergeOpportunities === 0) || mobility === 2) {
        gameStateAssessment = 'warning';
    }
    const highPotentialThreshold = Math.max(2, Math.round(cells * 0.15));
    let scorePotential = 'low';
    if (mergeOpportunities >= highPotentialThreshold) scorePotential = 'high';
    else if (mergeOpportunities >= 1) scorePotential = 'medium';
    return {
        bestMove: bestDirection,
        mergeOpportunities: mergeOpportunities,
        gameStateAssessment: gameStateAssessment,
        scorePotential: scorePotential,
        aiSuggestion: ''
    };
}
function buildGameAnalysisMessages(gameState, language, options = {}) {
    const gridData = gameState.grid.map(row =>
        row.map(cell => cell ? cell.value : 0)
    );
    const gameData = {
        grid: gridData,
        score: gameState.score,
        bestScore: gameState.bestScore,
        gridRows: gameState.gridRows,
        gridCols: gameState.gridCols,
        isEndlessMode: gameState.isEndlessMode,
        difficulty: gameState.difficulty
    };
    const bestMoveOnly = !!(options && options.bestMoveOnly);
    const allowUndoSetting = !window.settingsManager || typeof window.settingsManager.load !== 'function' || window.settingsManager.load('ai-allow-undo');
    const canUndo = allowUndoSetting && gameState && Array.isArray(gameState.history) && gameState.history.length > 0;
    const bestMoveRule = canUndo
        ? 'MUST be exactly ONE of these 5 exact lowercase values: "up" | "down" | "left" | "right" | "undo". "undo" reverts the last move and restores the previous board state; recommend it ONLY when the previous position was clearly better and every direct move would likely make things worse.'
        : 'MUST be exactly ONE of these 4 exact lowercase values: "up" | "down" | "left" | "right".';
    return bestMoveOnly ? [
        {
            role: 'system',
            content: 'You are an expert 2048 game player. Choose the single best move for the given grid and return ONLY a valid JSON object.\n\nSTRICT OUTPUT FORMAT REQUIREMENTS:\n- Your entire response must be a single JSON object. No extra text, no explanations, no markdown code blocks, no ```json``` wrappers.\n- The JSON object MUST contain exactly one key: "bestMove" (string), which ' + bestMoveRule + ' No other values are allowed. If you are uncertain, still choose the single most likely direction among the four.\n'
        },
        {
            role: 'user',
            content: 'Choose the best move for this 2048 grid and return ONLY the JSON object.\nGrid: ' + JSON.stringify(gridData)
        }
    ] : [
        {
            role: 'system',
            content: 'You are an expert 2048 game analyst. Analyze the game state and return ONLY a valid JSON object as output.\n\nSTRICT OUTPUT FORMAT REQUIREMENTS:\n- Your entire response must be a single JSON object. No extra text, no explanations, no markdown code blocks, no ```json``` wrappers.\n- The JSON object MUST contain exactly these 6 keys with the following constraints:\n\n1. "bestMove" (string, REQUIRED): ' + bestMoveRule + ' ABSOLUTELY NO other values allowed. Do NOT return arrays, multiple directions separated by commas or slashes, "none", "any", "unknown", "N/A", empty string, or any value outside the four listed above. If you are uncertain, still choose the single most likely direction among the four.\n\n2. "mergeOpportunities" (integer, REQUIRED): A non-negative integer (0, 1, 2, ...) counting the possible tile merges on the current grid.\n\n3. "gameStateAssessment" (string, REQUIRED): MUST be exactly ONE of: "safe" | "warning" | "danger". No other values.\n\n4. "scorePotential" (string, REQUIRED): MUST be exactly ONE of: "high" | "medium" | "low". No other values.\n\n5. "aiSuggestion" (string, REQUIRED): A detailed strategic recommendation written in the user\'s language. Explain why the chosen bestMove is optimal.\n\n6. "confidence" (number, REQUIRED): A float between 0.0 and 1.0 inclusive representing your confidence in the bestMove recommendation.\n\nUSER LANGUAGE REQUIREMENT: The user\'s language is: ' + language + '. The entire "aiSuggestion" string MUST be written in this language. Do NOT mix languages.\n\nFINAL REMINDER: Return ONLY the raw JSON object. Do not wrap it in any other formatting.\n'
        },
        {
            role: 'user',
            content: 'Analyze this 2048 game state and return ONLY a JSON object.\nGame data: ' + JSON.stringify(gameData)
        }
    ];
}
function parseGameAnalysisMessage(messageContent) {
    try {
        let jsonStr = messageContent.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        }
        return { success: true, data: JSON.parse(jsonStr) };
    } catch (e) {
        return {
            success: false,
            error: 'aiApiParseError',
            message: messageContent.substring(0, 200)
        };
    }
}
async function requestGameAnalysis(gameState, language, options = {}) {
    if (!window.aiRequest || typeof window.aiRequest.sendRequest !== 'function') {
        return {
            success: false,
            error: 'aiApiRequestFailed'
        };
    }
    const messages = buildGameAnalysisMessages(gameState, language, options);
    const result = await window.aiRequest.sendRequest(messages);
    if (!result || !result.success) {
        return result || { success: false, error: 'aiApiRequestFailed' };
    }
    const messageContent = result.message || '';
    console.log('[AI Raw Response]', messageContent);
    const parsed = parseGameAnalysisMessage(messageContent);
    if (!parsed.success) return parsed;
    return {
        success: true,
        data: parsed.data,
        rawMessage: messageContent
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
        const result = await requestGameAnalysis(gameState, language);
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
if (typeof window !== 'undefined') {
    window.setupAiAnalysis = setupAiAnalysis;
    window.analyzeGameState = analyzeGameState;
    window.requestGameAnalysis = requestGameAnalysis;
}