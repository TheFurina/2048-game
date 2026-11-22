const customPageTitleVersion = '1.0';
window.customPageTitleVersion = customPageTitleVersion;
const customPageTitleDomTemplates = {
    '#settings-module-appearance': `
        <div class="flex flex-col gap-2 mt-3 mb-2 px-2 pt-3 border-t border-gray-200 dark:border-gray-700 text-left">
            <div class="flex items-center">
                <label for="custom-page-title-input" class="text-gray-700 dark:text-dark-muted" data-i18n="customPageTitle"></label>
                <div class="relative ml-2 flex items-center group">
                    <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:text-primary focus:outline-none cursor-help" data-i18n-aria-label="customPageTitleHelp" aria-describedby="custom-page-title-tooltip">
                        <i class="fa-regular fa-circle-question" aria-hidden="true"></i>
                    </button>
                    <div id="custom-page-title-tooltip" role="tooltip" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs leading-5 p-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-50 break-words"><span class="whitespace-pre-line" data-i18n="customPageTitlePlaceholders"></span></div>
                </div>
            </div>
            <input id="custom-page-title-input" type="text" maxlength="80" autocomplete="off" data-i18n-placeholder="customPageTitlePlaceholder" class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50">
        </div>`
};
(function () {
    const storageKey = (window.SETTING_PREFIX || '2048-setting-') + 'page-title';
    function getValue() {
        try {
            return (localStorage.getItem(storageKey) || '').trim();
        } catch (e) {
            return '';
        }
    }
    function refreshTitle() {
        if (typeof window.updateDocumentTitle === 'function') {
            window.updateDocumentTitle();
        }
    }
    function getTitle(defaultTitle, placeholders) {
        const template = getValue();
        if (!template) return defaultTitle;
        const values = placeholders || {};
        return template.replace(/\{([a-zA-Z]+)\}/g, function (match, key) {
            return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match;
        });
    }
    function sync() {
        const input = document.getElementById('custom-page-title-input');
        if (input) input.value = getValue();
        refreshTitle();
    }
    function init() {
        const input = document.getElementById('custom-page-title-input');
        if (!input) return;
        sync();
        if (input.dataset.customPageTitleBound === 'true') return;
        input.dataset.customPageTitleBound = 'true';
        input.addEventListener('input', function () {
            const value = input.value.trim();
            try {
                if (value) localStorage.setItem(storageKey, value);
                else localStorage.removeItem(storageKey);
            } catch (e) {}
            refreshTitle();
        });
    }
    function reset() {
        try {
            localStorage.removeItem(storageKey);
        } catch (e) {}
        sync();
    }
    window.customPageTitle = {
        getTitle: getTitle,
        init: init,
        reset: reset,
        sync: sync,
        domTemplates: customPageTitleDomTemplates
    };
    window.customPageTitleModuleLoaded = true;
    refreshTitle();
})();
