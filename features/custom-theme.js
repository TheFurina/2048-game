const customThemeVersion = '1.2';
window.customThemeVersion = customThemeVersion;
const tileValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
const themeFieldConfig = [
    { id: 'bgColor', elementId: 'custom-bg-color', opacityId: 'custom-bg-opacity', category: 'base', default: '#faf8ef', defaultOpacity: '100' },
    { id: 'primaryColor', elementId: 'custom-primary-color', opacityId: 'custom-primary-opacity', category: 'base', default: '#faa31b', defaultOpacity: '100' },
    { id: 'secondaryColor', elementId: 'custom-secondary-color', opacityId: 'custom-secondary-opacity', category: 'base', default: '#8f7a66', defaultOpacity: '100' },
    { id: 'gridColor', elementId: 'custom-grid-color', opacityId: 'custom-grid-opacity', category: 'base', default: '#bbada0', defaultOpacity: '100' },
    { id: 'cellEmptyColor', elementId: 'custom-cell-empty-color', opacityId: 'custom-cell-empty-opacity', category: 'base', default: '#cdc1b4', defaultOpacity: '100' },
    { id: 'scrollbarColor', elementId: 'custom-scrollbar-color', opacityId: 'custom-scrollbar-opacity', category: 'base', default: '#bbbbbb', defaultOpacity: '100' },
    { id: 'modalBgColor', elementId: 'custom-modal-bg', opacityId: 'custom-modal-bg-opacity', category: 'modal', default: '#ffffff', defaultOpacity: '100' },
    { id: 'modalTextColor', elementId: 'custom-modal-text', opacityId: 'custom-modal-text-opacity', category: 'modal', default: '#000000', defaultOpacity: '100' }
];
const tileDefaultColors = {
    2: { bg: '#eee4da', text: '#776e65' },
    4: { bg: '#ede0c8', text: '#776e65' },
    8: { bg: '#f2b179', text: '#f9f6f2' },
    16: { bg: '#f59563', text: '#f9f6f2' },
    32: { bg: '#f67c5f', text: '#f9f6f2' },
    64: { bg: '#f65e3b', text: '#f9f6f2' },
    128: { bg: '#edcf72', text: '#f9f6f2' },
    256: { bg: '#edcc61', text: '#f9f6f2' },
    512: { bg: '#edc850', text: '#f9f6f2' },
    1024: { bg: '#edc53f', text: '#f9f6f2' },
    2048: { bg: '#edc22e', text: '#f9f6f2' },
    4096: { bg: '#e65100', text: '#ffffff' },
    8192: { bg: '#bf360c', text: '#ffffff' },
    16384: { bg: '#880e4f', text: '#ffffff' },
    32768: { bg: '#4a148c', text: '#ffffff' },
    'super': { bg: '#311b92', text: '#ffffff' }
};
function getThemeFieldConfig() {
    const config = [...themeFieldConfig];
    tileValues.forEach(value => {
        config.push(
            { id: `tile${value}Bg`, elementId: `custom-tile-${value}-bg`, category: 'tile', default: tileDefaultColors[value].bg },
            { id: `tile${value}Text`, elementId: `custom-tile-${value}-text`, category: 'tile', default: tileDefaultColors[value].text }
        );
    });
    config.push(
        { id: 'tileSuperBg', elementId: 'custom-tile-super-bg', category: 'tile', default: tileDefaultColors.super.bg },
        { id: 'tileSuperText', elementId: 'custom-tile-super-text', category: 'tile', default: tileDefaultColors.super.text }
    );
    return config;
}
function readThemeValues() {
    const values = {};
    const config = getThemeFieldConfig();
    config.forEach(field => {
        const element = document.getElementById(field.elementId);
        if (element) {
            values[field.id] = element.value;
        }
        if (field.opacityId) {
            const opacityElement = document.getElementById(field.opacityId);
            if (opacityElement) {
                values[`${field.id}Opacity`] = opacityElement.value;
            }
        }
    });
    return values;
}
function writeThemeValues(values) {
    const config = getThemeFieldConfig();
    config.forEach(field => {
        if (values[field.id] !== undefined) {
            const element = document.getElementById(field.elementId);
            const textElement = document.getElementById(`${field.elementId}-text`);
            if (element) element.value = values[field.id];
            if (textElement) textElement.value = values[field.id];
        }
        if (field.opacityId && values[`${field.id}Opacity`] !== undefined) {
            const opacityElement = document.getElementById(field.opacityId);
            const opacityValueElement = document.getElementById(`${field.opacityId}-value`);
            if (opacityElement) opacityElement.value = values[`${field.id}Opacity`];
            if (opacityValueElement) opacityValueElement.textContent = values[`${field.id}Opacity`] + '%';
        }
    });
}
function getDefaultThemeValues() {
    const defaults = {};
    const config = getThemeFieldConfig();
    config.forEach(field => {
        if (field.default !== undefined) {
            defaults[field.id] = field.default;
        }
        if (field.defaultOpacity !== undefined) {
            defaults[`${field.id}Opacity`] = field.defaultOpacity;
        }
    });
    return defaults;
}
function generateThemeCSS(values, selector = 'body.bg-bg') {
    const config = getThemeFieldConfig();
    let css = `${selector} { background-color: ${values.bgColor}${opacityToHex(values.bgOpacity)} !important; color: ${values.secondaryColor}${opacityToHex(values.secondaryOpacity)} !important; }\n`;
    css += `${selector} .bg-bg { background-color: ${values.bgColor}${opacityToHex(values.bgOpacity)} !important; }\n`;
    css += `${selector} .text-secondary { color: ${values.secondaryColor}${opacityToHex(values.secondaryOpacity)} !important; }\n`;
    css += `${selector} .text-secondary\\/80 { color: ${values.secondaryColor}${opacityToHex(Math.round(parseInt(values.secondaryOpacity) * 0.8))} !important; }\n`;
    css += `${selector} .bg-grid { background-color: ${values.gridColor}${opacityToHex(values.gridOpacity)} !important; }\n`;
    css += `${selector} .bg-primary { background-color: ${values.primaryColor}${opacityToHex(values.primaryOpacity)} !important; }\n`;
    css += `${selector} .bg-secondary { background-color: ${values.secondaryColor}${opacityToHex(values.secondaryOpacity)} !important; }\n`;
    tileValues.forEach(value => {
        const bgKey = `tile${value}Bg`;
        const textKey = `tile${value}Text`;
        if (values[bgKey] && values[textKey]) {
            css += `${selector} .tile-${value} { background-color: ${values[bgKey]} !important; color: ${values[textKey]} !important; }\n`;
        }
    });
    if (values.tileSuperBg && values.tileSuperText) {
        css += `${selector} .tile-super { background-color: ${values.tileSuperBg} !important; color: ${values.tileSuperText} !important; }\n`;
    }
    css += `${selector} ::-webkit-scrollbar-track { background: ${values.bgColor}${opacityToHex(values.bgOpacity)} !important; }\n`;
    css += `${selector} ::-webkit-scrollbar-thumb { background: ${values.scrollbarColor}${opacityToHex(values.scrollbarOpacity)} !important; }\n`;
    return css;
}
function generatePreviewCSS(values) {
    let css = `body[data-preview="true"] { background-color: ${values.bgColor}${opacityToHex(values.bgOpacity)} !important; color: ${values.secondaryColor}${opacityToHex(values.secondaryOpacity)} !important; }\n`;
    css += `body[data-preview="true"] .bg-bg { background-color: ${values.bgColor}${opacityToHex(values.bgOpacity)} !important; }\n`;
    css += `body[data-preview="true"] .text-secondary { color: ${values.secondaryColor}${opacityToHex(values.secondaryOpacity)} !important; }\n`;
    css += `body[data-preview="true"] .text-secondary\\/80 { color: ${values.secondaryColor}${opacityToHex(Math.round(parseInt(values.secondaryOpacity) * 0.8))} !important; }\n`;
    css += `body[data-preview="true"] .bg-grid { background-color: ${values.gridColor}${opacityToHex(values.gridOpacity)} !important; }\n`;
    css += `body[data-preview="true"] .bg-primary { background-color: ${values.primaryColor}${opacityToHex(values.primaryOpacity)} !important; }\n`;
    css += `body[data-preview="true"] .bg-secondary { background-color: ${values.secondaryColor}${opacityToHex(values.secondaryOpacity)} !important; }\n`;
    tileValues.forEach(value => {
        const bgKey = `tile${value}Bg`;
        const textKey = `tile${value}Text`;
        if (values[bgKey] && values[textKey]) {
            css += `body[data-preview="true"] .tile-${value} { background-color: ${values[bgKey]} !important; color: ${values[textKey]} !important; }\n`;
        }
    });
    if (values.tileSuperBg && values.tileSuperText) {
        css += `body[data-preview="true"] .tile-super { background-color: ${values.tileSuperBg} !important; color: ${values.tileSuperText} !important; }\n`;
    }
    css += `body[data-preview="true"] ::-webkit-scrollbar-track { background: ${values.bgColor}${opacityToHex(values.bgOpacity)} !important; }\n`;
    css += `body[data-preview="true"] ::-webkit-scrollbar-thumb { background: ${values.scrollbarColor}${opacityToHex(values.scrollbarOpacity)} !important; }\n`;
    css += `body[data-preview="true"] .ai-analysis-modal { background: rgba(0, 0, 0, 0.5) !important; }\n`;
    css += `body[data-preview="true"] .ai-analysis-content { background: ${values.modalBgColor}${opacityToHex(values.modalBgOpacity)} !important; color: ${values.modalTextColor}${opacityToHex(values.modalTextOpacity)} !important; }\n`;
    return css;
}
function opacityToHex(opacity) {
    if (!opacity) return 'ff';
    const value = parseInt(opacity, 10);
    return Math.floor((value / 100) * 255).toString(16).padStart(2, '0');
}
function setupThemeCustomizer() {
    localStorage.removeItem('themeExportSelection');
    const customThemeModal = document.getElementById('custom-theme-modal');
    if (!customThemeModal) return;
    const closeButton = document.getElementById('close-custom-theme-modal');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            hideModal('custom-theme-modal');
            removePreviewStyles();
        });
    }
    const colorInputs = document.querySelectorAll('input[type="color"]');
    const textInputs = document.querySelectorAll('input[type="text"]');
    colorInputs.forEach(colorInput => {
        const textInputId = colorInput.id + '-text';
        const textInput = document.getElementById(textInputId);
        if (textInput) {
            colorInput.addEventListener('input', function() {
                textInput.value = this.value;
                parseOpacityFromColor(this.value, this.id.replace('custom-', 'custom-').replace('-color', '-opacity'));
                previewCustomTheme();
            });
            textInput.addEventListener('input', function() {
                if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(this.value)) {
                    colorInput.value = this.value;
                    parseOpacityFromColor(this.value, colorInput.id.replace('-color', '-opacity'));
                    previewCustomTheme();
                }
            });
        }
    });
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(rangeInput => {
        const valueDisplay = document.getElementById(rangeInput.id + '-value');
        if (valueDisplay) {
            rangeInput.addEventListener('input', function() {
                valueDisplay.textContent = this.value + '%';
                previewCustomTheme();
            });
        }
    });
    const resetButton = document.getElementById('reset-custom-theme');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetCustomTheme();
        });
    }
    const saveButton = document.getElementById('save-custom-theme');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveCustomTheme();
        });
    }
    const actionsBtn = document.getElementById('theme-actions-btn');
    const actionsBubble = document.getElementById('theme-actions-bubble');
    let isBubbleVisible = false;
    actionsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        isBubbleVisible = !isBubbleVisible;
        if (isBubbleVisible) {
            actionsBubble.classList.remove('opacity-0', 'invisible', 'translate-y-2');
            actionsBubble.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            actionsBubble.classList.remove('opacity-100', 'visible', 'translate-y-0');
            actionsBubble.classList.add('opacity-0', 'invisible', 'translate-y-2');
        }
    });
    customThemeModal.addEventListener('click', function(e) {
        if (e.target !== actionsBtn && !actionsBtn.contains(e.target) && e.target !== actionsBubble && !actionsBubble.contains(e.target)) {
            isBubbleVisible = false;
            actionsBubble.classList.remove('opacity-100', 'visible', 'translate-y-0');
            actionsBubble.classList.add('opacity-0', 'invisible', 'translate-y-2');
        }
    });
    actionsBubble.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            isBubbleVisible = false;
            actionsBubble.classList.remove('opacity-100', 'visible', 'translate-y-0');
            actionsBubble.classList.add('opacity-0', 'invisible', 'translate-y-2');
            const btnId = this.id;
            if (btnId === 'export-custom-theme') {
                exportCustomTheme();
            } else if (btnId === 'import-custom-theme') {
                importCustomTheme();
            }
        });
    });
}
function previewCustomTheme() {
    const values = readThemeValues();
    let previewStyleElement = document.getElementById('preview-theme-styles');
    if (!previewStyleElement) {
        previewStyleElement = document.createElement('style');
        previewStyleElement.id = 'preview-theme-styles';
        document.head.appendChild(previewStyleElement);
    }
    previewStyleElement.textContent = generatePreviewCSS(values);
    document.body.setAttribute('data-preview', 'true');
}
function removePreviewStyles() {
    const previewStyleElement = document.getElementById('preview-theme-styles');
    if (previewStyleElement) {
        previewStyleElement.remove();
    }
    document.body.removeAttribute('data-preview');
    const currentTheme = localStorage.getItem('2048-theme');
    if (currentTheme === 'custom') {
        loadCustomTheme();
    }
}
function parseOpacityFromColor(color, opacityInputId) {
    if (color.length === 9) {
        const alphaHex = color.slice(7, 9);
        const alphaValue = parseInt(alphaHex, 16);
        const opacityPercent = Math.round((alphaValue / 255) * 100);
        const opacityInput = document.getElementById(opacityInputId);
        const opacityValueDisplay = document.getElementById(opacityInputId + '-value');
        if (opacityInput && opacityValueDisplay) {
            opacityInput.value = opacityPercent;
            opacityValueDisplay.textContent = opacityPercent + '%';
        }
        return opacityPercent;
    } else {
        const opacityInput = document.getElementById(opacityInputId);
        return opacityInput ? opacityInput.value : 100;
    }
}
function resetCustomTheme() {
    const defaults = getDefaultThemeValues();
    writeThemeValues(defaults);
}
function saveCustomTheme() {
    const themeData = readThemeValues();
    themeData.timestamp = new Date().getTime();
    localStorage.setItem('customTheme', JSON.stringify(themeData));
    localStorage.setItem('2048-theme', 'custom');
    alert(i18n.t('themeSaved'));
}
function exportCustomTheme() {
    const exportModal = document.getElementById('export-theme-modal');
    const optionsContainer = document.getElementById('theme-export-options');
    const selectAllCheckbox = document.getElementById('select-all-theme-items');
    optionsContainer.innerHTML = '';
    const config = getThemeFieldConfig();
    const themeItems = config.map(field => ({
        id: field.id,
        elementId: field.elementId,
        label: i18n.t(field.id)
    }));
    const savedState = JSON.parse(localStorage.getItem('themeExportSelection'));
    themeItems.forEach(item => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'flex items-center gap-2';
        const isChecked = savedState ? (savedState[item.id] !== undefined ? savedState[item.id] : true) : true;
        optionDiv.innerHTML = `
            <input type="checkbox" id="export-${item.id}" class="theme-export-checkbox w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:bg-dark-surface dark:border-dark-muted" ${isChecked ? 'checked' : ''}>
            <label for="export-${item.id}" class="text-sm text-gray-700 dark:text-dark-text">${item.label}</label>
        `;
        optionsContainer.appendChild(optionDiv);
    });
    const updateSelectAllState = function() {
        const checkboxes = document.querySelectorAll('.theme-export-checkbox');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        selectAllCheckbox.checked = allChecked;
    };
    selectAllCheckbox.checked = savedState ? (savedState.selectAll !== undefined ? savedState.selectAll : true) : true;
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.theme-export-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
    optionsContainer.addEventListener('change', updateSelectAllState);
    const saveAndClose = function() {
        const selectionState = { selectAll: selectAllCheckbox.checked };
        themeItems.forEach(item => {
            const checkbox = document.getElementById(`export-${item.id}`);
            selectionState[item.id] = checkbox.checked;
        });
        localStorage.setItem('themeExportSelection', JSON.stringify(selectionState));
        hideModal('export-theme-modal');
    };
    showModal('export-theme-modal');
    document.getElementById('cancel-export-theme').addEventListener('click', saveAndClose);
    document.getElementById('close-export-theme-modal').addEventListener('click', saveAndClose);
    document.getElementById('confirm-export-theme').addEventListener('click', function() {
        try {
            const themeData = { timestamp: new Date().getTime() };
            const currentValues = readThemeValues();
            themeItems.forEach(item => {
                const checkbox = document.getElementById(`export-${item.id}`);
                if (checkbox.checked) {
                    if (currentValues[item.id] !== undefined) {
                        themeData[item.id] = currentValues[item.id];
                    }
                    const opacityId = `${item.id}Opacity`;
                    if (currentValues[opacityId] !== undefined) {
                        themeData[opacityId] = currentValues[opacityId];
                    }
                }
            });
            const dataStr = JSON.stringify(themeData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `2048-custom-theme-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            saveAndClose();
        } catch (e) {
            console.error('Export failed:', e);
            alert(i18n.t('exportFailed') + e.message);
            saveAndClose();
        }
    });
}
function importCustomTheme() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const themeData = JSON.parse(e.target.result);
                if (!themeData || typeof themeData !== 'object') {
                    throw new Error(i18n.t('invalidThemeFile'));
                }
                writeThemeValues(themeData);
                previewCustomTheme();
                alert(i18n.t('themeImported'));
            } catch (e) {
                console.error('Import failed:', e);
                alert(i18n.t('importFailed') + e.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
function loadCustomTheme() {
    const customTheme = localStorage.getItem('customTheme');
    if (!customTheme) return;
    try {
        const themeData = JSON.parse(customTheme);
        let styleElement = document.getElementById('custom-theme-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'custom-theme-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = generateThemeCSS(themeData);
        document.body.setAttribute('data-theme', 'custom');
    } catch (e) {
        console.error('Failed to load custom theme:', e);
        localStorage.removeItem('customTheme');
        localStorage.setItem('2048-theme', 'light');
    }
}