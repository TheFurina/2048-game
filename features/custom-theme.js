const customThemeVersion = '0.1';
window.customThemeVersion = customThemeVersion;
function setupThemeCustomizer() {
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
            previewCustomTheme();
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
    const bgColorInput = document.getElementById('custom-bg-color');
    const bgColor = bgColorInput.value;
    const bgOpacity = parseOpacityFromColor(bgColor, 'custom-bg-opacity');
    const primaryColorInput = document.getElementById('custom-primary-color');
    const primaryColor = primaryColorInput.value;
    const primaryOpacity = parseOpacityFromColor(primaryColor, 'custom-primary-opacity');
    const secondaryColorInput = document.getElementById('custom-secondary-color');
    const secondaryColor = secondaryColorInput.value;
    const secondaryOpacity = parseOpacityFromColor(secondaryColor, 'custom-secondary-opacity');
    const gridColorInput = document.getElementById('custom-grid-color');
    const gridColor = gridColorInput.value;
    const gridOpacity = parseOpacityFromColor(gridColor, 'custom-grid-opacity');
    const cellEmptyColorInput = document.getElementById('custom-cell-empty-color');
    const cellEmptyColor = cellEmptyColorInput.value;
    const cellEmptyOpacity = parseOpacityFromColor(cellEmptyColor, 'custom-cell-empty-opacity');
    const scrollbarColorInput = document.getElementById('custom-scrollbar-color');
    const scrollbarColor = scrollbarColorInput.value;
    const scrollbarOpacity = parseOpacityFromColor(scrollbarColor, 'custom-scrollbar-opacity');
    const modalBgColorInput = document.getElementById('custom-modal-bg');
    const modalBgColor = modalBgColorInput.value;
    const modalBgOpacity = parseOpacityFromColor(modalBgColor, 'custom-modal-bg-opacity');
    const modalTextColorInput = document.getElementById('custom-modal-text');
    const modalTextColor = modalTextColorInput.value;
    const modalTextOpacity = parseOpacityFromColor(modalTextColor, 'custom-modal-text-opacity');
    const tile2Bg = document.getElementById('custom-tile-2-bg').value;
    const tile2Text = document.getElementById('custom-tile-2-text').value;
    const tile4Bg = document.getElementById('custom-tile-4-bg').value;
    const tile4Text = document.getElementById('custom-tile-4-text').value;
    const tile8Bg = document.getElementById('custom-tile-8-bg').value;
    const tile8Text = document.getElementById('custom-tile-8-text').value;
    const tile16Bg = document.getElementById('custom-tile-16-bg').value;
    const tile16Text = document.getElementById('custom-tile-16-text').value;
    const tile32Bg = document.getElementById('custom-tile-32-bg').value;
    const tile32Text = document.getElementById('custom-tile-32-text').value;
    const tile64Bg = document.getElementById('custom-tile-64-bg').value;
    const tile64Text = document.getElementById('custom-tile-64-text').value;
    const tile128Bg = document.getElementById('custom-tile-128-bg').value;
    const tile128Text = document.getElementById('custom-tile-128-text').value;
    const tile256Bg = document.getElementById('custom-tile-256-bg').value;
    const tile256Text = document.getElementById('custom-tile-256-text').value;
    const tile512Bg = document.getElementById('custom-tile-512-bg').value;
    const tile512Text = document.getElementById('custom-tile-512-text').value;
    const tile1024Bg = document.getElementById('custom-tile-1024-bg').value;
    const tile1024Text = document.getElementById('custom-tile-1024-text').value;
    const tile2048Bg = document.getElementById('custom-tile-2048-bg').value;
    const tile2048Text = document.getElementById('custom-tile-2048-text').value;
    const tile4096Bg = document.getElementById('custom-tile-4096-bg').value;
    const tile4096Text = document.getElementById('custom-tile-4096-text').value;
    const tile8192Bg = document.getElementById('custom-tile-8192-bg').value;
    const tile8192Text = document.getElementById('custom-tile-8192-text').value;
    const tile16384Bg = document.getElementById('custom-tile-16384-bg').value;
    const tile16384Text = document.getElementById('custom-tile-16384-text').value;
    const tile32768Bg = document.getElementById('custom-tile-32768-bg').value;
    const tile32768Text = document.getElementById('custom-tile-32768-text').value;
    const tileSuperBg = document.getElementById('custom-tile-super-bg').value;
    const tileSuperText = document.getElementById('custom-tile-super-text').value;
    let previewStyleElement = document.getElementById('preview-theme-styles');
    if (!previewStyleElement) {
        previewStyleElement = document.createElement('style');
        previewStyleElement.id = 'preview-theme-styles';
        document.head.appendChild(previewStyleElement);
    }
    const previewStyles = `
        body[data-preview="true"] {
            background-color: ${bgColor}${Math.floor(bgOpacity * 2.55).toString(16).padStart(2, '0')} !important;
            color: ${secondaryColor}${Math.floor(secondaryOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .bg-bg {
            background-color: ${bgColor}${Math.floor(bgOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .text-secondary {
            color: ${secondaryColor}${Math.floor(secondaryOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .text-secondary\/80 {
            color: ${secondaryColor}${Math.floor(secondaryOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .bg-grid {
            background-color: ${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .bg-primary {
            background-color: ${primaryColor}${Math.floor(primaryOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .bg-secondary {
            background-color: ${secondaryColor}${Math.floor(secondaryOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .tile-2 { background-color: ${tile2Bg} !important; color: ${tile2Text} !important; }
        body[data-preview="true"] .tile-4 { background-color: ${tile4Bg} !important; color: ${tile4Text} !important; }
        body[data-preview="true"] .tile-8 { background-color: ${tile8Bg} !important; color: ${tile8Text} !important; }
        body[data-preview="true"] .tile-16 { background-color: ${tile16Bg} !important; color: ${tile16Text} !important; }
        body[data-preview="true"] .tile-32 { background-color: ${tile32Bg} !important; color: ${tile32Text} !important; }
        body[data-preview="true"] .tile-64 { background-color: ${tile64Bg} !important; color: ${tile64Text} !important; }
        body[data-preview="true"] .tile-128 { background-color: ${tile128Bg} !important; color: ${tile128Text} !important; }
        body[data-preview="true"] .tile-256 { background-color: ${tile256Bg} !important; color: ${tile256Text} !important; }
        body[data-preview="true"] .tile-512 { background-color: ${tile512Bg} !important; color: ${tile512Text} !important; }
        body[data-preview="true"] .tile-1024 { background-color: ${tile1024Bg} !important; color: ${tile1024Text} !important; }
        body[data-preview="true"] .tile-2048 { background-color: ${tile2048Bg} !important; color: ${tile2048Text} !important; }
        body[data-preview="true"] .tile-4096 { background-color: ${tile4096Bg} !important; color: ${tile4096Text} !important; }
        body[data-preview="true"] .tile-8192 { background-color: ${tile8192Bg} !important; color: ${tile8192Text} !important; }
        body[data-preview="true"] .tile-16384 { background-color: ${tile16384Bg} !important; color: ${tile16384Text} !important; }
        body[data-preview="true"] .tile-32768 { background-color: ${tile32768Bg} !important; color: ${tile32768Text} !important; }
        body[data-preview="true"] .tile-super { background-color: ${tileSuperBg} !important; color: ${tileSuperText} !important; }
        body[data-preview="true"] ::-webkit-scrollbar-track {
            background: ${bgColor}${Math.floor(bgOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] ::-webkit-scrollbar-thumb {
            background: ${scrollbarColor}${Math.floor(scrollbarOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
        body[data-preview="true"] .ai-analysis-modal {
            background: rgba(0, 0, 0, 0.5) !important;
        }
        body[data-preview="true"] .ai-analysis-content {
            background: ${modalBgColor}${Math.floor(modalBgOpacity * 2.55).toString(16).padStart(2, '0')} !important;
            color: ${modalTextColor}${Math.floor(modalTextOpacity * 2.55).toString(16).padStart(2, '0')} !important;
        }
    `;
    previewStyleElement.textContent = previewStyles;
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
    document.getElementById('custom-bg-color').value = '#faf8ef';
    document.getElementById('custom-bg-color-text').value = '#faf8ef';
    document.getElementById('custom-bg-opacity').value = '100';
    document.getElementById('custom-bg-opacity-value').textContent = '100%';
    document.getElementById('custom-primary-color').value = '#faa31b';
    document.getElementById('custom-primary-color-text').value = '#faa31b';
    document.getElementById('custom-primary-opacity').value = '100';
    document.getElementById('custom-primary-opacity-value').textContent = '100%';
    document.getElementById('custom-secondary-color').value = '#8f7a66';
    document.getElementById('custom-secondary-color-text').value = '#8f7a66';
    document.getElementById('custom-secondary-opacity').value = '100';
    document.getElementById('custom-secondary-opacity-value').textContent = '100%';
    document.getElementById('custom-grid-color').value = '#bbada0';
    document.getElementById('custom-grid-color-text').value = '#bbada0';
    document.getElementById('custom-grid-opacity').value = '100';
    document.getElementById('custom-grid-opacity-value').textContent = '100%';
    document.getElementById('custom-cell-empty-color').value = '#cdc1b4';
    document.getElementById('custom-cell-empty-color-text').value = '#cdc1b4';
    document.getElementById('custom-cell-empty-opacity').value = '100';
    document.getElementById('custom-cell-empty-opacity-value').textContent = '100%';
    document.getElementById('custom-scrollbar-color').value = '#bbbbbb';
    document.getElementById('custom-scrollbar-color-text').value = '#bbbbbb';
    document.getElementById('custom-scrollbar-opacity').value = '100';
    document.getElementById('custom-scrollbar-opacity-value').textContent = '100%';
    document.getElementById('custom-modal-bg').value = '#ffffff';
    document.getElementById('custom-modal-bg-text').value = '#ffffff';
    document.getElementById('custom-modal-bg-opacity').value = '100';
    document.getElementById('custom-modal-bg-opacity-value').textContent = '100%';
    document.getElementById('custom-modal-text').value = '#000000';
    document.getElementById('custom-modal-text-text').value = '#000000';
    document.getElementById('custom-modal-text-opacity').value = '100';
    document.getElementById('custom-modal-text-opacity-value').textContent = '100%';
    document.getElementById('custom-tile-2-bg').value = '#eee4da';
    document.getElementById('custom-tile-2-bg-text').value = '#eee4da';
    document.getElementById('custom-tile-2-text').value = '#776e65';
    document.getElementById('custom-tile-2-text-text').value = '#776e65';
    document.getElementById('custom-tile-4-bg').value = '#ede0c8';
    document.getElementById('custom-tile-4-bg-text').value = '#ede0c8';
    document.getElementById('custom-tile-4-text').value = '#776e65';
    document.getElementById('custom-tile-4-text-text').value = '#776e65';
    document.getElementById('custom-tile-8-bg').value = '#f2b179';
    document.getElementById('custom-tile-8-bg-text').value = '#f2b179';
    document.getElementById('custom-tile-8-text').value = '#f9f6f2';
    document.getElementById('custom-tile-8-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-16-bg').value = '#f59563';
    document.getElementById('custom-tile-16-bg-text').value = '#f59563';
    document.getElementById('custom-tile-16-text').value = '#f9f6f2';
    document.getElementById('custom-tile-16-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-32-bg').value = '#f67c5f';
    document.getElementById('custom-tile-32-bg-text').value = '#f67c5f';
    document.getElementById('custom-tile-32-text').value = '#f9f6f2';
    document.getElementById('custom-tile-32-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-64-bg').value = '#f65e3b';
    document.getElementById('custom-tile-64-bg-text').value = '#f65e3b';
    document.getElementById('custom-tile-64-text').value = '#f9f6f2';
    document.getElementById('custom-tile-64-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-128-bg').value = '#edcf72';
    document.getElementById('custom-tile-128-bg-text').value = '#edcf72';
    document.getElementById('custom-tile-128-text').value = '#f9f6f2';
    document.getElementById('custom-tile-128-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-256-bg').value = '#edcc61';
    document.getElementById('custom-tile-256-bg-text').value = '#edcc61';
    document.getElementById('custom-tile-256-text').value = '#f9f6f2';
    document.getElementById('custom-tile-256-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-512-bg').value = '#edc850';
    document.getElementById('custom-tile-512-bg-text').value = '#edc850';
    document.getElementById('custom-tile-512-text').value = '#f9f6f2';
    document.getElementById('custom-tile-512-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-1024-bg').value = '#edc53f';
    document.getElementById('custom-tile-1024-bg-text').value = '#edc53f';
    document.getElementById('custom-tile-1024-text').value = '#f9f6f2';
    document.getElementById('custom-tile-1024-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-2048-bg').value = '#edc22e';
    document.getElementById('custom-tile-2048-bg-text').value = '#edc22e';
    document.getElementById('custom-tile-2048-text').value = '#f9f6f2';
    document.getElementById('custom-tile-2048-text-text').value = '#f9f6f2';
    document.getElementById('custom-tile-4096-bg').value = '#e65100';
    document.getElementById('custom-tile-4096-bg-text').value = '#e65100';
    document.getElementById('custom-tile-4096-text').value = '#ffffff';
    document.getElementById('custom-tile-4096-text-text').value = '#ffffff';
    document.getElementById('custom-tile-8192-bg').value = '#bf360c';
    document.getElementById('custom-tile-8192-bg-text').value = '#bf360c';
    document.getElementById('custom-tile-8192-text').value = '#ffffff';
    document.getElementById('custom-tile-8192-text-text').value = '#ffffff';
    document.getElementById('custom-tile-16384-bg').value = '#880e4f';
    document.getElementById('custom-tile-16384-bg-text').value = '#880e4f';
    document.getElementById('custom-tile-16384-text').value = '#ffffff';
    document.getElementById('custom-tile-16384-text-text').value = '#ffffff';
    document.getElementById('custom-tile-32768-bg').value = '#4a148c';
    document.getElementById('custom-tile-32768-bg-text').value = '#4a148c';
    document.getElementById('custom-tile-32768-text').value = '#ffffff';
    document.getElementById('custom-tile-32768-text-text').value = '#ffffff';
    document.getElementById('custom-tile-super-bg').value = '#311b92';
    document.getElementById('custom-tile-super-bg-text').value = '#311b92';
    document.getElementById('custom-tile-super-text').value = '#ffffff';
    document.getElementById('custom-tile-super-text-text').value = '#ffffff';
}
function saveCustomTheme() {
    const themeData = {
        bgColor: document.getElementById('custom-bg-color').value,
        bgOpacity: document.getElementById('custom-bg-opacity').value,
        primaryColor: document.getElementById('custom-primary-color').value,
        primaryOpacity: document.getElementById('custom-primary-opacity').value,
        secondaryColor: document.getElementById('custom-secondary-color').value,
        secondaryOpacity: document.getElementById('custom-secondary-opacity').value,
        gridColor: document.getElementById('custom-grid-color').value,
        gridOpacity: document.getElementById('custom-grid-opacity').value,
        cellEmptyColor: document.getElementById('custom-cell-empty-color').value,
        cellEmptyOpacity: document.getElementById('custom-cell-empty-opacity').value,
        scrollbarColor: document.getElementById('custom-scrollbar-color').value,
        scrollbarOpacity: document.getElementById('custom-scrollbar-opacity').value,
        modalBgColor: document.getElementById('custom-modal-bg').value,
        modalBgOpacity: document.getElementById('custom-modal-bg-opacity').value,
        modalTextColor: document.getElementById('custom-modal-text').value,
        modalTextOpacity: document.getElementById('custom-modal-text-opacity').value,
        tile2Bg: document.getElementById('custom-tile-2-bg').value,
        tile2Text: document.getElementById('custom-tile-2-text').value,
        tile4Bg: document.getElementById('custom-tile-4-bg').value,
        tile4Text: document.getElementById('custom-tile-4-text').value,
        tile8Bg: document.getElementById('custom-tile-8-bg').value,
        tile8Text: document.getElementById('custom-tile-8-text').value,
        tile16Bg: document.getElementById('custom-tile-16-bg').value,
        tile16Text: document.getElementById('custom-tile-16-text').value,
        tile32Bg: document.getElementById('custom-tile-32-bg').value,
        tile32Text: document.getElementById('custom-tile-32-text').value,
        tile64Bg: document.getElementById('custom-tile-64-bg').value,
        tile64Text: document.getElementById('custom-tile-64-text').value,
        tile128Bg: document.getElementById('custom-tile-128-bg').value,
        tile128Text: document.getElementById('custom-tile-128-text').value,
        tile256Bg: document.getElementById('custom-tile-256-bg').value,
        tile256Text: document.getElementById('custom-tile-256-text').value,
        tile512Bg: document.getElementById('custom-tile-512-bg').value,
        tile512Text: document.getElementById('custom-tile-512-text').value,
        tile1024Bg: document.getElementById('custom-tile-1024-bg').value,
        tile1024Text: document.getElementById('custom-tile-1024-text').value,
        tile2048Bg: document.getElementById('custom-tile-2048-bg').value,
        tile2048Text: document.getElementById('custom-tile-2048-text').value,
        tile4096Bg: document.getElementById('custom-tile-4096-bg').value,
        tile4096Text: document.getElementById('custom-tile-4096-text').value,
        tile8192Bg: document.getElementById('custom-tile-8192-bg').value,
        tile8192Text: document.getElementById('custom-tile-8192-text').value,
        tile16384Bg: document.getElementById('custom-tile-16384-bg').value,
        tile16384Text: document.getElementById('custom-tile-16384-text').value,
        tile32768Bg: document.getElementById('custom-tile-32768-bg').value,
        tile32768Text: document.getElementById('custom-tile-32768-text').value,
        tileSuperBg: document.getElementById('custom-tile-super-bg').value,
        tileSuperText: document.getElementById('custom-tile-super-text').value,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('customTheme', JSON.stringify(themeData));
    localStorage.setItem('2048-theme', 'custom');
    alert('主题保存成功！');
}
function exportCustomTheme() {
    try {
        const themeData = {
            bgColor: document.getElementById('custom-bg-color').value,
            bgOpacity: document.getElementById('custom-bg-opacity').value,
            primaryColor: document.getElementById('custom-primary-color').value,
            primaryOpacity: document.getElementById('custom-primary-opacity').value,
            secondaryColor: document.getElementById('custom-secondary-color').value,
            secondaryOpacity: document.getElementById('custom-secondary-opacity').value,
            gridColor: document.getElementById('custom-grid-color').value,
            gridOpacity: document.getElementById('custom-grid-opacity').value,
            cellEmptyColor: document.getElementById('custom-cell-empty-color').value,
            cellEmptyOpacity: document.getElementById('custom-cell-empty-opacity').value,
            scrollbarColor: document.getElementById('custom-scrollbar-color').value,
            scrollbarOpacity: document.getElementById('custom-scrollbar-opacity').value,
            modalBgColor: document.getElementById('custom-modal-bg').value,
            modalBgOpacity: document.getElementById('custom-modal-bg-opacity').value,
            modalTextColor: document.getElementById('custom-modal-text').value,
            modalTextOpacity: document.getElementById('custom-modal-text-opacity').value,
            tile2Bg: document.getElementById('custom-tile-2-bg').value,
            tile2Text: document.getElementById('custom-tile-2-text').value,
            tile4Bg: document.getElementById('custom-tile-4-bg').value,
            tile4Text: document.getElementById('custom-tile-4-text').value,
            tile8Bg: document.getElementById('custom-tile-8-bg').value,
            tile8Text: document.getElementById('custom-tile-8-text').value,
            tile16Bg: document.getElementById('custom-tile-16-bg').value,
            tile16Text: document.getElementById('custom-tile-16-text').value,
            tile32Bg: document.getElementById('custom-tile-32-bg').value,
            tile32Text: document.getElementById('custom-tile-32-text').value,
            tile64Bg: document.getElementById('custom-tile-64-bg').value,
            tile64Text: document.getElementById('custom-tile-64-text').value,
            tile128Bg: document.getElementById('custom-tile-128-bg').value,
            tile128Text: document.getElementById('custom-tile-128-text').value,
            tile256Bg: document.getElementById('custom-tile-256-bg').value,
            tile256Text: document.getElementById('custom-tile-256-text').value,
            tile512Bg: document.getElementById('custom-tile-512-bg').value,
            tile512Text: document.getElementById('custom-tile-512-text').value,
            tile1024Bg: document.getElementById('custom-tile-1024-bg').value,
            tile1024Text: document.getElementById('custom-tile-1024-text').value,
            tile2048Bg: document.getElementById('custom-tile-2048-bg').value,
            tile2048Text: document.getElementById('custom-tile-2048-text').value,
            tile4096Bg: document.getElementById('custom-tile-4096-bg').value,
            tile4096Text: document.getElementById('custom-tile-4096-text').value,
            tile8192Bg: document.getElementById('custom-tile-8192-bg').value,
            tile8192Text: document.getElementById('custom-tile-8192-text').value,
            tile16384Bg: document.getElementById('custom-tile-16384-bg').value,
            tile16384Text: document.getElementById('custom-tile-16384-text').value,
            tile32768Bg: document.getElementById('custom-tile-32768-bg').value,
            tile32768Text: document.getElementById('custom-tile-32768-text').value,
            tileSuperBg: document.getElementById('custom-tile-super-bg').value,
            tileSuperText: document.getElementById('custom-tile-super-text').value,
            timestamp: new Date().getTime()
        };
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
    } catch (e) {
        console.error('导出失败:', e);
        alert('导出失败：' + e.message);
    }
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
                if (!themeData.bgColor || !themeData.primaryColor) {
                    throw new Error('无效的主题文件');
                }
                document.getElementById('custom-bg-color').value = themeData.bgColor;
                document.getElementById('custom-bg-color-text').value = themeData.bgColor;
                document.getElementById('custom-bg-opacity').value = themeData.bgOpacity;
                document.getElementById('custom-bg-opacity-value').textContent = themeData.bgOpacity + '%';
                document.getElementById('custom-primary-color').value = themeData.primaryColor;
                document.getElementById('custom-primary-color-text').value = themeData.primaryColor;
                document.getElementById('custom-primary-opacity').value = themeData.primaryOpacity;
                document.getElementById('custom-primary-opacity-value').textContent = themeData.primaryOpacity + '%';
                document.getElementById('custom-secondary-color').value = themeData.secondaryColor;
                document.getElementById('custom-secondary-color-text').value = themeData.secondaryColor;
                document.getElementById('custom-secondary-opacity').value = themeData.secondaryOpacity;
                document.getElementById('custom-secondary-opacity-value').textContent = themeData.secondaryOpacity + '%';
                document.getElementById('custom-grid-color').value = themeData.gridColor;
                document.getElementById('custom-grid-color-text').value = themeData.gridColor;
                document.getElementById('custom-grid-opacity').value = themeData.gridOpacity;
                document.getElementById('custom-grid-opacity-value').textContent = themeData.gridOpacity + '%';
                document.getElementById('custom-cell-empty-color').value = themeData.cellEmptyColor;
                document.getElementById('custom-cell-empty-color-text').value = themeData.cellEmptyColor;
                document.getElementById('custom-cell-empty-opacity').value = themeData.cellEmptyOpacity;
                document.getElementById('custom-cell-empty-opacity-value').textContent = themeData.cellEmptyOpacity + '%';
                document.getElementById('custom-scrollbar-color').value = themeData.scrollbarColor;
                document.getElementById('custom-scrollbar-color-text').value = themeData.scrollbarColor;
                document.getElementById('custom-scrollbar-opacity').value = themeData.scrollbarOpacity;
                document.getElementById('custom-scrollbar-opacity-value').textContent = themeData.scrollbarOpacity + '%';
                document.getElementById('custom-modal-bg').value = themeData.modalBgColor;
                document.getElementById('custom-modal-bg-text').value = themeData.modalBgColor;
                document.getElementById('custom-modal-bg-opacity').value = themeData.modalBgOpacity;
                document.getElementById('custom-modal-bg-opacity-value').textContent = themeData.modalBgOpacity + '%';
                document.getElementById('custom-modal-text').value = themeData.modalTextColor;
                document.getElementById('custom-modal-text-text').value = themeData.modalTextColor;
                document.getElementById('custom-modal-text-opacity').value = themeData.modalTextOpacity;
                document.getElementById('custom-modal-text-opacity-value').textContent = themeData.modalTextOpacity + '%';
                for (let i = 2; i <= 32768; i *= 2) {
                    const bg = document.getElementById(`custom-tile-${i}-bg`);
                    const bgText = document.getElementById(`custom-tile-${i}-bg-text`);
                    const text = document.getElementById(`custom-tile-${i}-text`);
                    const textText = document.getElementById(`custom-tile-${i}-text-text`);
                    if (bg && themeData[`tile${i}Bg`]) {
                        bg.value = themeData[`tile${i}Bg`];
                        bgText.value = themeData[`tile${i}Bg`];
                    }
                    if (text && themeData[`tile${i}Text`]) {
                        text.value = themeData[`tile${i}Text`];
                        textText.value = themeData[`tile${i}Text`];
                    }
                }
                const superBg = document.getElementById('custom-tile-super-bg');
                const superBgText = document.getElementById('custom-tile-super-bg-text');
                const superText = document.getElementById('custom-tile-super-text');
                const superTextText = document.getElementById('custom-tile-super-text-text');
                if (superBg && themeData.tileSuperBg) {
                    superBg.value = themeData.tileSuperBg;
                    superBgText.value = themeData.tileSuperBg;
                }
                if (superText && themeData.tileSuperText) {
                    superText.value = themeData.tileSuperText;
                    superTextText.value = themeData.tileSuperText;
                }
                previewCustomTheme();
                alert('主题导入成功！');
            } catch (e) {
                console.error('导入失败:', e);
                alert('导入失败：' + e.message);
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
        const bgOpacity = themeData.bgOpacity ? Math.floor((themeData.bgOpacity / 100) * 255).toString(16).padStart(2, '0') : 'ff';
        const primaryOpacity = themeData.primaryOpacity ? Math.floor((themeData.primaryOpacity / 100) * 255).toString(16).padStart(2, '0') : 'ff';
        const secondaryOpacity = themeData.secondaryOpacity ? Math.floor((themeData.secondaryOpacity / 100) * 255).toString(16).padStart(2, '0') : 'ff';
        const gridOpacity = themeData.gridOpacity ? Math.floor((themeData.gridOpacity / 100) * 255).toString(16).padStart(2, '0') : 'ff';
        const cellEmptyOpacity = themeData.cellEmptyOpacity ? Math.floor((themeData.cellEmptyOpacity / 100) * 255).toString(16).padStart(2, '0') : 'ff';
        const scrollbarOpacity = themeData.scrollbarOpacity ? Math.floor((themeData.scrollbarOpacity / 100) * 255).toString(16).padStart(2, '0') : 'ff';
        const customStyles = `
            body.bg-bg {
                background-color: ${themeData.bgColor}${bgOpacity} !important;
                color: ${themeData.secondaryColor}${secondaryOpacity} !important;
            }
            body.bg-bg .bg-bg {
                background-color: ${themeData.bgColor}${bgOpacity} !important;
            }
            body.bg-bg .text-secondary {
                color: ${themeData.secondaryColor}${secondaryOpacity} !important;
            }
            body.bg-bg .text-secondary\/80 {
                color: ${themeData.secondaryColor}${Math.floor((parseInt(secondaryOpacity, 16) * 0.8) / 255 * 255).toString(16).padStart(2, '0')} !important;
            }
            body.bg-bg .bg-grid {
                background-color: ${themeData.gridColor}${gridOpacity} !important;
            }
            body.bg-bg .bg-primary {
                background-color: ${themeData.primaryColor}${primaryOpacity} !important;
            }
            body.bg-bg .bg-secondary {
                background-color: ${themeData.secondaryColor}${secondaryOpacity} !important;
            }
            body.bg-bg .tile-2 { background-color: ${themeData.tile2Bg} !important; color: ${themeData.tile2Text} !important; }
            body.bg-bg .tile-4 { background-color: ${themeData.tile4Bg} !important; color: ${themeData.tile4Text} !important; }
            body.bg-bg .tile-8 { background-color: ${themeData.tile8Bg} !important; color: ${themeData.tile8Text} !important; }
            body.bg-bg .tile-16 { background-color: ${themeData.tile16Bg} !important; color: ${themeData.tile16Text} !important; }
            body.bg-bg .tile-32 { background-color: ${themeData.tile32Bg} !important; color: ${themeData.tile32Text} !important; }
            body.bg-bg .tile-64 { background-color: ${themeData.tile64Bg} !important; color: ${themeData.tile64Text} !important; }
            body.bg-bg .tile-128 { background-color: ${themeData.tile128Bg} !important; color: ${themeData.tile128Text} !important; }
            body.bg-bg .tile-256 { background-color: ${themeData.tile256Bg} !important; color: ${themeData.tile256Text} !important; }
            body.bg-bg .tile-512 { background-color: ${themeData.tile512Bg} !important; color: ${themeData.tile512Text} !important; }
            body.bg-bg .tile-1024 { background-color: ${themeData.tile1024Bg} !important; color: ${themeData.tile1024Text} !important; }
            body.bg-bg .tile-2048 { background-color: ${themeData.tile2048Bg} !important; color: ${themeData.tile2048Text} !important; }
            body.bg-bg .tile-4096 { background-color: ${themeData.tile4096Bg} !important; color: ${themeData.tile4096Text} !important; }
            body.bg-bg .tile-8192 { background-color: ${themeData.tile8192Bg} !important; color: ${themeData.tile8192Text} !important; }
            body.bg-bg .tile-16384 { background-color: ${themeData.tile16384Bg} !important; color: ${themeData.tile16384Text} !important; }
            body.bg-bg .tile-32768 { background-color: ${themeData.tile32768Bg} !important; color: ${themeData.tile32768Text} !important; }
            body.bg-bg .tile-super { background-color: ${themeData.tileSuperBg} !important; color: ${themeData.tileSuperText} !important; }
            body.bg-bg ::-webkit-scrollbar-track {
                background: ${themeData.bgColor}${bgOpacity} !important;
            }
            body.bg-bg ::-webkit-scrollbar-thumb {
                background: ${themeData.scrollbarColor}${scrollbarOpacity} !important;
            }
        `;
        styleElement.textContent = customStyles;
        document.body.setAttribute('data-theme', 'custom');
    } catch (e) {
        console.error('加载自定义主题失败:', e);
        localStorage.removeItem('customTheme');
        localStorage.setItem('2048-theme', 'light');
    }
}