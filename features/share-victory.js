const shareVictoryVersion = '1.0-fix.1';
window.shareVictoryVersion = shareVictoryVersion;
(function () {
    'use strict';
    const tileColorCache = {};
    let bound = false;
    function getButton() {
        return document.getElementById('game-message-share-button');
    }
    function setVisible(visible) {
        const button = getButton();
        if (button) button.classList.toggle('hidden', !visible);
    }
    function readColor(className, property) {
        const probe = document.createElement('div');
        probe.className = className;
        probe.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(probe);
        const value = getComputedStyle(probe)[property];
        probe.remove();
        return value;
    }
    function getTileColor(value, property) {
        const key = value + ':' + property;
        if (tileColorCache[key]) return tileColorCache[key];
        const className = 'tile tile-' + value + (value > 32768 ? ' tile-super' : '');
        const fallback = property === 'backgroundColor' ? '#cdc1b4' : '#776e65';
        const color = readColor(className, property) || fallback;
        tileColorCache[key] = color;
        return color;
    }
    function fillRoundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, width, height, radius);
        } else {
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
        ctx.fill();
    }
    function generateCanvas() {
        const gameState = window.gameState || {};
        const i18n = window.i18n;
        const width = 1080;
        const height = 1350;
        const padding = 72;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const bodyStyle = getComputedStyle(document.body);
        const backgroundColor = bodyStyle.backgroundColor && bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ? bodyStyle.backgroundColor : '#faf8ef';
        const textColor = bodyStyle.color || '#776e65';
        const fontFamily = 'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.font = '700 76px ' + fontFamily;
        ctx.fillText('2048', width / 2, 108);
        const scoreTop = 184;
        const scoreHeight = 108;
        const scoreGap = 24;
        const scoreWidth = (width - padding * 2 - scoreGap) / 2;
        const pillBackground = getTileColor(8, 'backgroundColor');
        const pillTextColor = getTileColor(8, 'color');
        const scoreItems = [
            { label: i18n.t('score'), value: String(gameState.score || 0) },
            { label: i18n.t('bestScore'), value: String(gameState.bestScore || 0) }
        ];
        scoreItems.forEach((item, index) => {
            const x = padding + index * (scoreWidth + scoreGap);
            ctx.fillStyle = pillBackground;
            fillRoundRect(ctx, x, scoreTop, scoreWidth, scoreHeight, 18);
            ctx.fillStyle = pillTextColor;
            ctx.font = '600 26px ' + fontFamily;
            ctx.fillText(item.label, x + scoreWidth / 2, scoreTop + 32);
            ctx.font = '700 40px ' + fontFamily;
            ctx.fillText(item.value, x + scoreWidth / 2, scoreTop + 74);
        });
        const rows = gameState.gridRows || 4;
        const cols = gameState.gridCols || 4;
        const boardSize = 880;
        const boardTop = 336;
        const boardX = (width - boardSize) / 2;
        const gap = 16;
        const innerPadding = 18;
        const inner = boardSize - innerPadding * 2;
        const cell = Math.min((inner - gap * (cols - 1)) / cols, (inner - gap * (rows - 1)) / rows);
        const boardWidth = innerPadding * 2 + cell * cols + gap * (cols - 1);
        const boardHeight = innerPadding * 2 + cell * rows + gap * (rows - 1);
        const gridBackground = readColor('grid-container', 'backgroundColor') || '#bbada0';
        const emptyColor = readColor('grid-cell', 'backgroundColor') || 'rgba(238, 228, 218, 0.35)';
        ctx.fillStyle = gridBackground;
        fillRoundRect(ctx, boardX, boardTop, boardWidth, boardHeight, 26);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cellX = boardX + innerPadding + x * (cell + gap);
                const cellY = boardTop + innerPadding + y * (cell + gap);
                const tile = gameState.grid && gameState.grid[y] ? gameState.grid[y][x] : null;
                if (tile) {
                    ctx.fillStyle = getTileColor(tile.value, 'backgroundColor');
                    fillRoundRect(ctx, cellX, cellY, cell, cell, 12);
                    ctx.fillStyle = getTileColor(tile.value, 'color');
                    const digits = String(tile.value).length;
                    const fontSize = digits <= 2 ? cell * 0.46 : (digits === 3 ? cell * 0.4 : (digits === 4 ? cell * 0.32 : cell * 0.24));
                    ctx.font = '700 ' + Math.round(fontSize) + 'px ' + fontFamily;
                    ctx.fillText(String(tile.value), cellX + cell / 2, cellY + cell / 2 + 2);
                } else {
                    ctx.fillStyle = emptyColor;
                    fillRoundRect(ctx, cellX, cellY, cell, cell, 12);
                }
            }
        }
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 0.65;
        ctx.font = '500 24px ' + fontFamily;
        ctx.fillText(i18n.t('footer'), width / 2, 1276);
        ctx.globalAlpha = 1;
        return canvas;
    }
    function canvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error('toBlob failed'));
            }, 'image/png');
        });
    }
    function downloadImage(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    async function share() {
        const button = getButton();
        if (!button || button.disabled) return;
        const i18n = window.i18n;
        const gameState = window.gameState || {};
        button.disabled = true;
        try {
            const canvas = generateCanvas();
            const blob = await canvasToBlob(canvas);
            const now = new Date();
            const pad = value => String(value).padStart(2, '0');
            const timestamp = '' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
            const fileName = '2048-share-' + timestamp + '.png';
            const file = new File([blob], fileName, { type: 'image/png' });
            const text = i18n.t('shareVictoryText', { score: gameState.score || 0 });
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: '2048', text: text });
                    return;
                } catch (error) {
                    if (error && error.name === 'AbortError') return;
                }
            }
            downloadImage(blob, fileName);
        } catch (error) {
            console.warn('Failed to generate share image:', error);
            alert(i18n.t('shareVictoryFailed'));
        } finally {
            button.disabled = false;
        }
    }
    function init() {
        if (bound) return;
        const button = getButton();
        if (!button) return;
        button.addEventListener('click', share);
        bound = true;
    }
    window.shareVictory = {
        version: shareVictoryVersion,
        init: init,
        setVisible: setVisible,
        share: share
    };
    window.shareVictoryModuleLoaded = true;
})();
