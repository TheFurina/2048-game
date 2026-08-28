const aiRequestVersion = '1.1';
window.aiRequestVersion = aiRequestVersion;
const DEFAULT_CONFIG = {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o-mini'
};
function getAiConfig() {
    try {
        const saved = localStorage.getItem('2048-ai-config');
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...DEFAULT_CONFIG, baseUrl: parsed.baseUrl, apiKey: parsed.apiKey, model: parsed.model };
        }
    } catch (e) {
        console.error('Failed to load AI config:', e);
    }
    return { ...DEFAULT_CONFIG };
}
function saveAiConfig(config) {
    try {
        localStorage.setItem('2048-ai-config', JSON.stringify(config));
        return true;
    } catch (e) {
        console.error('Failed to save AI config:', e);
        return false;
    }
}
function validateAiConfig(config) {
    const errors = [];
    if (!config.baseUrl || !config.baseUrl.trim()) {
        errors.push('aiApiBaseUrlEmpty');
    } else if (!/^https?:\/\//i.test(config.baseUrl)) {
        errors.push('aiApiBaseUrlInvalid');
    }
    if (!config.apiKey || !config.apiKey.trim()) {
        errors.push('aiApiKeyEmpty');
    }
    if (!config.model || !config.model.trim()) {
        errors.push('aiApiModelEmpty');
    }
    return errors;
}
async function fetchModels(config = null) {
    const aiConfig = config || getAiConfig();
    try {
        const response = await fetch(`${aiConfig.baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${aiConfig.apiKey}`
            }
        });
        if (!response.ok) {
            return { success: false };
        }
        const data = await response.json();
        const models = data.data?.map(m => m.id) || [];
        return { success: true, models: models };
    } catch (e) {
        console.error('Failed to fetch models:', e);
        return { success: false };
    }
}
async function sendAiRequest(messages, config = null) {
    const aiConfig = config || getAiConfig();
    const errors = validateAiConfig(aiConfig);
    if (errors.length > 0) {
        return {
            success: false,
            error: errors[0],
            errors: errors
        };
    }
    try {
        const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: aiConfig.model,
                messages: messages
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                success: false,
                error: 'aiApiRequestFailed',
                status: response.status,
                message: errorData?.error?.message || response.statusText
            };
        }
        const data = await response.json();
        return {
            success: true,
            data: data,
            message: data.choices?.[0]?.message?.content || ''
        };
    } catch (e) {
        console.error('AI request error:', e);
        return {
            success: false,
            error: 'aiApiNetworkError',
            message: e.message
        };
    }
}
const ButtonStateManager = {
    states: {
        default: {
            className: 'w-full px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words',
            icon: 'fa-circle-check',
            textKey: 'aiApiCheck',
            fallbackText: '检查可用性',
            dataI18n: 'aiApiCheck',
            disabled: false
        },
        loading: {
            className: 'w-full px-4 py-2 text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words',
            icon: 'fa-spinner fa-spin',
            textKey: 'aiApiChecking',
            fallbackText: '检查中...',
            dataI18n: 'aiApiChecking',
            disabled: true
        },
        success: {
            className: 'w-full px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words',
            icon: 'fa-circle-check',
            textKey: 'aiApiAvailable',
            fallbackText: 'API可用',
            dataI18n: 'aiApiAvailable',
            disabled: false
        },
        error: {
            className: 'w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words',
            icon: 'fa-circle-exclamation',
            textKey: 'aiApiUnavailable',
            fallbackText: 'API不可用',
            dataI18n: 'aiApiUnavailable',
            disabled: false
        }
    },
    setState(button, stateName, customText = null) {
        const state = this.states[stateName];
        if (!state) {
            console.warn(`Unknown button state: ${stateName}`);
            return;
        }
        button.className = state.className;
        button.disabled = state.disabled;
        const text = customText || (i18n && i18n.t ? i18n.t(state.textKey) : state.fallbackText);
        const dataAttr = state.dataI18n ? ` data-i18n="${state.dataI18n}"` : '';
        button.innerHTML = `<i class="fa-solid ${state.icon} flex-shrink-0"></i><span${dataAttr}>${text}</span>`;
    },
    reset(button) {
        this.setState(button, 'default');
    },
    flashState(button, { className, icon, text, dataI18n = null, duration = 2000 }) {
        const original = {
            className: button.className,
            innerHTML: button.innerHTML
        };
        button.className = className;
        const dataAttr = dataI18n ? ` data-i18n="${dataI18n}"` : '';
        button.innerHTML = `<i class="${icon} flex-shrink-0"></i><span${dataAttr}>${text}</span>`;
        setTimeout(() => {
            button.className = original.className;
            button.innerHTML = original.innerHTML;
        }, duration);
    }
};
const DropdownStateManager = {
    show(dropdown, iconElement = null) {
        dropdown.classList.remove('opacity-0', 'pointer-events-none');
        dropdown.classList.add('opacity-100');
        if (iconElement) {
            iconElement.style.transform = 'rotate(180deg)';
        }
    },
    hide(dropdown, iconElement = null) {
        dropdown.classList.remove('opacity-100');
        dropdown.classList.add('opacity-0', 'pointer-events-none');
        if (iconElement) {
            iconElement.style.transform = 'rotate(0deg)';
        }
    },
    toggle(dropdown, iconElement = null) {
        if (this.isHidden(dropdown)) {
            this.show(dropdown, iconElement);
        } else {
            this.hide(dropdown, iconElement);
        }
    },
    isHidden(dropdown) {
        return dropdown.classList.contains('opacity-0');
    },
    isVisible(dropdown) {
        return dropdown.classList.contains('opacity-100');
    }
};
function setupAiRequestSettings() {
    const aiSettingsButton = document.getElementById('ai-settings-button');
    const aiSettingsModal = document.getElementById('ai-settings-modal');
    const closeAiSettingsButton = document.getElementById('close-ai-settings-button');
    const saveAiSettingsButton = document.getElementById('save-ai-settings');
    const resetAiSettingsButton = document.getElementById('reset-ai-settings');
    if (!aiSettingsButton || !aiSettingsModal) return;
    const config = getAiConfig();
    const baseUrlInput = document.getElementById('ai-api-base-url');
    const apiKeyInput = document.getElementById('ai-api-key');
    const modelInput = document.getElementById('ai-api-model');
    if (baseUrlInput) baseUrlInput.value = config.baseUrl;
    if (apiKeyInput) apiKeyInput.value = config.apiKey;
    if (modelInput) modelInput.value = config.model;
    aiSettingsButton.addEventListener('click', () => {
        showModal('ai-settings-modal');
    });
    if (closeAiSettingsButton) {
        closeAiSettingsButton.addEventListener('click', () => {
            hideModal('ai-settings-modal');
        });
    }
    const modelDropdownBtn = document.getElementById('ai-model-dropdown-btn');
    const modelDropdown = document.getElementById('ai-model-dropdown');
    const modelDropdownIcon = modelDropdownBtn?.querySelector('i');
    async function refreshModelsList() {
        const refreshBtn = document.getElementById('ai-model-refresh-btn');
        if (refreshBtn) {
            refreshBtn.style.display = 'none';
        }
        const config = {
            baseUrl: baseUrlInput?.value || DEFAULT_CONFIG.baseUrl,
            apiKey: apiKeyInput?.value || '',
            model: modelInput?.value || DEFAULT_CONFIG.model
        };
        const result = await fetchModels(config);
        const modelsContainer = modelDropdown.querySelector('.models-container');
        if (result.success && result.models.length > 0) {
            modelsContainer.innerHTML = result.models.map(model => 
                `<button class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md model-option" data-model="${model}">${model}</button>`
            ).join('');
        } else {
            modelsContainer.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-left">' + (i18n && i18n.t ? i18n.t('aiApiModelsFailed') : '无法获取模型列表') + '</div>';
        }
        if (refreshBtn) {
            refreshBtn.style.display = 'block';
        }
        modelDropdown.querySelectorAll('.model-option').forEach(option => {
            option.addEventListener('click', () => {
                const model = option.dataset.model;
                if (modelInput) {
                    modelInput.value = model;
                }
                DropdownStateManager.hide(modelDropdown, modelDropdownIcon);
            });
        });
    }
    if (modelDropdownBtn && modelDropdown) {
        modelDropdownBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            DropdownStateManager.toggle(modelDropdown, modelDropdownIcon);
            if (DropdownStateManager.isVisible(modelDropdown)) {
                await refreshModelsList();
            }
        });
        const refreshBtn = document.getElementById('ai-model-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const modelsContainer = modelDropdown.querySelector('.models-container');
                modelsContainer.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-start gap-2"><i class="fa-solid fa-spinner fa-spin"></i><span>' + (i18n && i18n.t ? i18n.t('aiApiLoading') : '加载中...') + '</span></div>';
                await refreshModelsList();
            });
        }
        document.addEventListener('click', (e) => {
            if (!modelDropdown.contains(e.target) && !modelDropdownBtn.contains(e.target)) {
                DropdownStateManager.hide(modelDropdown, modelDropdownIcon);
            }
        });
    }
    if (saveAiSettingsButton) {
        saveAiSettingsButton.addEventListener('click', () => {
            const newConfig = {
                baseUrl: baseUrlInput?.value || DEFAULT_CONFIG.baseUrl,
                apiKey: apiKeyInput?.value || '',
                model: modelInput?.value || DEFAULT_CONFIG.model
            };
            const errors = validateAiConfig(newConfig);
            if (errors.length > 0) {
                let errorMsg = '';
                errors.forEach(err => {
                    errorMsg += (i18n && i18n.t ? i18n.t(err) : err) + '\n';
                });
                alert(errorMsg);
                return;
            }
            if (saveAiConfig(newConfig)) {
                ButtonStateManager.flashState(saveAiSettingsButton, {
                    className: 'px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors flex items-center justify-center gap-2 w-[100px]',
                    icon: 'fa-solid fa-check',
                    text: i18n && i18n.t ? i18n.t('aiApiSaved') : '已保存',
                    dataI18n: 'aiApiSaved'
                });
            } else {
                alert(i18n && i18n.t ? i18n.t('aiApiSettingsSaveFailed') : 'AI设置保存失败！');
            }
        });
    }
    if (resetAiSettingsButton) {
        resetAiSettingsButton.addEventListener('click', () => {
            if (confirm(i18n && i18n.t ? i18n.t('aiApiConfirmReset') : '确定要重置AI设置吗？')) {
                saveAiConfig(DEFAULT_CONFIG);
                baseUrlInput.value = DEFAULT_CONFIG.baseUrl;
                apiKeyInput.value = DEFAULT_CONFIG.apiKey;
                modelInput.value = DEFAULT_CONFIG.model;
                resetCheckBtn();
            }
        });
    }
    const checkAiApiBtn = document.getElementById('check-ai-api-btn');
    function resetCheckBtn() {
        if (checkAiApiBtn) {
            ButtonStateManager.reset(checkAiApiBtn);
        }
    }
    if (baseUrlInput) {
        baseUrlInput.addEventListener('input', resetCheckBtn);
    }
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', resetCheckBtn);
    }
    if (modelInput) {
        modelInput.addEventListener('input', resetCheckBtn);
    }
    if (checkAiApiBtn) {
        checkAiApiBtn.addEventListener('click', async () => {
            const config = {
                baseUrl: baseUrlInput?.value || DEFAULT_CONFIG.baseUrl,
                apiKey: apiKeyInput?.value || '',
                model: modelInput?.value || DEFAULT_CONFIG.model
            };
            ButtonStateManager.setState(checkAiApiBtn, 'loading');
            const result = await checkAiApiAvailability(config);
            if (result.success) {
                ButtonStateManager.setState(checkAiApiBtn, 'success');
            } else {
                ButtonStateManager.setState(checkAiApiBtn, 'error', result.message);
            }
        });
    }
}
async function checkAiApiAvailability(config) {
    try {
        if (!config.baseUrl || !config.apiKey) {
            return {
                success: false,
                message: i18n && i18n.t ? i18n.t('aiApiMissingConfig') : '缺少必要配置'
            };
        }
        const response = await fetch(`${config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: 'ping' }],
                max_tokens: 1
            }),
            timeout: 10000
        });
        if (response.ok) {
            return { success: true };
        } else {
            let errorMsg = (i18n && i18n.t ? i18n.t('aiApiUnavailable') : 'API不可用');
            try {
                const data = await response.json();
                if (data.error && data.error.message) {
                    errorMsg = data.error.message;
                }
            } catch (e) {
                errorMsg = (i18n && i18n.t ? i18n.t('aiApiRequestFailed') : '请求失败');
            }
            return {
                success: false,
                message: errorMsg
            };
        }
    } catch (e) {
        return {
            success: false,
            message: (i18n && i18n.t ? i18n.t('aiApiNetworkError') : '网络错误') + ': ' + e.message
        };
    }
}
async function sendGameAnalysisRequest(gameState, language) {
    const aiConfig = getAiConfig();
    const errors = validateAiConfig(aiConfig);
    if (errors.length > 0) {
        return {
            success: false,
            error: errors[0],
            errors: errors
        };
    }
    try {
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
        const messages = [
            {
                role: 'system',
                content: 'You are an expert 2048 game analyst. Analyze the game state and return ONLY a valid JSON object as output.\n\nSTRICT OUTPUT FORMAT REQUIREMENTS:\n- Your entire response must be a single JSON object. No extra text, no explanations, no markdown code blocks, no ```json``` wrappers.\n- The JSON object MUST contain exactly these 6 keys with the following constraints:\n\n1. "bestMove" (string, REQUIRED): MUST be exactly ONE of these 4 exact lowercase values: "up" | "down" | "left" | "right". ABSOLUTELY NO other values allowed. Do NOT return arrays, multiple directions separated by commas or slashes, "none", "any", "unknown", "N/A", empty string, or any value outside the four listed above. If you are uncertain, still choose the single most likely direction among the four.\n\n2. "mergeOpportunities" (integer, REQUIRED): A non-negative integer (0, 1, 2, ...) counting the possible tile merges on the current grid.\n\n3. "gameStateAssessment" (string, REQUIRED): MUST be exactly ONE of: "safe" | "warning" | "danger". No other values.\n\n4. "scorePotential" (string, REQUIRED): MUST be exactly ONE of: "high" | "medium" | "low". No other values.\n\n5. "aiSuggestion" (string, REQUIRED): A detailed strategic recommendation written in the user\'s language. Explain why the chosen bestMove is optimal.\n\n6. "confidence" (number, REQUIRED): A float between 0.0 and 1.0 inclusive representing your confidence in the bestMove recommendation.\n\nUSER LANGUAGE REQUIREMENT: The user\'s language is: ' + language + '. The entire "aiSuggestion" string MUST be written in this language. Do NOT mix languages.\n\nFINAL REMINDER: Return ONLY the raw JSON object. Do not wrap it in any other formatting.\n'
            },
            {
                role: 'user',
                content: 'Analyze this 2048 game state and return ONLY a JSON object.\nGame data: ' + JSON.stringify(gameData)
            }
        ];
        const requestBody = {
            model: aiConfig.model,
            messages: messages
        };
        const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiConfig.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                success: false,
                error: 'aiApiRequestFailed',
                status: response.status,
                message: errorData?.error?.message || response.statusText
            };
        }
        const data = await response.json();
        const messageContent = data.choices?.[0]?.message?.content || '';
        console.log('[AI Raw Response]', messageContent);
        let parsedResult;
        try {
            let jsonStr = messageContent.trim();
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
            }
            parsedResult = JSON.parse(jsonStr);
        } catch (e) {
            return {
                success: false,
                error: 'aiApiParseError',
                message: messageContent.substring(0, 200)
            };
        }
        return {
            success: true,
            data: parsedResult,
            rawMessage: messageContent
        };
    } catch (e) {
        console.error('Game analysis request error:', e);
        return {
            success: false,
            error: 'aiApiNetworkError',
            message: e.message
        };
    }
}
if (typeof window !== 'undefined') {
    window.aiRequest = {
        version: aiRequestVersion,
        getConfig: getAiConfig,
        saveConfig: saveAiConfig,
        validateConfig: validateAiConfig,
        sendRequest: sendAiRequest,
        sendGameAnalysis: sendGameAnalysisRequest,
        setupSettings: setupAiRequestSettings
    };
    window.aiRequestModuleLoaded = true;
}