const customThemeVersion = '1.7';
window.customThemeVersion = customThemeVersion;
window.customThemeLoaded = true;
const customThemeDomTemplates = {"#module-dom-root": "        <div id=\"custom-theme-modal\" class=\"fixed inset-0 flex items-center justify-center bg-black/50 z-50 hidden\" role=\"dialog\" aria-labelledby=\"custom-theme-modal-title\" aria-modal=\"true\">\n            <div class=\"bg-gray-50 dark:bg-dark-surface rounded-lg max-w-2xl w-full max-h-[90vh] shadow-xl transform transition-all duration-300 scale-95 opacity-0 flex flex-col\">\n                <div class=\"p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center\">\n                    <h2 id=\"custom-theme-modal-title\" class=\"text-xl font-bold text-secondary\" data-i18n=\"customTheme\">自定义主题</h2>\n                    <div class=\"mr-[1rem]\">\n                        <button id=\"close-custom-theme-modal\" class=\"text-secondary/60 hover:text-secondary focus:outline-none text-lg dark:text-dark-muted dark:hover:text-white\" title=\"关闭\">\n                            <i class=\"fa-solid fa-xmark\"></i>\n                        </button>\n                    </div>\n                </div>\n            <div class=\"flex-1 p-6 overflow-y-auto\">\n                <div class=\"flex flex-col gap-4\">\n                <div class=\"theme-palette-tabs\" role=\"tablist\">\n                    <button type=\"button\" id=\"theme-palette-light\" role=\"tab\" class=\"theme-palette-tab\" data-i18n=\"lightTheme\">浅色</button>\n                    <button type=\"button\" id=\"theme-palette-dark\" role=\"tab\" class=\"theme-palette-tab\" data-i18n=\"darkTheme\">深色</button>\n                </div>\n                <div class=\"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4\">\n                    <h3 class=\"text-lg font-semibold text-gray-700 dark:text-dark-text mb-3\" data-i18n=\"baseColors\">基础颜色</h3>\n                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3\">\n                        <div class=\"flex flex-col\">\n                            <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"mainBg\">主背景色</label>\n                            <div class=\"flex items-center gap-2 mb-2\">\n                                <input type=\"color\" id=\"custom-bg-color\" value=\"#faf8ef\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                <input type=\"text\" id=\"custom-bg-color-text\" value=\"#faf8ef\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                            </div>\n                            <div class=\"flex items-center gap-2\">\n                                <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                <input type=\"range\" id=\"custom-bg-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                <span id=\"custom-bg-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                            </div>\n                        </div>\n                        <div class=\"flex flex-col\">\n                            <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"primaryColor\">主色调</label>\n                            <div class=\"flex items-center gap-2 mb-2\">\n                                <input type=\"color\" id=\"custom-primary-color\" value=\"#faa31b\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                <input type=\"text\" id=\"custom-primary-color-text\" value=\"#faa31b\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                            </div>\n                            <div class=\"flex items-center gap-2\">\n                                <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                <input type=\"range\" id=\"custom-primary-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                <span id=\"custom-primary-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                            </div>\n                        </div>\n                        <div class=\"flex flex-col\">\n                            <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"secondaryColor\">次色调</label>\n                            <div class=\"flex items-center gap-2 mb-2\">\n                                <input type=\"color\" id=\"custom-secondary-color\" value=\"#8f7a66\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                <input type=\"text\" id=\"custom-secondary-color-text\" value=\"#8f7a66\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                            </div>\n                            <div class=\"flex items-center gap-2\">\n                                <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                <input type=\"range\" id=\"custom-secondary-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                <span id=\"custom-secondary-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                            </div>\n                        </div>\n                        <div class=\"flex flex-col\">\n                            <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"gridColor\">网格颜色</label>\n                            <div class=\"flex items-center gap-2 mb-2\">\n                                <input type=\"color\" id=\"custom-grid-color\" value=\"#bbada0\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                <input type=\"text\" id=\"custom-grid-color-text\" value=\"#bbada0\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                            </div>\n                            <div class=\"flex items-center gap-2\">\n                                <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                <input type=\"range\" id=\"custom-grid-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                <span id=\"custom-grid-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                            </div>\n                        </div>\n                        <div class=\"flex flex-col\">\n                            <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"cellEmptyColor\">空单元格颜色</label>\n                            <div class=\"flex items-center gap-2 mb-2\">\n                                <input type=\"color\" id=\"custom-cell-empty-color\" value=\"#cdc1b4\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                <input type=\"text\" id=\"custom-cell-empty-color-text\" value=\"#cdc1b4\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                            </div>\n                            <div class=\"flex items-center gap-2\">\n                                <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                <input type=\"range\" id=\"custom-cell-empty-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                <span id=\"custom-cell-empty-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                            </div>\n                        </div>\n                        <div class=\"flex flex-col\">\n                            <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"scrollbarColor\">滚动条颜色</label>\n                            <div class=\"flex items-center gap-2 mb-2\">\n                                <input type=\"color\" id=\"custom-scrollbar-color\" value=\"#bbbbbb\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                <input type=\"text\" id=\"custom-scrollbar-color-text\" value=\"#bbbbbb\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                            </div>\n                            <div class=\"flex items-center gap-2\">\n                                <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                <input type=\"range\" id=\"custom-scrollbar-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                <span id=\"custom-scrollbar-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                            </div>\n                        </div>\n                        </div>\n                    </div>\n                    <div class=\"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4\">\n                        <h3 class=\"text-lg font-semibold text-gray-700 dark:text-dark-text mb-3\" data-i18n=\"modalColors\">模态框颜色</h3>\n                        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3\">\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"modalBg\">模态框背景色</label>\n                                <div class=\"flex items-center gap-2 mb-2\">\n                                    <input type=\"color\" id=\"custom-modal-bg\" value=\"#ffffff\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-modal-bg-text\" value=\"#ffffff\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                                <div class=\"flex items-center gap-2\">\n                                    <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                    <input type=\"range\" id=\"custom-modal-bg-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                    <span id=\"custom-modal-bg-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"modalText\">模态框文字颜色</label>\n                                <div class=\"flex items-center gap-2 mb-2\">\n                                    <input type=\"color\" id=\"custom-modal-text\" value=\"#333333\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-modal-text-text\" value=\"#333333\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                                <div class=\"flex items-center gap-2\">\n                                    <label class=\"text-xs text-gray-500 dark:text-gray-400 w-12\" data-i18n=\"opacity\">不透明度</label>\n                                    <input type=\"range\" id=\"custom-modal-text-opacity\" min=\"0\" max=\"100\" value=\"100\" class=\"flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer\">\n                                    <span id=\"custom-modal-text-opacity-value\" class=\"text-xs text-gray-500 dark:text-gray-400 w-8 text-center\">100%</span>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4\">\n                        <h3 class=\"text-lg font-semibold text-gray-700 dark:text-dark-text mb-3\" data-i18n=\"tileColors\">滑块颜色</h3>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile2Bg\">数字 2 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-2-bg\" value=\"#eee4da\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-2-bg-text\" value=\"#eee4da\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile2Text\">数字 2 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-2-text\" value=\"#776e65\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-2-text-text\" value=\"#776e65\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile4Bg\">数字 4 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-4-bg\" value=\"#ede0c8\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-4-bg-text\" value=\"#ede0c8\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile4Text\">数字 4 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-4-text\" value=\"#776e65\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-4-text-text\" value=\"#776e65\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile8Bg\">数字 8 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-8-bg\" value=\"#f2b179\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-8-bg-text\" value=\"#f2b179\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile8Text\">数字 8 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-8-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-8-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile16Bg\">数字 16 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-16-bg\" value=\"#f59563\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-16-bg-text\" value=\"#f59563\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile16Text\">数字 16 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-16-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-16-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile32Bg\">数字 32 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-32-bg\" value=\"#f67c5f\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-32-bg-text\" value=\"#f67c5f\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile32Text\">数字 32 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-32-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-32-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile64Bg\">数字 64 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-64-bg\" value=\"#f65e3b\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-64-bg-text\" value=\"#f65e3b\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile64Text\">数字 64 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-64-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-64-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile128Bg\">数字 128 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-128-bg\" value=\"#edcf72\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-128-bg-text\" value=\"#edcf72\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile128Text\">数字 128 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-128-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-128-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile256Bg\">数字 256 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-256-bg\" value=\"#edcc61\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-256-bg-text\" value=\"#edcc61\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile256Text\">数字 256 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-256-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-256-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile512Bg\">数字 512 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-512-bg\" value=\"#edc850\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-512-bg-text\" value=\"#edc850\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile512Text\">数字 512 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-512-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-512-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile1024Bg\">数字 1024 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-1024-bg\" value=\"#edc53f\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-1024-bg-text\" value=\"#edc53f\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile1024Text\">数字 1024 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-1024-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-1024-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile2048Bg\">数字 2048 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-2048-bg\" value=\"#edc22e\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-2048-bg-text\" value=\"#edc22e\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile2048Text\">数字 2048 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-2048-text\" value=\"#f9f6f2\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-2048-text-text\" value=\"#f9f6f2\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile4096Bg\">数字 4096 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-4096-bg\" value=\"#e65100\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-4096-bg-text\" value=\"#e65100\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile4096Text\">数字 4096 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-4096-text\" value=\"#ffffff\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-4096-text-text\" value=\"#ffffff\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile8192Bg\">数字 8192 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-8192-bg\" value=\"#bf360c\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-8192-bg-text\" value=\"#bf360c\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile8192Text\">数字 8192 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-8192-text\" value=\"#ffffff\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-8192-text-text\" value=\"#ffffff\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile16384Bg\">数字 16384 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-16384-bg\" value=\"#880e4f\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-16384-bg-text\" value=\"#880e4f\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile16384Text\">数字 16384 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-16384-text\" value=\"#ffffff\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-16384-text-text\" value=\"#ffffff\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile32768Bg\">数字 32768 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-32768-bg\" value=\"#4a148c\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-32768-bg-text\" value=\"#4a148c\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tile32768Text\">数字 32768 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-32768-text\" value=\"#ffffff\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-32768-text-text\" value=\"#ffffff\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tileSuperBg\">更大数字 背景色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-super-bg\" value=\"#311b92\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-super-bg-text\" value=\"#311b92\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                            <div class=\"flex flex-col\">\n                                <label class=\"text-sm text-gray-700 dark:text-dark-muted mb-1\" data-i18n=\"tileSuperText\">更大数字 文字颜色</label>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"color\" id=\"custom-tile-super-text\" value=\"#ffffff\" class=\"w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer\">\n                                    <input type=\"text\" id=\"custom-tile-super-text-text\" value=\"#ffffff\" class=\"flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm\">\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface rounded-b-lg relative\">\n                <div class=\"absolute left-4 bottom-4 z-10\">\n                    <div class=\"relative\">\n                        <button id=\"theme-actions-btn\" class=\"inline-flex items-center justify-center h-[32px] w-[18px] bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none\">\n                            <i class=\"fa-solid fa-ellipsis-vertical text-gray-600 dark:text-gray-300 text-sm\"></i>\n                        </button>\n                        <div id=\"theme-actions-bubble\" class=\"absolute bottom-12 left-[-10px] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 opacity-0 invisible transition-all duration-200 transform translate-y-2 z-30 flex flex-col gap-2 min-w-[110px]\">\n                            <button id=\"export-custom-theme\" class=\"px-3 py-1 bg-secondary hover:bg-secondary/90 text-white rounded-md transition-all duration-200 text-sm flex items-center justify-center min-w-[110px]\">\n                                <i class=\"fa-solid fa-upload mr-1\"></i><span data-i18n=\"exportTheme\">导出主题</span>\n                            </button>\n                            <button id=\"import-custom-theme\" class=\"px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-200 text-sm flex items-center justify-center min-w-[110px]\">\n                                <i class=\"fa-solid fa-download mr-1\"></i><span data-i18n=\"importTheme\">导入主题</span>\n                            </button>\n                            <div class=\"absolute bottom-[-8px] left-3 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800\"></div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"flex flex-wrap gap-2 justify-center\">\n                    <button id=\"save-custom-theme\" class=\"px-3 py-1 bg-primary hover:bg-primary/90 text-white rounded-md transition-all duration-200 flex-1 sm:flex-none sm:min-w-[100px]\">\n                        <i class=\"fa-solid fa-save mr-1\"></i><span data-i18n=\"save\">保存</span>\n                    </button>\n                    <button id=\"reset-custom-theme\" class=\"px-3 py-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-all duration-200 flex-1 sm:flex-none sm:min-w-[100px]\">\n                        <i class=\"fa-solid fa-rotate-right mr-1\"></i><span data-i18n=\"reset\">重置</span>\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n        <div id=\"export-theme-modal\" class=\"fixed inset-0 flex items-center justify-center bg-black/50 z-50 hidden\" role=\"dialog\" aria-labelledby=\"export-theme-modal-title\" aria-modal=\"true\">\n            <div class=\"bg-gray-50 dark:bg-dark-surface rounded-lg max-w-2xl w-full max-h-[90vh] shadow-xl transform transition-all duration-300 scale-95 opacity-0 flex flex-col\">\n                <div class=\"p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center\">\n                    <h2 id=\"export-theme-modal-title\" class=\"text-xl font-bold text-secondary\" data-i18n=\"exportThemeModal\">导出主题</h2>\n                    <div class=\"mr-[1rem]\">\n                        <button id=\"close-export-theme-modal\" class=\"text-secondary/60 hover:text-secondary focus:outline-none text-lg dark:text-dark-muted dark:hover:text-white\" title=\"关闭\">\n                            <i class=\"fa-solid fa-xmark\"></i>\n                        </button>\n                    </div>\n                </div>\n                <div class=\"flex-1 p-6 overflow-y-auto\">\n                    <div class=\"flex flex-col gap-4\">\n                        <div class=\"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4\">\n                            <h3 class=\"text-lg font-semibold text-gray-700 dark:text-dark-text mb-3\" data-i18n=\"selectThemeMode\">选择主题模式</h3>\n                            <div class=\"flex flex-wrap items-center gap-4\">\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"checkbox\" id=\"export-light-theme\" class=\"w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:bg-dark-surface dark:border-dark-muted\" checked>\n                                    <label for=\"export-light-theme\" class=\"text-sm text-gray-700 dark:text-dark-text\" data-i18n=\"lightTheme\">浅色</label>\n                                </div>\n                                <div class=\"flex items-center gap-2\">\n                                    <input type=\"checkbox\" id=\"export-dark-theme\" class=\"w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:bg-dark-surface dark:border-dark-muted\" checked>\n                                    <label for=\"export-dark-theme\" class=\"text-sm text-gray-700 dark:text-dark-text\" data-i18n=\"darkTheme\">深色</label>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4\">\n                            <h3 class=\"text-lg font-semibold text-gray-700 dark:text-dark-text mb-3\" data-i18n=\"selectThemeItems\">选择要导出的主题项</h3>\n                            <div id=\"theme-export-options\" class=\"space-y-2\">\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface rounded-b-lg\">\n                    <div class=\"flex items-center gap-2 mb-3\">\n                        <input type=\"checkbox\" id=\"select-all-theme-items\" class=\"w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:bg-dark-surface dark:border-dark-muted\" checked>\n                        <label for=\"select-all-theme-items\" class=\"text-sm text-gray-700 dark:text-dark-text\" data-i18n=\"selectAll\">全选</label>\n                    </div>\n                    <div class=\"flex flex-wrap gap-2 justify-center\">\n                        <button id=\"confirm-export-theme\" class=\"px-3 py-1 bg-primary hover:bg-primary/90 text-white rounded-md transition-all duration-200 flex-1 sm:flex-none sm:min-w-[100px]\">\n                            <i class=\"fa-solid fa-upload mr-1\"></i><span data-i18n=\"export\">导出</span>\n                        </button>\n                        <button id=\"cancel-export-theme\" class=\"px-3 py-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-all duration-200 flex-1 sm:flex-none sm:min-w-[100px]\">\n                            <i class=\"fa-solid fa-times mr-1\"></i><span data-i18n=\"cancel\">取消</span>\n                        </button>\n                    </div>\n                </div>\n            </div>\n        </div>", "#settings-module-appearance": "                            <div id=\"custom-theme-palette-row\" class=\"flex items-center justify-between mt-2 mb-2 px-2 hidden\">\n                                <label for=\"custom-theme-palette-select\" class=\"text-gray-700 dark:text-dark-muted\" data-i18n=\"customTheme\">自定义主题</label>\n                                <div class=\"custom-select relative w-full max-w-[180px]\">\n                                    <div class=\"select-selected flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 hover:border-primary/50\">\n                                        <span><i class=\"fa-solid fa-desktop mr-1\"></i><span data-i18n=\"followBrowser\">跟随浏览器</span></span>\n                                        <i class=\"fa fa-chevron-down text-xs ml-2 text-gray-500 dark:text-gray-400\"></i>\n                                    </div>\n                                    <div class=\"select-items absolute mt-1 w-full bg-gray-100 dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 z-20 max-h-0 opacity-0 overflow-y-auto transition-all duration-300 ease-in-out\">\n                                        <div class=\"select-item px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white cursor-pointer transition-colors\" data-value=\"auto\"><i class=\"fa-solid fa-desktop mr-1\"></i><span data-i18n=\"followBrowser\">跟随浏览器</span></div>\n                                        <div class=\"select-item px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white cursor-pointer transition-colors\" data-value=\"light\"><i class=\"fa-solid fa-sun mr-1\"></i><span data-i18n=\"lightTheme\">浅色</span></div>\n                                        <div class=\"select-item px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white cursor-pointer transition-colors\" data-value=\"dark\"><i class=\"fa-solid fa-moon mr-1\"></i><span data-i18n=\"darkTheme\">深色</span></div>\n                                    </div>\n                                    <select id=\"custom-theme-palette-select\" style=\"display: none;\">\n                                        <option value=\"auto\">跟随浏览器</option>\n                                        <option value=\"light\">浅色</option>\n                                        <option value=\"dark\">深色</option>\n                                    </select>\n                                </div>\n                            </div>\n                            <div id=\"custom-theme-button-container\" class=\"flex justify-end px-2\">\n                                <button id=\"custom-theme-button\" class=\"px-3 py-1 bg-primary hover:bg-primary/90 text-white rounded-md text-sm transition-all duration-200\">\n                                    <i class=\"fa-solid fa-palette mr-1\"></i><span data-i18n=\"customThemeButton\">自定义主题设置</span>\n                                </button>\n                            </div>"};
if (window.i18n && typeof window.i18n.registerModule === 'function') {
    window.i18n.registerModule('theme');
}
const tileValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
const DARK_THEME_DEFAULTS = {
    bgColor: '#121212',
    primaryColor: '#ffb74d',
    secondaryColor: '#a1887f',
    gridColor: '#37474f',
    cellEmptyColor: '#546e7a',
    scrollbarColor: '#4a4a4a',
    modalBgColor: '#1e1e1e',
    modalTextColor: '#e0e0e0'
};
let themeDraft = null;
let themePalette = 'light';
const LEGACY_OPACITY_KEYS = {
    bgOpacity: 'bgColorOpacity',
    primaryOpacity: 'primaryColorOpacity',
    secondaryOpacity: 'secondaryColorOpacity',
    gridOpacity: 'gridColorOpacity',
    cellEmptyOpacity: 'cellEmptyColorOpacity',
    scrollbarOpacity: 'scrollbarColorOpacity',
    modalBgOpacity: 'modalBgColorOpacity',
    modalTextOpacity: 'modalTextColorOpacity'
};
function normalizeThemeOpacityKeys(values) {
    const normalized = Object.assign({}, values);
    Object.keys(LEGACY_OPACITY_KEYS).forEach(shortKey => {
        const longKey = LEGACY_OPACITY_KEYS[shortKey];
        if (normalized[longKey] === undefined && normalized[shortKey] !== undefined) {
            normalized[longKey] = normalized[shortKey];
        }
        delete normalized[shortKey];
    });
    return normalized;
}
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
    refreshAllFieldPreviews();
}
function getDefaultThemeValues(palette) {
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
    if (palette === 'dark') {
        Object.keys(DARK_THEME_DEFAULTS).forEach(key => {
            defaults[key] = DARK_THEME_DEFAULTS[key];
        });
    }
    return defaults;
}
function getCustomThemeData() {
    let raw = null;
    try {
        raw = localStorage.getItem('2048-setting-custom-theme');
    } catch (e) {
        return null;
    }
    if (!raw) return null;
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        return null;
    }
    if (!data || typeof data !== 'object') return null;
    if (data.light || data.dark) {
        return {
            light: Object.assign(getDefaultThemeValues('light'), normalizeThemeOpacityKeys(data.light || {})),
            dark: Object.assign(getDefaultThemeValues('dark'), normalizeThemeOpacityKeys(data.dark || {}))
        };
    }
    return {
        light: Object.assign(getDefaultThemeValues('light'), normalizeThemeOpacityKeys(data)),
        dark: Object.assign(getDefaultThemeValues('dark'), {})
    };
}
function getCustomThemePalettePreference() {
    try {
        return localStorage.getItem('2048-setting-custom-theme-palette') || 'auto';
    } catch (e) {
        return 'auto';
    }
}
function getEffectiveThemePalette() {
    let mode = 'auto';
    try {
        mode = localStorage.getItem('2048-setting-theme') || 'auto';
    } catch (e) {}
    if (mode === 'dark') return 'dark';
    if (mode === 'light') return 'light';
    if (mode === 'custom') {
        const preference = getCustomThemePalettePreference();
        if (preference === 'dark') return 'dark';
        if (preference === 'light') return 'light';
    }
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
        return 'light';
    }
}
function updateCustomThemePaletteRow() {
    const row = document.getElementById('custom-theme-palette-row');
    if (!row) return;
    let mode = 'auto';
    try {
        mode = localStorage.getItem('2048-setting-theme') || 'auto';
    } catch (e) {}
    row.classList.toggle('hidden', mode !== 'custom');
    const select = document.getElementById('custom-theme-palette-select');
    if (!select) return;
    select.value = getCustomThemePalettePreference();
    const customSelect = row.querySelector('.custom-select');
    if (!customSelect) return;
    const selectedValue = customSelect.querySelector('.select-selected span');
    customSelect.querySelectorAll('.select-item').forEach(item => {
        const isSelected = item.getAttribute('data-value') === select.value;
        item.classList.toggle('selected', isSelected);
        if (isSelected && selectedValue) {
            selectedValue.innerHTML = item.innerHTML;
        }
    });
}
function applyCustomThemePalettePreference() {
    if (window.themeMediaQueryListener) {
        window.themeMediaQueryListener.mediaQuery.removeEventListener('change', window.themeMediaQueryListener.handler);
        window.themeMediaQueryListener = null;
    }
    const preference = getCustomThemePalettePreference();
    if (preference === 'light' || preference === 'dark') {
        document.documentElement.classList.toggle('dark', preference === 'dark');
    } else {
        const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = (e) => {
            document.documentElement.classList.toggle('dark', e.matches);
        };
        themeMediaQuery.addEventListener('change', updateTheme);
        updateTheme(themeMediaQuery);
        window.themeMediaQueryListener = {
            mediaQuery: themeMediaQuery,
            handler: updateTheme
        };
    }
    themePalette = getEffectiveThemePalette();
    loadThemePalette(themePalette);
    updateCustomThemePaletteRow();
}
function ensureThemeDraft() {
    if (themeDraft) return themeDraft;
    const stored = getCustomThemeData();
    themeDraft = stored
        ? { light: Object.assign({}, stored.light), dark: Object.assign({}, stored.dark) }
        : { light: getDefaultThemeValues('light'), dark: getDefaultThemeValues('dark') };
    return themeDraft;
}
function captureThemePalette() {
    ensureThemeDraft();
    themeDraft[themePalette] = readThemeValues();
}
function updateThemePaletteTabs() {
    const tabs = [
        { id: 'theme-palette-light', palette: 'light' },
        { id: 'theme-palette-dark', palette: 'dark' }
    ];
    tabs.forEach(tab => {
        const element = document.getElementById(tab.id);
        if (!element) return;
        const active = tab.palette === themePalette;
        element.setAttribute('aria-selected', active ? 'true' : 'false');
        element.classList.toggle('theme-palette-tab-active', active);
        element.style.backgroundColor = active ? '#faa31b' : '';
        element.style.boxShadow = active ? '0 1px 3px rgba(0,0,0,0.18)' : '';
    });
}
function loadThemePalette(palette) {
    ensureThemeDraft();
    themePalette = palette === 'dark' ? 'dark' : 'light';
    writeThemeValues(themeDraft[themePalette]);
    updateThemePaletteTabs();
}
function generateThemeCSS(values, selector = 'body.bg-bg') {
    const config = getThemeFieldConfig();
    let css = `${selector} { background-color: ${values.bgColor}${opacityToHex(values.bgColorOpacity)} !important; color: ${values.secondaryColor}${opacityToHex(values.secondaryColorOpacity)} !important; }\n`;
    css += `${selector} .bg-bg { background-color: ${values.bgColor}${opacityToHex(values.bgColorOpacity)} !important; }\n`;
    css += `${selector} .text-secondary { color: ${values.secondaryColor}${opacityToHex(values.secondaryColorOpacity)} !important; }\n`;
    css += `${selector} .text-secondary\\/80 { color: ${values.secondaryColor}${opacityToHex(Math.round(parseInt(values.secondaryColorOpacity) * 0.8))} !important; }\n`;
    css += `${selector} .bg-grid { background-color: ${values.gridColor}${opacityToHex(values.gridColorOpacity)} !important; }\n`;
    css += `${selector} .bg-primary { background-color: ${values.primaryColor}${opacityToHex(values.primaryColorOpacity)} !important; }\n`;
    css += `${selector} .bg-secondary { background-color: ${values.secondaryColor}${opacityToHex(values.secondaryColorOpacity)} !important; }\n`;
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
    css += `${selector} ::-webkit-scrollbar-track { background: ${values.bgColor}${opacityToHex(values.bgColorOpacity)} !important; }\n`;
    css += `${selector} ::-webkit-scrollbar-thumb { background: ${values.scrollbarColor}${opacityToHex(values.scrollbarColorOpacity)} !important; }\n`;
    return css;
}
function opacityToHex(opacity) {
    if (!opacity) return 'ff';
    const value = parseInt(opacity, 10);
    return Math.floor((value / 100) * 255).toString(16).padStart(2, '0');
}
function normalizeHexColor(color) {
    let hex = String(color == null ? '' : color).trim();
    if (hex.charAt(0) !== '#') {
        hex = '#' + hex;
    }
    if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
        return { rgb: '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3], alpha: 1 };
    }
    if (/^#[0-9A-Fa-f]{8}$/.test(hex)) {
        return { rgb: hex.slice(0, 7), alpha: parseInt(hex.slice(7, 9), 16) / 255 };
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        return { rgb: hex, alpha: 1 };
    }
    return { rgb: '#000000', alpha: 1 };
}
function composeRgba(hexColor, opacityPercent) {
    const normalized = normalizeHexColor(hexColor);
    let sliderAlpha = 1;
    if (opacityPercent !== undefined && opacityPercent !== null && opacityPercent !== '') {
        const parsed = Number(opacityPercent);
        if (!isNaN(parsed)) {
            sliderAlpha = Math.max(0, Math.min(100, parsed)) / 100;
        }
    }
    const finalAlpha = Math.max(0, Math.min(1, normalized.alpha * sliderAlpha));
    const r = parseInt(normalized.rgb.slice(1, 3), 16);
    const g = parseInt(normalized.rgb.slice(3, 5), 16);
    const b = parseInt(normalized.rgb.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${Math.round(finalAlpha * 1000) / 1000})`;
}
const CTP_PREVIEW_LABEL_STYLE = 'font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;flex:0 0 auto;';
const CTP_PREVIEW_CONTENT_STYLE = 'flex:1 1 auto;display:flex;align-items:center;justify-content:center;min-height:64px;';
function getGridBoardTemplate() {
    let cells = '';
    for (let i = 0; i < 16; i++) {
        cells += i === 0
            ? '<div style="height:20px;border-radius:3px;background:#eee4da;color:#776e65;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:11px;">2</div>'
            : '<div style="height:20px;border-radius:3px;background:#cdc1b4;"></div>';
    }
    return '<div class="ctp-board" style="background:#bbada0;border-radius:6px;padding:5px;display:grid;grid-template-columns:repeat(4,1fr);gap:5px;width:124px;">' + cells + '</div>';
}
function getTilePreviewTemplate(valueKey) {
    const key = valueKey === 'Super' ? 'super' : Number(valueKey);
    const defaults = tileDefaultColors[key] || { bg: '#311b92', text: '#ffffff' };
    const label = valueKey === 'Super' ? '∞' : String(valueKey);
    const len = label.length;
    const fontSize = valueKey === 'Super' ? '20px' : (len <= 2 ? '18px' : (len === 3 ? '15px' : (len === 4 ? '12px' : '10px')));
    return '<div class="ctp-tile" style="width:52px;height:52px;border-radius:4px;background:' + defaults.bg + ';color:' + defaults.text + ';display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:' + fontSize + ';">' + label + '</div>';
}
function getPreviewTemplateForField(fieldId) {
    const id = String(fieldId || '');
    const tileMatch = id.match(/^tile(\d+|Super)(Bg|Text)$/);
    if (tileMatch) {
        return getTilePreviewTemplate(tileMatch[1]);
    }
    switch (id) {
        case 'bgColor':
            return '<div class="ctp-panel" style="width:100%;max-width:230px;background:#faf8ef;border-radius:6px;padding:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;">'
                + '<div style="font-weight:bold;font-size:20px;color:#8f7a66;">2048</div>'
                + '<div style="display:flex;gap:5px;">'
                + '<div style="background:#bbada0;color:#ffffff;border-radius:4px;padding:3px 9px;font-size:9px;text-align:center;line-height:1.4;">分数<br><b>0</b></div>'
                + '<div style="background:#bbada0;color:#ffffff;border-radius:4px;padding:3px 9px;font-size:9px;text-align:center;line-height:1.4;">最佳<br><b>0</b></div>'
                + '</div></div>';
        case 'primaryColor':
            return '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'
                + '<button type="button" class="ctp-btn" style="border:none;background:#faa31b;color:#ffffff;font-weight:bold;font-size:12px;padding:8px 14px;border-radius:4px;cursor:default;">新游戏</button>'
                + '<button type="button" class="ctp-btn" style="border:none;background:#faa31b;color:#ffffff;font-weight:bold;font-size:12px;padding:8px 14px;border-radius:4px;cursor:default;">无尽模式</button>'
                + '</div>';
        case 'secondaryColor':
            return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;">'
                + '<button type="button" class="ctp-btn" style="border:none;background:#8f7a66;color:#ffffff;font-weight:bold;font-size:12px;padding:8px 14px;border-radius:4px;cursor:default;">暂停</button>'
                + '<span class="ctp-text" style="font-size:12px;font-weight:bold;color:#8f7a66;">滑动合并方块</span>'
                + '</div>';
        case 'gridColor':
            return getGridBoardTemplate();
        case 'cellEmptyColor':
            return '<div style="display:flex;gap:6px;align-items:center;">'
                + '<div class="ctp-cell-empty" style="width:44px;height:44px;border-radius:4px;background:#cdc1b4;"></div>'
                + '<div style="width:44px;height:44px;border-radius:4px;background:#eee4da;color:#776e65;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:17px;">2</div>'
                + '</div>';
        case 'scrollbarColor':
            return '<div style="width:100%;max-width:210px;">'
                + '<div style="height:14px;background:#e6e6e6;border-radius:7px;padding:3px;">'
                + '<div class="ctp-thumb" style="height:8px;width:62%;border-radius:4px;background:#bbbbbb;"></div>'
                + '</div></div>';
        case 'modalBgColor':
            return '<div class="ctp-modal" style="background:#ffffff;border-radius:8px;padding:12px 16px;min-width:190px;text-align:center;color:#333333;">'
                + '<div style="font-weight:bold;font-size:13px;margin-bottom:4px;">恭喜你获胜！</div>'
                + '<div style="font-size:10px;margin-bottom:8px;opacity:0.75;">你达到了 2048 分，可以继续挑战更高分数。</div>'
                + '<button type="button" style="border:none;background:#faa31b;color:#ffffff;font-weight:bold;font-size:11px;padding:5px 12px;border-radius:4px;cursor:default;">继续游戏</button>'
                + '</div>';
        case 'modalTextColor':
            return '<div class="ctp-modal" style="background:#ffffff;border:1px solid #e0e0e0;border-radius:8px;padding:12px 16px;min-width:190px;text-align:center;color:#000000;">'
                + '<div style="font-weight:bold;font-size:13px;margin-bottom:4px;">游戏暂停</div>'
                + '<div style="font-size:10px;opacity:0.75;">游戏已暂停，点击「继续」按钮恢复。</div>'
                + '</div>';
        default:
            return '';
    }
}
function getPreviewWrapperHTML(field) {
    return '<div class="ctp-preview" id="preview-' + field.elementId + '" style="border-radius:8px;padding:8px;margin-bottom:8px;display:flex;flex-direction:column;flex:1 1 auto;">'
        + '<div style="' + CTP_PREVIEW_LABEL_STYLE + '">预览 Preview</div>'
        + '<div style="' + CTP_PREVIEW_CONTENT_STYLE + '">' + getPreviewTemplateForField(field.id) + '</div>'
        + '</div>';
}
function getFieldById(fieldId) {
    return getThemeFieldConfig().find(field => field.id === fieldId) || null;
}
function getFieldByElementId(elementId) {
    return getThemeFieldConfig().find(field => field.elementId === elementId) || null;
}
function readFieldValue(fieldId, fallback) {
    const field = getFieldById(fieldId);
    if (!field) return fallback;
    const input = document.getElementById(field.elementId);
    return input && input.value ? input.value : fallback;
}
function readFieldOpacity(fieldId) {
    const field = getFieldById(fieldId);
    if (!field || !field.opacityId) return undefined;
    const opacityInput = document.getElementById(field.opacityId);
    return opacityInput ? opacityInput.value : undefined;
}
function injectFieldPreviews() {
    const config = getThemeFieldConfig();
    config.forEach(field => {
        if (!getPreviewTemplateForField(field.id)) return;
        const input = document.getElementById(field.elementId);
        if (!input) return;
        if (document.getElementById('preview-' + field.elementId)) return;
        const parent = input.closest('.flex.flex-col');
        if (!parent) return;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = getPreviewWrapperHTML(field);
        const previewElement = wrapper.firstElementChild;
        if (!previewElement) return;
        parent.insertBefore(previewElement, parent.firstChild);
        updateFieldPreview(field.elementId);
    });
}
function applyRenderPreview(field, color, opacity) {
    const preview = document.getElementById('preview-' + field.elementId);
    if (!preview) return;
    const id = field.id;
    let tileMatch;
    if (id === 'bgColor') {
        const panel = preview.querySelector('.ctp-panel');
        if (panel) panel.style.backgroundColor = composeRgba(color, opacity);
    } else if (id === 'primaryColor') {
        preview.querySelectorAll('.ctp-btn').forEach(btn => {
            btn.style.backgroundColor = composeRgba(color, opacity);
        });
    } else if (id === 'secondaryColor') {
        preview.querySelectorAll('.ctp-btn').forEach(btn => {
            btn.style.backgroundColor = composeRgba(color, opacity);
        });
        const text = preview.querySelector('.ctp-text');
        if (text) text.style.color = composeRgba(color, opacity);
    } else if (id === 'gridColor') {
        const board = preview.querySelector('.ctp-board');
        if (board) board.style.backgroundColor = composeRgba(color, opacity);
    } else if (id === 'cellEmptyColor') {
        const cell = preview.querySelector('.ctp-cell-empty');
        if (cell) cell.style.backgroundColor = composeRgba(color, opacity);
    } else if (id === 'scrollbarColor') {
        const thumb = preview.querySelector('.ctp-thumb');
        if (thumb) thumb.style.backgroundColor = composeRgba(color, opacity);
    } else if (id === 'modalBgColor') {
        const modal = preview.querySelector('.ctp-modal');
        if (modal) {
            modal.style.backgroundColor = composeRgba(color, opacity);
            modal.style.color = composeRgba(readFieldValue('modalTextColor', '#333333'), readFieldOpacity('modalTextColor'));
        }
    } else if (id === 'modalTextColor') {
        const modal = preview.querySelector('.ctp-modal');
        if (modal) {
            modal.style.backgroundColor = composeRgba(readFieldValue('modalBgColor', '#ffffff'), readFieldOpacity('modalBgColor'));
            modal.style.color = composeRgba(color, opacity);
        }
    } else if ((tileMatch = id.match(/^tile(\d+|Super)(Bg|Text)$/))) {
        const tile = preview.querySelector('.ctp-tile');
        if (tile) {
            const defaultsKey = tileMatch[1] === 'Super' ? 'super' : Number(tileMatch[1]);
            const defaults = tileDefaultColors[defaultsKey] || { bg: '#311b92', text: '#ffffff' };
            const bg = tileMatch[2] === 'Bg' ? color : readFieldValue('tile' + tileMatch[1] + 'Bg', defaults.bg);
            const text = tileMatch[2] === 'Text' ? color : readFieldValue('tile' + tileMatch[1] + 'Text', defaults.text);
            tile.style.backgroundColor = composeRgba(bg, tileMatch[2] === 'Bg' ? opacity : undefined);
            tile.style.color = composeRgba(text, tileMatch[2] === 'Text' ? opacity : undefined);
        }
    }
}
function updateFieldPreview(elementId, color, opacity) {
    const field = getFieldByElementId(elementId);
    if (!field) return;
    const input = document.getElementById(field.elementId);
    const finalColor = color !== undefined ? color : (input ? input.value : field.default);
    const finalOpacity = opacity !== undefined ? opacity : readFieldOpacity(field.id);
    applyRenderPreview(field, finalColor, finalOpacity);
    const tileMatch = field.id.match(/^tile(\d+|Super)(Bg|Text)$/);
    if (tileMatch) {
        const pairId = 'tile' + tileMatch[1] + (tileMatch[2] === 'Bg' ? 'Text' : 'Bg');
        const pairField = getFieldById(pairId);
        const pairInput = pairField ? document.getElementById(pairField.elementId) : null;
        if (pairField && pairInput) {
            applyRenderPreview(pairField, pairInput.value, undefined);
        }
    }
}
function bindFieldPreviewUpdates() {
    const config = getThemeFieldConfig();
    const isValidHex = value => /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(String(value || '').trim());
    config.forEach(field => {
        const colorInput = document.getElementById(field.elementId);
        const textInput = document.getElementById(field.elementId + '-text');
        if (colorInput) {
            colorInput.addEventListener('input', function() {
                updateFieldPreview(field.elementId, this.value);
            });
        }
        if (textInput) {
            textInput.addEventListener('input', function() {
                if (isValidHex(this.value)) {
                    updateFieldPreview(field.elementId, this.value.trim());
                }
            });
        }
        if (field.opacityId) {
            const opacityInput = document.getElementById(field.opacityId);
            if (opacityInput) {
                opacityInput.addEventListener('input', function() {
                    updateFieldPreview(field.elementId, undefined, this.value);
                });
            }
        }
    });
}
function refreshAllFieldPreviews() {
    getThemeFieldConfig().forEach(field => {
        const input = document.getElementById(field.elementId);
        if (input) {
            updateFieldPreview(field.elementId, input.value);
        }
    });
}
function setupThemeCustomizer() {
    const customThemeModal = document.getElementById('custom-theme-modal');
    if (!customThemeModal) return;
    injectFieldPreviews();
    bindFieldPreviewUpdates();
    themePalette = getEffectiveThemePalette();
    loadThemePalette(themePalette);
    const paletteLightTab = document.getElementById('theme-palette-light');
    const paletteDarkTab = document.getElementById('theme-palette-dark');
    if (paletteLightTab) {
        paletteLightTab.addEventListener('click', function() {
            captureThemePalette();
            loadThemePalette('light');
            previewCustomTheme();
        });
    }
    if (paletteDarkTab) {
        paletteDarkTab.addEventListener('click', function() {
            captureThemePalette();
            loadThemePalette('dark');
            previewCustomTheme();
        });
    }
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
    refreshAllFieldPreviews();
}
function removePreviewStyles() {
    const previewStyleElement = document.getElementById('preview-theme-styles');
    if (previewStyleElement) {
        previewStyleElement.remove();
    }
    document.body.removeAttribute('data-preview');
}
function parseOpacityFromColor(color, opacityInputId) {
    let result;
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
        result = opacityPercent;
    } else {
        const opacityInput = document.getElementById(opacityInputId);
        result = opacityInput ? opacityInput.value : 100;
    }
    const relatedField = getThemeFieldConfig().find(field => field.opacityId === opacityInputId);
    if (relatedField) {
        updateFieldPreview(relatedField.elementId);
    }
    return result;
}
function resetCustomTheme() {
    ensureThemeDraft();
    themeDraft[themePalette] = getDefaultThemeValues(themePalette);
    writeThemeValues(themeDraft[themePalette]);
}
function saveCustomTheme() {
    ensureThemeDraft();
    themeDraft[themePalette] = readThemeValues();
    const themeData = {
        version: 2,
        light: themeDraft.light,
        dark: themeDraft.dark,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('2048-setting-custom-theme', JSON.stringify(themeData));
    localStorage.setItem('2048-setting-theme', 'custom');
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.value = 'custom';
    }
    const themeButtonContainer = document.getElementById('custom-theme-button-container');
    if (themeButtonContainer) {
        themeButtonContainer.classList.add('visible');
    }
    const selectSelected = document.querySelector('.select-selected span');
    if (selectSelected) {
        document.querySelectorAll('.select-item').forEach(item => {
            if (item.getAttribute('data-value') === 'custom') {
                selectSelected.innerHTML = item.innerHTML;
            }
        });
    }
    applyCustomThemePalettePreference();
    loadCustomTheme();
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
    themeItems.forEach(item => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'flex items-center gap-2';
        optionDiv.innerHTML = `
            <input type="checkbox" id="export-${item.id}" class="theme-export-checkbox w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:bg-dark-surface dark:border-dark-muted" checked>
            <label for="export-${item.id}" class="text-sm text-gray-700 dark:text-dark-text">${item.label}</label>
        `;
        optionsContainer.appendChild(optionDiv);
    });
    const updateSelectAllState = function() {
        const checkboxes = document.querySelectorAll('.theme-export-checkbox');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        selectAllCheckbox.checked = allChecked;
    };
    selectAllCheckbox.checked = true;
    selectAllCheckbox.onchange = function() {
        const checkboxes = document.querySelectorAll('.theme-export-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    };
    optionsContainer.onchange = updateSelectAllState;
    const lightThemeCheckbox = document.getElementById('export-light-theme');
    const darkThemeCheckbox = document.getElementById('export-dark-theme');
    if (lightThemeCheckbox) lightThemeCheckbox.checked = true;
    if (darkThemeCheckbox) darkThemeCheckbox.checked = true;
    const saveAndClose = function() {
        hideModal('export-theme-modal');
    };
    showModal('export-theme-modal');
    document.getElementById('cancel-export-theme').onclick = saveAndClose;
    document.getElementById('close-export-theme-modal').onclick = saveAndClose;
    document.getElementById('confirm-export-theme').onclick = function() {
        const palettes = [];
        if (lightThemeCheckbox && lightThemeCheckbox.checked) palettes.push('light');
        if (darkThemeCheckbox && darkThemeCheckbox.checked) palettes.push('dark');
        if (palettes.length === 0) {
            alert(i18n.t('selectAtLeastOneThemeMode'));
            return;
        }
        try {
            ensureThemeDraft();
            captureThemePalette();
            const themeData = { version: 2, timestamp: new Date().getTime() };
            palettes.forEach(palette => {
                themeData[palette] = {};
            });
            themeItems.forEach(item => {
                const checkbox = document.getElementById(`export-${item.id}`);
                if (!checkbox.checked) return;
                palettes.forEach(palette => {
                    const values = themeDraft[palette];
                    if (!values) return;
                    if (values[item.id] !== undefined) {
                        themeData[palette][item.id] = values[item.id];
                    }
                    const opacityId = `${item.id}Opacity`;
                    if (values[opacityId] !== undefined) {
                        themeData[palette][opacityId] = values[opacityId];
                    }
                });
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
    };
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
                if (themeData.light || themeData.dark) {
                    ensureThemeDraft();
                    themeDraft = {
                        light: themeData.light ? Object.assign(getDefaultThemeValues('light'), normalizeThemeOpacityKeys(themeData.light)) : Object.assign({}, themeDraft.light || getDefaultThemeValues('light')),
                        dark: themeData.dark ? Object.assign(getDefaultThemeValues('dark'), normalizeThemeOpacityKeys(themeData.dark)) : Object.assign({}, themeDraft.dark || getDefaultThemeValues('dark'))
                    };
                } else {
                    themeDraft = {
                        light: Object.assign(getDefaultThemeValues('light'), normalizeThemeOpacityKeys(themeData)),
                        dark: Object.assign(getDefaultThemeValues('dark'), {})
                    };
                }
                writeThemeValues(themeDraft[themePalette]);
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
    const themeData = getCustomThemeData();
    if (!themeData) return;
    try {
        let styleElement = document.getElementById('custom-theme-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'custom-theme-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = generateThemeCSS(themeData.light, 'body.bg-bg') + generateThemeCSS(themeData.dark, 'html.dark body.bg-bg');
        document.body.setAttribute('data-theme', 'custom');
        themeDraft = { light: Object.assign({}, themeData.light), dark: Object.assign({}, themeData.dark) };
        writeThemeValues(themeDraft[themePalette]);
        updateThemePaletteTabs();
        const earlyStyle = document.getElementById('early-custom-theme');
        if (earlyStyle) {
            earlyStyle.remove();
        }
    } catch (e) {
        console.error('Failed to load custom theme:', e);
        localStorage.removeItem('2048-setting-custom-theme');
        localStorage.setItem('2048-setting-theme', 'light');
    }
}
window.customTheme = {
    version: customThemeVersion,
    setupThemeCustomizer: setupThemeCustomizer,
    loadCustomTheme: loadCustomTheme,
    resetCustomTheme: resetCustomTheme,
    domTemplates: customThemeDomTemplates,
    isDomReady: function () {
        return !!document.getElementById('custom-theme-modal') &&
            !!document.getElementById('export-theme-modal') &&
            !!document.getElementById('custom-theme-button');
    }
};