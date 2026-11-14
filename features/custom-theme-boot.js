const customThemeBootVersion = '1.0';
window.customThemeBootVersion = customThemeBootVersion;
(function() {
    try {
        var savedTheme = localStorage.getItem('2048-setting-theme') || 'auto';
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = false;
        if (savedTheme === 'dark') isDark = true;
        else if (savedTheme === 'light') isDark = false;
        else if (savedTheme === 'custom') {
            var palettePref = localStorage.getItem('2048-setting-custom-theme-palette') || 'auto';
            if (palettePref === 'dark') isDark = true;
            else if (palettePref === 'light') isDark = false;
            else isDark = prefersDark;
        }
        else isDark = prefersDark;
        if (isDark) document.documentElement.classList.add('dark');
        if (savedTheme === 'custom') {
            var raw = localStorage.getItem('2048-setting-custom-theme');
            if (raw) {
                var data = JSON.parse(raw);
                function op2hex(op) {
                    var v = parseInt(op, 10);
                    if (isNaN(v)) return 'ff';
                    return Math.floor((v / 100) * 255).toString(16).padStart(2, '0');
                }
                function opVal(values, longKey, shortKey) {
                    if (values[longKey] !== undefined) return values[longKey];
                    return values[shortKey];
                }
                function buildThemeBlock(selector, values) {
                    var block = '';
                    if (!values) return block;
                    var bgOpacity = opVal(values, 'bgColorOpacity', 'bgOpacity');
                    var primaryOpacity = opVal(values, 'primaryColorOpacity', 'primaryOpacity');
                    var secondaryOpacity = opVal(values, 'secondaryColorOpacity', 'secondaryOpacity');
                    var gridOpacity = opVal(values, 'gridColorOpacity', 'gridOpacity');
                    if (values.bgColor) block += selector + '{background-color:' + values.bgColor + op2hex(bgOpacity) + ' !important;}';
                    if (values.primaryColor) block += selector + ' .bg-primary{background-color:' + values.primaryColor + op2hex(primaryOpacity) + ' !important;}';
                    if (values.secondaryColor) {
                        block += selector + ' .text-secondary{color:' + values.secondaryColor + op2hex(secondaryOpacity) + ' !important;}';
                        block += selector + ' .text-secondary\\/80{color:' + values.secondaryColor + op2hex(Math.round(parseInt(secondaryOpacity) * 0.8)) + ' !important;}';
                    }
                    if (values.gridColor) block += selector + ' .bg-grid{background-color:' + values.gridColor + op2hex(gridOpacity) + ' !important;}';
                    return block;
                }
                var lightValues = data.light || data;
                var darkValues = data.dark || null;
                var css = buildThemeBlock('body.bg-bg', lightValues);
                css += buildThemeBlock('html.dark body.bg-bg', darkValues);
                if (css) {
                    var s = document.createElement('style');
                    s.id = 'early-custom-theme';
                    s.textContent = css;
                    document.head.appendChild(s);
                }
            }
        }
    } catch (e) {}
})();
