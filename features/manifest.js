window.__modulesManifest = {
    coreCss: {
        required: true,
        versionVar: '--css-version'
    },
    modules: [
        { name: 'i18n', src: 'i18n.js', required: true, check: 'i18n' },
        { name: 'customSelect', src: 'custom-select.js', required: false, check: 'customSelectModuleLoaded' },
        { name: 'customTheme', src: 'custom-theme.js', required: false, check: function () { return typeof setupThemeCustomizer === 'function'; } },
        { name: 'aiAnalysis', src: 'ai-analysis.js', required: false, check: function () { return typeof setupAiAnalysis === 'function'; } },
        { name: 'aiRequest', src: 'ai-request.js', required: false, check: 'aiRequest' },
        { name: 'aiAutoPlay', src: 'ai-autoplay.js', required: false, check: 'aiAutoPlay' },
        { name: 'dataTransfer', src: 'data-transfer.js', required: false, check: function () { return typeof exportGameData === 'function'; } },
        { name: 'bluetoothSync', src: 'bluetooth-sync.js', required: false, check: 'bluetoothSync' },
        { name: 'webrtcSync', src: 'webrtc-sync.js', required: false, check: 'webrtcSync' },
        { name: 'fullscreenMode', src: 'fullscreen-mode.js', required: false, check: function () { return typeof setupFullscreenMode === 'function'; } }
    ]
};
