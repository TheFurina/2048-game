const soundEffectsVersion = '1.0';
window.soundEffectsVersion = soundEffectsVersion;
if (window.i18n && typeof window.i18n.registerModule === 'function') {
    window.i18n.registerModule('sound');
}
const SOUND_SCENES = ['move', 'merge', 'win', 'loss'];
const SOUND_SETTING_PREFIX = '2048-setting-';
const SOUND_CUSTOM_PREFIX = '2048-sound-custom-';
const SOUND_DEFAULT_VOLUME = 0.6;
const SOUND_MAX_FILE_BYTES = 1024 * 1024;
let soundContext = null;
let soundBuffers = {};
let soundCustomCache = {};
let soundSettings = null;
let soundUiBound = false;
let soundCustomDecoding = {};
function soundT(key) {
    return window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(key) : key;
}
function readSoundBool(key, fallback) {
    try {
        const raw = localStorage.getItem(SOUND_SETTING_PREFIX + key);
        return raw === null ? fallback : raw !== 'false';
    } catch (e) {
        return fallback;
    }
}
function readSoundVolume() {
    try {
        const raw = parseFloat(localStorage.getItem(SOUND_SETTING_PREFIX + 'sound-volume'));
        if (isNaN(raw)) return SOUND_DEFAULT_VOLUME;
        return Math.min(1, Math.max(0, raw));
    } catch (e) {
        return SOUND_DEFAULT_VOLUME;
    }
}
function saveSoundSetting(key, value) {
    try {
        localStorage.setItem(SOUND_SETTING_PREFIX + key, value);
    } catch (e) {}
}
function loadSoundSettings() {
    soundSettings = {
        enabled: readSoundBool('sound', false),
        volume: readSoundVolume(),
        scenes: {}
    };
    SOUND_SCENES.forEach(function (scene) {
        soundSettings.scenes[scene] = readSoundBool('sound-' + scene, true);
    });
    return soundSettings;
}
function getSoundContext() {
    if (soundContext) return soundContext;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
        soundContext = new Ctx();
    } catch (e) {
        soundContext = null;
    }
    return soundContext;
}
function getCustomSource(scene) {
    if (Object.prototype.hasOwnProperty.call(soundCustomCache, scene)) {
        return soundCustomCache[scene];
    }
    let value = null;
    try {
        value = localStorage.getItem(SOUND_CUSTOM_PREFIX + scene);
    } catch (e) {
        value = null;
    }
    soundCustomCache[scene] = value;
    return value;
}
function dataUrlToArrayBuffer(dataUrl) {
    const comma = dataUrl.indexOf(',');
    if (comma === -1) return null;
    const meta = dataUrl.substring(0, comma);
    const body = dataUrl.substring(comma + 1);
    try {
        if (meta.indexOf('base64') !== -1) {
            const binary = atob(body);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            return bytes.buffer;
        }
        const text = decodeURIComponent(body);
        const bytes = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i) & 255;
        return bytes.buffer;
    } catch (e) {
        return null;
    }
}
function decodeCustomBuffer(scene) {
    if (soundBuffers[scene]) return Promise.resolve(soundBuffers[scene]);
    if (soundCustomDecoding[scene]) return soundCustomDecoding[scene];
    const ctx = getSoundContext();
    const source = getCustomSource(scene);
    if (!ctx || !source) return Promise.resolve(null);
    const buffer = dataUrlToArrayBuffer(source);
    if (!buffer) return Promise.resolve(null);
    soundCustomDecoding[scene] = new Promise(function (resolve) {
        try {
            const result = ctx.decodeAudioData(buffer);
            if (result && typeof result.then === 'function') {
                result.then(function (decoded) {
                    soundBuffers[scene] = decoded;
                    resolve(decoded);
                }).catch(function () {
                    resolve(null);
                });
            } else {
                resolve(null);
            }
        } catch (e) {
            resolve(null);
        }
    });
    soundCustomDecoding[scene].then(function () {
        delete soundCustomDecoding[scene];
    });
    return soundCustomDecoding[scene];
}
function loadCustomBuffers() {
    SOUND_SCENES.forEach(function (scene) {
        if (!soundBuffers[scene] && getCustomSource(scene)) {
            decodeCustomBuffer(scene);
        }
    });
}
function warmUpSound() {
    const ctx = getSoundContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
        try {
            const resumed = ctx.resume();
            if (resumed && typeof resumed.catch === 'function') resumed.catch(function () {});
        } catch (e) {}
    }
    loadCustomBuffers();
}
function playSoundBuffer(ctx, buffer) {
    if (!soundSettings || soundSettings.volume <= 0) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = soundSettings.volume;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
}
function playSoundTone(ctx, frequency, start, duration, type, peak, endFrequency) {
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type || 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + start);
    if (endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + start + duration);
    }
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(peak || 0.15, now + start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + duration + 0.03);
}
function synthesizeSound(ctx, scene) {
    const volumeScale = soundSettings ? Math.min(1, Math.max(0, soundSettings.volume)) : SOUND_DEFAULT_VOLUME;
    if (volumeScale <= 0) return;
    const scale = function (peak) {
        return Math.max(0.0002, peak * volumeScale);
    };
    if (scene === 'move') {
        playSoundTone(ctx, 220, 0, 0.08, 'sine', scale(0.16), 170);
    } else if (scene === 'merge') {
        playSoundTone(ctx, 392, 0, 0.09, 'triangle', scale(0.18), 523);
        playSoundTone(ctx, 523, 0.06, 0.1, 'triangle', scale(0.13), 659);
    } else if (scene === 'win') {
        playSoundTone(ctx, 523, 0, 0.16, 'triangle', scale(0.18));
        playSoundTone(ctx, 659, 0.12, 0.16, 'triangle', scale(0.16));
        playSoundTone(ctx, 784, 0.24, 0.3, 'triangle', scale(0.18));
    } else if (scene === 'loss') {
        playSoundTone(ctx, 392, 0, 0.22, 'sine', scale(0.16), 262);
        playSoundTone(ctx, 262, 0.18, 0.35, 'sine', scale(0.14), 165);
    }
}
function playSound(scene, options) {
    const opts = options || {};
    if (!soundSettings) loadSoundSettings();
    if (!opts.force) {
        if (!soundSettings.enabled) return;
        if (!soundSettings.scenes[scene]) return;
    }
    if (soundSettings.volume <= 0) return;
    const ctx = getSoundContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
        try {
            const resumed = ctx.resume();
            if (resumed && typeof resumed.catch === 'function') resumed.catch(function () {});
        } catch (e) {}
    }
    if (getCustomSource(scene)) {
        if (soundBuffers[scene]) {
            playSoundBuffer(ctx, soundBuffers[scene]);
            return;
        }
        decodeCustomBuffer(scene).then(function (buffer) {
            if (buffer) playSoundBuffer(ctx, buffer);
        });
        return;
    }
    synthesizeSound(ctx, scene);
}
function soundRowTemplate(scene, labelKey) {
    const previewText = soundT('soundPreview');
    const uploadText = soundT('soundUpload');
    const restoreText = soundT('soundRestore');
    return `<div class="flex flex-wrap items-center justify-between gap-2 px-2">
        <div class="flex items-center gap-1.5">
            <span class="text-gray-600 dark:text-dark-muted text-sm" data-i18n="${labelKey}"></span>
            <button type="button" data-sound-preview="${scene}" class="text-primary hover:text-primary/80 focus:outline-none px-1" title="${previewText}" aria-label="${previewText}"><i class="fa-solid fa-play text-xs"></i></button>
            <button type="button" data-sound-upload="${scene}" class="text-secondary/70 hover:text-secondary dark:text-dark-muted dark:hover:text-white focus:outline-none px-1" title="${uploadText}" aria-label="${uploadText}"><i class="fa-solid fa-upload text-xs"></i></button>
            <button type="button" data-sound-restore="${scene}" class="text-secondary/70 hover:text-secondary dark:text-dark-muted dark:hover:text-white focus:outline-none px-1 hidden" title="${restoreText}" aria-label="${restoreText}"><i class="fa-solid fa-rotate-left text-xs"></i></button>
            <input type="file" accept="audio/*" data-sound-file="${scene}" class="hidden">
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="sound-${scene}" class="sr-only peer">
            <div class="w-9 h-5 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:hover:bg-primary/90 peer-checked:dark:hover:bg-primary/90 transition-all duration-300"></div>
        </label>
    </div>`;
}
function soundSectionTemplate() {
    const rows = [
        soundRowTemplate('move', 'soundMove'),
        soundRowTemplate('merge', 'soundMerge'),
        soundRowTemplate('win', 'soundWin'),
        soundRowTemplate('loss', 'soundLoss')
    ].join('');
    return `<h3 class="text-base font-semibold text-secondary mb-2 text-left category-title flex items-center"><i class="fa-solid fa-volume-high mr-2"></i><span data-i18n="soundEffects"></span></h3>
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 py-3 px-2 shadow-sm">
        <div id="sound-toggle-row" class="flex flex-wrap items-center justify-between gap-2 px-2">
            <span class="text-gray-700 dark:text-dark-muted" data-i18n="soundEffects"></span>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="sound-toggle" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:hover:bg-primary/90 peer-checked:dark:hover:bg-primary/90 transition-all duration-300 hover:shadow-md dark:hover:bg-gray-500 dark:hover:shadow-lg"></div>
            </label>
        </div>
        <div id="sound-divider" class="border-b border-gray-200 dark:border-gray-700 my-3 mx-2 hidden"></div>
        <div id="sound-details" class="space-y-2 collapsed">
            <div class="flex flex-wrap items-center justify-between gap-2 px-2">
                <span class="text-gray-600 dark:text-dark-muted text-sm" data-i18n="soundVolume"></span>
                <div class="flex items-center gap-2">
                    <input type="range" id="sound-volume" min="0" max="100" step="1" value="60" class="w-28 h-1 accent-primary cursor-pointer">
                    <span id="sound-volume-value" class="text-xs text-gray-500 dark:text-dark-muted w-9 text-right">60%</span>
                </div>
            </div>
            ${rows}
            <p class="text-xs text-gray-500 dark:text-dark-muted px-2 pt-1" data-i18n="soundCustomHint"></p>
        </div>
    </div>`;
}
function ensureSoundSection() {
    if (document.getElementById('sound-settings-category')) return true;
    const modal = document.getElementById('settings-modal');
    if (!modal) return false;
    const container = modal.querySelector('.flex.flex-col.gap-3');
    if (!container) return false;
    const section = document.createElement('div');
    section.className = 'setting-category';
    section.id = 'sound-settings-category';
    section.innerHTML = soundSectionTemplate();
    const dataMount = document.getElementById('settings-module-data');
    const dataSection = dataMount ? dataMount.closest('.setting-category') : null;
    const versionInfo = document.getElementById('version-info');
    if (dataSection && dataSection.parentNode === container) {
        container.insertBefore(section, dataSection);
    } else if (versionInfo && versionInfo.parentNode === container) {
        container.insertBefore(section, versionInfo);
    } else {
        container.appendChild(section);
    }
    return true;
}
function updateSoundDetailsVisibility() {
    const details = document.getElementById('sound-details');
    if (!details || !soundSettings) return;
    details.classList.toggle('collapsed', !soundSettings.enabled);
    const divider = document.getElementById('sound-divider');
    if (divider) divider.classList.toggle('hidden', !soundSettings.enabled);
    const toggleRow = document.getElementById('sound-toggle-row');
    if (toggleRow) toggleRow.classList.toggle('mb-2', soundSettings.enabled);
}
function updateSoundControls() {
    if (!soundSettings) loadSoundSettings();
    const toggle = document.getElementById('sound-toggle');
    if (toggle) toggle.checked = soundSettings.enabled;
    const volume = document.getElementById('sound-volume');
    const volumeValue = document.getElementById('sound-volume-value');
    const percent = Math.round(soundSettings.volume * 100);
    if (volume) volume.value = String(percent);
    if (volumeValue) volumeValue.textContent = percent + '%';
    SOUND_SCENES.forEach(function (scene) {
        const checkbox = document.getElementById('sound-' + scene);
        if (checkbox) checkbox.checked = soundSettings.scenes[scene];
        const restore = document.querySelector('[data-sound-restore="' + scene + '"]');
        if (restore) restore.classList.toggle('hidden', !getCustomSource(scene));
    });
    updateSoundDetailsVisibility();
}
function handleSoundFile(scene, input) {
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) return;
    if (!/^audio\//i.test(file.type)) {
        alert(soundT('soundInvalidFile'));
        return;
    }
    if (file.size > SOUND_MAX_FILE_BYTES) {
        alert(soundT('soundFileTooLarge'));
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        try {
            localStorage.setItem(SOUND_CUSTOM_PREFIX + scene, reader.result);
        } catch (e) {
            alert(soundT('soundFileTooLarge'));
            return;
        }
        soundCustomCache[scene] = reader.result;
        delete soundBuffers[scene];
        warmUpSound();
        decodeCustomBuffer(scene).then(function (buffer) {
            delete soundCustomCache[scene];
            soundCustomCache[scene] = reader.result;
            updateSoundControls();
            if (buffer) {
                playSound(scene, { force: true });
                alert(soundT('soundUploaded'));
            } else {
                alert(soundT('soundInvalidFile'));
            }
        });
    };
    reader.onerror = function () {
        alert(soundT('soundInvalidFile'));
    };
    reader.readAsDataURL(file);
}
function restoreSceneSound(scene) {
    try {
        localStorage.removeItem(SOUND_CUSTOM_PREFIX + scene);
    } catch (e) {}
    soundCustomCache[scene] = null;
    delete soundBuffers[scene];
    updateSoundControls();
    alert(soundT('soundRestored'));
}
function bindSoundUi() {
    if (soundUiBound) return;
    const toggle = document.getElementById('sound-toggle');
    if (!toggle) return;
    soundUiBound = true;
    toggle.addEventListener('change', function () {
        soundSettings.enabled = toggle.checked;
        saveSoundSetting('sound', toggle.checked);
        updateSoundDetailsVisibility();
        if (toggle.checked) {
            warmUpSound();
            playSound('merge', { force: true });
        }
    });
    const volume = document.getElementById('sound-volume');
    const volumeValue = document.getElementById('sound-volume-value');
    if (volume) {
        volume.addEventListener('input', function () {
            const percent = parseInt(volume.value, 10) || 0;
            soundSettings.volume = Math.min(1, Math.max(0, percent / 100));
            if (volumeValue) volumeValue.textContent = percent + '%';
        });
        volume.addEventListener('change', function () {
            saveSoundSetting('sound-volume', soundSettings.volume);
            playSound('merge', { force: true });
        });
    }
    SOUND_SCENES.forEach(function (scene) {
        const checkbox = document.getElementById('sound-' + scene);
        if (checkbox) {
            checkbox.addEventListener('change', function () {
                soundSettings.scenes[scene] = checkbox.checked;
                saveSoundSetting('sound-' + scene, checkbox.checked);
            });
        }
        const preview = document.querySelector('[data-sound-preview="' + scene + '"]');
        if (preview) {
            preview.addEventListener('click', function () {
                warmUpSound();
                playSound(scene, { force: true });
            });
        }
        const upload = document.querySelector('[data-sound-upload="' + scene + '"]');
        const fileInput = document.querySelector('[data-sound-file="' + scene + '"]');
        if (upload && fileInput) {
            upload.addEventListener('click', function () {
                fileInput.click();
            });
            fileInput.addEventListener('change', function () {
                handleSoundFile(scene, fileInput);
            });
        }
        const restore = document.querySelector('[data-sound-restore="' + scene + '"]');
        if (restore) {
            restore.addEventListener('click', function () {
                restoreSceneSound(scene);
            });
        }
    });
}
function syncSoundEffects() {
    loadSoundSettings();
    updateSoundControls();
}
function resetSoundEffects() {
    try {
        localStorage.removeItem(SOUND_SETTING_PREFIX + 'sound');
        localStorage.removeItem(SOUND_SETTING_PREFIX + 'sound-volume');
        SOUND_SCENES.forEach(function (scene) {
            localStorage.removeItem(SOUND_SETTING_PREFIX + 'sound-' + scene);
            localStorage.removeItem(SOUND_CUSTOM_PREFIX + scene);
        });
    } catch (e) {}
    soundBuffers = {};
    soundCustomCache = {};
    loadSoundSettings();
    updateSoundControls();
}
function initSoundEffects() {
    loadSoundSettings();
    ensureSoundSection();
    bindSoundUi();
    updateSoundControls();
    if (!window.soundWakeupBound) {
        window.soundWakeupBound = true;
        const wakeup = function () {
            warmUpSound();
        };
        document.addEventListener('pointerdown', wakeup, { once: true, capture: true });
        document.addEventListener('keydown', wakeup, { once: true, capture: true });
    }
}
window.soundEffects = {
    version: soundEffectsVersion,
    init: initSoundEffects,
    play: playSound,
    sync: syncSoundEffects,
    reset: resetSoundEffects,
    isDomReady: function () {
        return !!document.getElementById('sound-toggle');
    }
};
window.soundEffectsModuleLoaded = true;
