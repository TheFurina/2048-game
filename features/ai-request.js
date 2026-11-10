const aiRequestVersion = '1.5-fix.1';
window.aiRequestVersion = aiRequestVersion;
const aiRequestDomTemplates = {"#module-dom-root": "        <div id=\"ai-settings-modal\" data-no-autofocus=\"true\" class=\"fixed inset-0 flex items-center justify-center bg-black/50 z-[1100] hidden\" role=\"dialog\" aria-labelledby=\"ai-settings-modal-title\" aria-modal=\"true\">\n            <div class=\"bg-gray-50 dark:bg-dark-surface rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-visible text-center shadow-xl transform transition-all duration-300 scale-95 opacity-0\">\n                <h2 id=\"ai-settings-modal-title\" class=\"text-2xl font-bold text-secondary dark:text-dark-text mb-4\" data-i18n=\"aiApiSettingsItem\"></h2>\n                <div class=\"flex flex-col gap-4\">\n                    <div class=\"text-left\">\n                        <label for=\"ai-api-base-url\" class=\"block text-sm font-medium text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"aiApiBaseUrl\"></label>\n                        <input type=\"text\" id=\"ai-api-base-url\" class=\"w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm\" placeholder=\"https://api.openai.com/v1\">\n                    </div>\n                    <div class=\"text-left\">\n                        <label for=\"ai-api-key\" class=\"block text-sm font-medium text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"aiApiKey\"></label>\n                        <input type=\"password\" id=\"ai-api-key\" class=\"w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm\" placeholder=\"sk-...\">\n                    </div>\n                    <div class=\"text-left\">\n                        <label for=\"ai-api-model\" class=\"block text-sm font-medium text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"aiApiModel\"></label>\n                        <div class=\"relative\">\n                            <input type=\"text\" id=\"ai-api-model\" class=\"w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm pr-10\" placeholder=\"gpt-4o-mini\">\n                            <button id=\"ai-model-dropdown-btn\" class=\"absolute right-0 top-0 h-full px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors\">\n                                <i class=\"fa-solid fa-chevron-down transition-transform duration-300\"></i>\n                            </button>\n                            <div id=\"ai-model-dropdown\" class=\"absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-[60] max-h-[200px] opacity-0 pointer-events-none overflow-hidden transition-all duration-300 ease-in-out\">\n                                <button id=\"ai-model-refresh-btn\" class=\"absolute top-1 right-2.5 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md transition-all z-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600\" title=\"刷新\">\n                                    <i class=\"fa-solid fa-rotate-right\"></i>\n                                </button>\n                                <div class=\"models-container p-1 overflow-y-auto max-h-48\">\n                                    <div class=\"px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-start gap-2\">\n                                        <i class=\"fa-solid fa-spinner fa-spin\"></i>\n                                        <span data-i18n=\"aiApiLoading\"></span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <button id=\"check-ai-api-btn\" class=\"w-full px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words\"><i class=\"fa-solid fa-circle-check flex-shrink-0\"></i><span data-i18n=\"aiApiCheck\"></span></button>\n                <div class=\"flex justify-center gap-2 mt-6\">\n                    <button id=\"reset-ai-settings\" class=\"px-6 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 min-w-[80px]\"><i class=\"fa-solid fa-rotate-right\"></i><span data-i18n=\"reset\"></span></button>\n                    <button id=\"save-ai-settings\" class=\"px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm transition-colors flex items-center justify-center gap-2 w-[100px]\"><i class=\"fa-solid fa-floppy-disk\"></i><span data-i18n=\"save\"></span></button>\n                </div>\n                <button id=\"close-ai-settings-button\" class=\"text-secondary/60 hover:text-secondary focus:outline-none absolute top-5 right-8 text-xl dark:text-dark-muted dark:hover:text-white\" title=\"关闭设置\">\n                    <i class=\"fa-solid fa-times\"></i>\n                </button>\n            </div>\n        </div>", "#settings-module-ai": "                            <button id=\"ai-settings-button\" class=\"flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 rounded-lg\">\n                                <span class=\"flex items-center\">\n                                    <i class=\"fa-solid fa-gear w-5 mr-2\"></i>\n                                    <span data-i18n=\"aiApiSettingsItem\"></span>\n                                </span>\n                                <i class=\"fa-solid fa-chevron-right text-xs\"></i>\n                            </button>\n                            <div class=\"border-b border-gray-200 dark:border-gray-700 my-1 mx-2\"></div>"};
const DEFAULT_CONFIG = {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o-mini'
};
function getAiConfig() {
    try {
        const saved = localStorage.getItem('2048-setting-ai-config');
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
        localStorage.setItem('2048-setting-ai-config', JSON.stringify(config));
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
            dataI18n: 'aiApiCheck',
            disabled: false
        },
        loading: {
            className: 'w-full px-4 py-2 text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words',
            icon: 'fa-spinner fa-spin',
            textKey: 'aiApiChecking',
            dataI18n: 'aiApiChecking',
            disabled: true
        },
        success: {
            className: 'w-full px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words',
            icon: 'fa-circle-check',
            textKey: 'aiApiAvailable',
            dataI18n: 'aiApiAvailable',
            disabled: false
        },
        error: {
            className: 'w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-4 whitespace-normal break-words',
            icon: 'fa-circle-exclamation',
            textKey: 'aiApiUnavailable',
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
        const text = customText || i18n.t(state.textKey);
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
            modelsContainer.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-left">' + (i18n.t('aiApiModelsFailed')) + '</div>';
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
                modelsContainer.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-start gap-2"><i class="fa-solid fa-spinner fa-spin"></i><span>' + (i18n.t('aiApiLoading')) + '</span></div>';
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
                    text: i18n.t('aiApiSaved'),
                    dataI18n: 'aiApiSaved'
                });
            } else {
                alert(i18n.t('aiApiSettingsSaveFailed'));
            }
        });
    }
    if (resetAiSettingsButton) {
        resetAiSettingsButton.addEventListener('click', () => {
            if (confirm(i18n.t('aiApiConfirmReset'))) {
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
                message: i18n.t('aiApiMissingConfig')
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
            let errorMsg = (i18n.t('aiApiUnavailable'));
            try {
                const data = await response.json();
                if (data.error && data.error.message) {
                    errorMsg = data.error.message;
                }
            } catch (e) {
                errorMsg = (i18n.t('aiApiRequestFailed'));
            }
            return {
                success: false,
                message: errorMsg
            };
        }
    } catch (e) {
        return {
            success: false,
            message: (i18n.t('aiApiNetworkError')) + ': ' + e.message
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
        setupSettings: setupAiRequestSettings,
        domTemplates: aiRequestDomTemplates,
        isDomReady: function () {
            return !!document.getElementById('ai-settings-modal') && !!document.getElementById('ai-settings-button');
        }
    };
    window.aiRequestModuleLoaded = true;
}