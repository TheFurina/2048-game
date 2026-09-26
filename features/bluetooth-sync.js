const bluetoothSyncVersion = '0.4';
window.bluetoothSyncVersion = bluetoothSyncVersion;
class BluetoothSync {
    constructor() {
        this.isSupported = 'bluetooth' in navigator && !window.simulateNoBluetooth;
        this.server = null;
        this.characteristic = null;
        this.device = null;
        this.currentPin = null;
        this.isVerified = false;
        this.maxRetries = 3;
        this.timeoutDuration = 30000;
        this.discoverAllDevices = false;
        this.lastDevice = null;
        this.lastDeviceVerified = false;
        this.liveMode = false;
        this.connectedDeviceName = null;
        this.dismissed = false;
        this.onConnected = null;
        this.onDisconnected = null;
        this._txChain = Promise.resolve();
        this._gattDisconnectHandler = null;
        this.checkBluetoothSupport();
    }
    updateSupportStatus() {
        this.isSupported = 'bluetooth' in navigator && !window.simulateNoBluetooth;
        this.checkBluetoothSupport();
    }
    checkBluetoothSupport() {
        if (!this.isSupported) {
            if (window.simulateNoBluetooth) {
                console.warn('Bluetooth support is being simulated as not available (debug mode)');
            } else {
                console.warn('Bluetooth is not supported in this browser');
            }
        }
    }
    generatePin() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    calculateChecksum(data) {
        let checksum = 0;
        for (let i = 0; i < data.length; i++) {
            checksum ^= data.charCodeAt(i);
        }
        return checksum.toString(16).padStart(2, '0');
    }
    async requestDevice() {
        try {
            const requestOptions = {
                optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
            };
            if (this.discoverAllDevices) {
                requestOptions.acceptAllDevices = true;
            } else {
                requestOptions.filters = [
                    { services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] },
                    { namePrefix: '2048' }
                ];
            }
            const device = await navigator.bluetooth.requestDevice(requestOptions);
            if (!this.lastDevice || this.lastDevice.id !== device.id) {
                this.lastDeviceVerified = false;
            }
            this.lastDevice = device;
            return device;
        } catch (error) {
            console.error('Bluetooth device selection failed:', error);
            throw error;
        }
    }
    async getRememberedDevice() {
        if (!this.lastDevice || !navigator.bluetooth.getDevices) {
            return null;
        }
        try {
            const devices = await navigator.bluetooth.getDevices();
            return devices.find(device => device.id === this.lastDevice.id) || null;
        } catch (e) {
            return null;
        }
    }
    async getConnectableDevice() {
        if (this.lastDeviceVerified) {
            const remembered = await this.getRememberedDevice();
            if (remembered) {
                try {
                    await this.connect(remembered);
                    return remembered;
                } catch (error) {
                    console.warn('Reconnect to remembered device failed, opening chooser', error);
                }
            }
        }
        return this.requestDevice();
    }
    async connect(device) {
        if (!device || !device.gatt) {
            throw new Error('Invalid device or device does not support GATT');
        }
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                this.server = await this.withTimeout(
                    device.gatt.connect(),
                    this.timeoutDuration,
                    'Connection timeout'
                );
                this.device = device;
                if (!this._gattDisconnectHandler) {
                    this._gattDisconnectHandler = () => {
                        if (this.liveMode) {
                            this.handleUnexpectedDisconnect();
                        }
                    };
                }
                device.addEventListener('gattserverdisconnected', this._gattDisconnectHandler);
                const service = await this.withTimeout(
                    this.server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb'),
                    this.timeoutDuration,
                    'Service discovery timeout'
                );
                this.characteristic = await this.withTimeout(
                    service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'),
                    this.timeoutDuration,
                    'Characteristic discovery timeout'
                );
                return true;
            } catch (error) {
                retries++;
                if (retries >= this.maxRetries) {
                    console.error('Bluetooth connection failed:', error);
                    throw error;
                }
                console.warn(`Connection failed, retrying ${retries}/${this.maxRetries}...`);
                await this.delay(1000);
            }
        }
    }
    async sendData(data, onProgress) {
        try {
            const encoder = new TextEncoder();
            const dataString = JSON.stringify(data);
            const checksum = this.calculateChecksum(dataString);
            const payload = {
                data: dataString,
                checksum: checksum,
                timestamp: Date.now()
            };
            const payloadBytes = encoder.encode(JSON.stringify(payload));
            const totalSize = payloadBytes.length;
            await this.withTimeout(
                this.characteristic.writeValue(encoder.encode('SIZE:' + totalSize + '\n')),
                this.timeoutDuration,
                'Size send timeout'
            );
            await this.delay(30);
            const chunks = this.chunkDataBytes(payloadBytes, 17);
            for (let i = 0; i < chunks.length; i++) {
                const frame = new Uint8Array(chunks[i].length + 3);
                frame[0] = 0x44;
                frame[1] = 0x3A;
                frame.set(chunks[i], 2);
                frame[frame.length - 1] = 0x0A;
                await this.withTimeout(
                    this.characteristic.writeValue(frame),
                    this.timeoutDuration,
                    'Data send timeout'
                );
                await this.delay(30);
                if (onProgress) {
                    const progress = Math.round(((i + 1) / chunks.length) * 100);
                    onProgress(progress);
                }
            }
            await this.withTimeout(
                this.characteristic.writeValue(encoder.encode('END\n')),
                this.timeoutDuration,
                'End marker send timeout'
            );
            return true;
        } catch (error) {
            console.error('Data sending failed:', error);
            throw error;
        }
    }
    chunkDataBytes(bytes, chunkSize) {
        const chunks = [];
        for (let i = 0; i < bytes.length; i += chunkSize) {
            chunks.push(bytes.subarray(i, i + chunkSize));
        }
        return chunks;
    }
    async startReceiving() {
        this._rxQueue = [];
        this._rxWaiters = [];
        this._rxFrame = '';
        this._rxBytes = new Uint8Array(0);
        this._rxTotalSize = null;
        this._rxReceived = 0;
        this._rxProgress = null;
        this._readyPending = false;
        this._readyResolve = null;
        this._readyTimer = null;
        this._lineDecoder = new TextDecoder();
        this._rxDataDecoder = new TextDecoder();
        this._rxHandler = this.handleRxValue.bind(this);
        await this.withTimeout(
            this.characteristic.startNotifications(),
            this.timeoutDuration,
            'Notification start timeout'
        );
        this.characteristic.addEventListener('characteristicvaluechanged', this._rxHandler);
        this._rxActive = true;
    }
    handleRxValue(event) {
        const value = event.target.value;
        const incoming = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        const merged = new Uint8Array(this._rxBytes.length + incoming.length);
        merged.set(this._rxBytes);
        merged.set(incoming, this._rxBytes.length);
        this._rxBytes = merged;
        let start = 0;
        for (let i = 0; i < this._rxBytes.length; i++) {
            if (this._rxBytes[i] === 0x0A) {
                this.handleRxLine(this._rxBytes.subarray(start, i));
                start = i + 1;
            }
        }
        this._rxBytes = this._rxBytes.subarray(start);
    }
    handleRxLine(lineBytes) {
        const line = this._lineDecoder.decode(lineBytes);
        if (line.startsWith('SIZE:')) {
            this._rxTotalSize = parseInt(line.substring(5), 10) || null;
            this._rxReceived = 0;
            this._rxFrame = '';
            this._rxDataDecoder = new TextDecoder();
            return;
        }
        if (line === 'END') {
            const frame = this._rxFrame;
            this._rxFrame = '';
            this._rxTotalSize = null;
            if (this.liveMode) {
                this.dispatchLiveFrame(frame);
            } else {
                this._rxQueue.push(frame);
                this.drainRxWaiters();
            }
            return;
        }
        if (line.startsWith('D:')) {
            this._rxFrame += this._rxDataDecoder.decode(lineBytes.subarray(2), { stream: true });
            this._rxReceived += lineBytes.length - 2;
            if (this._rxProgress) {
                if (this._rxTotalSize) {
                    const progress = Math.min(Math.round((this._rxReceived / this._rxTotalSize) * 100), 99);
                    this._rxProgress(this._rxReceived, progress, this._rxTotalSize);
                } else {
                    this._rxProgress(this._rxReceived);
                }
            }
            return;
        }
        if (line === 'READY') {
            if (this._readyResolve) {
                const resolve = this._readyResolve;
                this._readyResolve = null;
                clearTimeout(this._readyTimer);
                resolve(true);
            } else {
                this._readyPending = true;
            }
        }
    }
    drainRxWaiters() {
        while (this._rxQueue.length && this._rxWaiters.length) {
            const waiter = this._rxWaiters.shift();
            clearTimeout(waiter.timer);
            waiter.resolve(this._rxQueue.shift());
        }
    }
    receiveFrame(onProgress) {
        this._rxProgress = onProgress || null;
        if (this._rxQueue.length) {
            return Promise.resolve(this._rxQueue.shift());
        }
        return new Promise((resolve, reject) => {
            const waiter = {
                resolve: resolve,
                timer: setTimeout(() => {
                    const index = this._rxWaiters.indexOf(waiter);
                    if (index !== -1) {
                        this._rxWaiters.splice(index, 1);
                    }
                    reject(new Error('Data receive timeout'));
                }, this.timeoutDuration)
            };
            this._rxWaiters.push(waiter);
        });
    }
    async stopReceiving() {
        if (!this._rxActive) {
            return;
        }
        this._rxActive = false;
        this.characteristic.removeEventListener('characteristicvaluechanged', this._rxHandler);
        try {
            await this.characteristic.stopNotifications();
        } catch (e) {}
        this._rxProgress = null;
        if (this._readyResolve) {
            clearTimeout(this._readyTimer);
            this._readyResolve = null;
        }
        const waiters = this._rxWaiters;
        this._rxQueue = [];
        this._rxWaiters = [];
        waiters.forEach(waiter => {
            clearTimeout(waiter.timer);
            waiter.reject(new Error('Receiving stopped'));
        });
    }
    async notifyReady() {
        const encoder = new TextEncoder();
        await this.withTimeout(
            this.characteristic.writeValue(encoder.encode('READY\n')),
            this.timeoutDuration,
            'Ready signal send timeout'
        );
    }
    waitReady(maxWait) {
        if (this._readyPending) {
            this._readyPending = false;
            return Promise.resolve(true);
        }
        return new Promise((resolve, reject) => {
            this._readyResolve = resolve;
            this._readyTimer = setTimeout(() => {
                if (this._readyResolve) {
                    this._readyResolve = null;
                    reject(new Error('Receiver not ready timeout'));
                }
            }, maxWait || this.timeoutDuration);
        });
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    withTimeout(promise, timeout, errorMessage) {
        return Promise.race([
            promise,
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(errorMessage)), timeout);
            })
        ]);
    }
    async exportDataViaBluetooth(gameData, onProgress) {
        try {
            if (!this.isSupported) {
                throw new Error(window.i18n ? window.i18n.t('bluetoothNotSupported') : 'Bluetooth is not supported in this browser');
            }
            if (!this.currentPin) {
                this.currentPin = this.generatePin();
            }
            this.isVerified = true;
            const device = await this.getConnectableDevice();
            if (!this.server || !this.server.connected) {
                await this.connect(device);
            }
            await this.startReceiving();
            await this.waitReady(60000);
            await this.sendData({ type: 'pin', pin: this.currentPin });
            await this.sendData({ type: 'gameData', data: gameData }, onProgress);
            this.lastDeviceVerified = true;
            this.enterLiveMode(device.name || 'Unknown Device');
            return {
                success: true,
                pin: this.currentPin,
                device: device.name || 'Unknown Device'
            };
        } catch (error) {
            console.error('Bluetooth export failed:', error);
            try {
                await this.stopReceiving();
            } catch (e) {}
            throw error;
        }
    }
    async importDataViaBluetooth(onProgress) {
        try {
            if (!this.isSupported) {
                throw new Error(window.i18n ? window.i18n.t('bluetoothNotSupported') : 'Bluetooth is not supported in this browser');
            }
            const device = await this.getConnectableDevice();
            if (!this.server || !this.server.connected) {
                await this.connect(device);
            }
            await this.startReceiving();
            let waitingForPin = true;
            const readyLoop = (async () => {
                while (waitingForPin) {
                    try {
                        await this.notifyReady();
                    } catch (e) {}
                    await this.delay(2000);
                }
            })();
            let pinFrame;
            try {
                pinFrame = await this.receiveFrame();
            } finally {
                waitingForPin = false;
            }
            const pinData = JSON.parse(pinFrame);
            if (pinData.type !== 'pin') {
                throw new Error('Expected PIN data but received something else');
            }
            this.currentPin = pinData.pin;
            const userPin = prompt(
                (window.i18n ? window.i18n.t('bluetoothImportPin') : 'Please enter the PIN shown on the sending device') + ':\n' + pinData.pin + '\n' + (window.i18n ? window.i18n.t('enterPinToVerify') : 'Please enter the above PIN to verify')
            );
            if (userPin !== pinData.pin) {
                throw new Error('PIN verification failed');
            }
            this.isVerified = true;
            const frame = await this.receiveFrame(onProgress);
            const payload = JSON.parse(frame);
            const calculatedChecksum = this.calculateChecksum(payload.data);
            if (calculatedChecksum !== payload.checksum) {
                throw new Error('Data integrity check failed');
            }
            const gameData = JSON.parse(payload.data);
            if (gameData.type !== 'gameData') {
                throw new Error('Invalid data type received');
            }
            this.lastDeviceVerified = true;
            this.enterLiveMode((this.device && this.device.name) || 'Unknown Device');
            return gameData.data;
        } catch (error) {
            console.error('Bluetooth import failed:', error);
            try {
                await this.stopReceiving();
            } catch (e) {}
            throw error;
        }
    }
    verifyPin(pin) {
        if (this.currentPin && pin === this.currentPin) {
            this.isVerified = true;
            return true;
        }
        return false;
    }
    enterLiveMode(deviceName) {
        this.liveMode = true;
        this.connectedDeviceName = deviceName || (this.device && this.device.name) || null;
        this._readyPending = false;
        this._rxQueue = [];
        const pendingWaiters = this._rxWaiters;
        this._rxWaiters = [];
        pendingWaiters.forEach(waiter => {
            clearTimeout(waiter.timer);
            waiter.resolve(null);
        });
        if (this.onConnected) {
            this.onConnected(this.connectedDeviceName);
        }
    }
    dispatchLiveFrame(frame) {
        try {
            const payload = JSON.parse(frame);
            if (payload.checksum && this.calculateChecksum(payload.data) !== payload.checksum) {
                console.warn('Live sync checksum mismatch');
                return;
            }
            const message = JSON.parse(payload.data);
            if (message && message.type === 'stateUpdate' && window.SyncLive) {
                window.SyncLive.handleRemoteMessage('bluetooth', message);
            }
        } catch (error) {
            console.warn('Live sync frame parse failed:', error);
        }
    }
    enqueueSend(message) {
        const run = this._txChain.then(() => this.sendData(message));
        this._txChain = run.catch(() => {});
        return run;
    }
    handleLinkFailure() {
        if (this.liveMode) {
            this.disconnect();
        }
    }
    handleUnexpectedDisconnect() {
        const callback = this.onDisconnected;
        this.liveMode = false;
        if (this._rxActive) {
            this.stopReceiving();
        }
        if (this.device && this._gattDisconnectHandler) {
            try {
                this.device.removeEventListener('gattserverdisconnected', this._gattDisconnectHandler);
            } catch (e) {}
        }
        this.server = null;
        this.characteristic = null;
        this.device = null;
        this.connectedDeviceName = null;
        this.currentPin = null;
        this.isVerified = false;
        this._readyPending = false;
        this._rxQueue = [];
        this._rxWaiters = [];
        this._txChain = Promise.resolve();
        if (callback) {
            callback();
        }
    }
    disconnect() {
        const wasLive = this.liveMode;
        this.liveMode = false;
        if (this._rxActive) {
            this.stopReceiving();
        }
        if (this.device && this._gattDisconnectHandler) {
            try {
                this.device.removeEventListener('gattserverdisconnected', this._gattDisconnectHandler);
            } catch (e) {}
        }
        if (this.server && this.server.connected) {
            try {
                this.server.disconnect();
            } catch (e) {}
        }
        this.server = null;
        this.characteristic = null;
        this.device = null;
        this.connectedDeviceName = null;
        this.currentPin = null;
        this.isVerified = false;
        this._readyPending = false;
        this._rxQueue = [];
        this._rxWaiters = [];
        this._txChain = Promise.resolve();
        if (wasLive && this.onDisconnected) {
            this.onDisconnected();
        }
    }
}
window.SyncLive = window.SyncLive || {
    _transports: {},
    _timer: null,
    _saveHookInstalled: false,
    _storageHookInstalled: false,
    register(name, transport) {
        this._transports[name] = transport;
    },
    setIncludeSettings(name, value) {
        const transport = this._transports[name];
        if (transport) {
            transport.includeSettings = !!value;
        }
    },
    setEnabled(name, value) {
        const transport = this._transports[name];
        if (transport) {
            transport.enabled = !!value;
        }
    },
    notifyStateChanged() {
        this._schedule(500);
    },
    notifySettingsChanged() {
        this._schedule(250);
    },
    flushTransport(name) {
        const transport = this._transports[name];
        if (transport && transport.isConnected() && transport.enabled !== false) {
            this._sendTo(transport);
        }
    },
    _schedule(delay) {
        if (!this._hasConnectedTransport()) {
            return;
        }
        clearTimeout(this._timer);
        this._timer = setTimeout(() => this._flush(), delay);
    },
    _hasConnectedTransport() {
        return Object.keys(this._transports).some(name => {
            const transport = this._transports[name];
            return !!(transport && transport.isConnected() && transport.enabled !== false);
        });
    },
    _flush() {
        Object.keys(this._transports).forEach(name => {
            const transport = this._transports[name];
            if (transport && transport.isConnected() && transport.enabled !== false) {
                this._sendTo(transport);
            }
        });
    },
    _sendTo(transport) {
        try {
            const snapshot = getGameDataForExport(transport.includeSettings !== false);
            Promise.resolve(transport.send({ type: 'stateUpdate', data: snapshot })).catch(error => {
                console.warn('Live sync send failed:', error);
                if (transport.onSendError) {
                    transport.onSendError(error);
                }
            });
        } catch (error) {
            console.warn('Live sync snapshot failed:', error);
        }
    },
    handleRemoteMessage(name, message) {
        const transport = this._transports[name];
        if (!message || !message.data || (transport && transport.enabled === false)) {
            return;
        }
        this._applyRemote(message.data);
    },
    _applyRemote(data) {
        window.__remoteSyncApply = true;
        try {
            applyImportedData(data);
        } catch (error) {
            console.warn('Apply remote sync data failed:', error);
        } finally {
            window.__remoteSyncApply = false;
        }
        try {
            if (typeof loadGameState === 'function') {
                loadGameState();
            }
        } catch (error) {
            console.warn('Reload game state after sync failed:', error);
        }
    },
    installHooks() {
        if (!this._saveHookInstalled && typeof window.saveGameState === 'function') {
            this._saveHookInstalled = true;
            const originalSave = window.saveGameState;
            window.saveGameState = function() {
                const result = originalSave.apply(this, arguments);
                if (!window.__remoteSyncApply) {
                    window.SyncLive.notifyStateChanged();
                }
                return result;
            };
        }
        if (!this._storageHookInstalled) {
            try {
                const prefix = window.SETTING_PREFIX || '2048-setting-';
                const originalSetItem = localStorage.setItem.bind(localStorage);
                localStorage.setItem = function(key, value) {
                    const result = originalSetItem(key, value);
                    if (!window.__remoteSyncApply && typeof key === 'string' && key.indexOf(prefix) === 0) {
                        window.SyncLive.notifySettingsChanged();
                    }
                    return result;
                };
                this._storageHookInstalled = true;
            } catch (error) {
                console.warn('Install settings sync hook failed:', error);
            }
        }
    }
};
window.SyncIndicator = window.SyncIndicator || {
    current: null,
    meta: {
        bluetooth: { labelKey: 'bluetoothConnectedBadge', icon: 'fa-brands fa-bluetooth-b' },
        webrtc: { labelKey: 'webrtcConnectedBadge', icon: 'fa-solid fa-tower-broadcast' }
    },
    set(name) {
        this.current = name;
        this.render();
    },
    clear(name) {
        if (name && this.current !== name) {
            return;
        }
        this.current = null;
        this.render();
    },
    refresh() {
        this.render();
    },
    render() {
        const indicator = document.getElementById('sync-indicator');
        if (!indicator) {
            return;
        }
        const meta = this.current ? this.meta[this.current] : null;
        if (!meta) {
            indicator.classList.add('hidden');
            indicator.classList.remove('flex');
            return;
        }
        indicator.classList.remove('hidden');
        indicator.classList.add('flex');
        const icon = document.getElementById('sync-indicator-icon');
        const text = document.getElementById('sync-indicator-text');
        if (icon) {
            icon.className = meta.icon + ' mr-1';
        }
        if (text) {
            text.textContent = window.i18n ? window.i18n.t(meta.labelKey) : meta.labelKey;
        }
        const disconnectBtn = document.getElementById('sync-indicator-disconnect');
        if (disconnectBtn) {
            disconnectBtn.title = window.i18n ? window.i18n.t('disconnectConnection') : '';
        }
    }
};
let bluetoothSyncInstance = null;
function initBluetoothSync() {
    bluetoothSyncInstance = new BluetoothSync();
    setupBluetoothUI();
    setupSyncIndicator();
    window.SyncLive.installHooks();
    if (typeof window.saveGameState !== 'function') {
        const retryInstall = () => window.SyncLive.installHooks();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', retryInstall, { once: true });
        }
        setTimeout(retryInstall, 1000);
    }
    bluetoothSyncInstance.onConnected = () => {
        window.SyncIndicator.set('bluetooth');
    };
    bluetoothSyncInstance.onDisconnected = () => {
        window.SyncIndicator.clear('bluetooth');
        updateBluetoothSelectPanel();
    };
    window.SyncLive.register('bluetooth', {
        includeSettings: true,
        enabled: true,
        isConnected: () => !!(bluetoothSyncInstance && bluetoothSyncInstance.liveMode),
        send: message => bluetoothSyncInstance.enqueueSend(message),
        disconnect: () => bluetoothSyncInstance.disconnect(),
        onSendError: () => bluetoothSyncInstance.handleLinkFailure()
    });
}
function setupSyncIndicator() {
    const openBtn = document.getElementById('sync-indicator-open');
    if (openBtn && !openBtn._syncBound) {
        openBtn._syncBound = true;
        openBtn.addEventListener('click', () => {
            const current = window.SyncIndicator.current;
            if (current === 'bluetooth') {
                showBluetoothModal('select');
            } else if (current === 'webrtc') {
                showWebRTCModal('connected');
            }
        });
    }
    const disconnectBtn = document.getElementById('sync-indicator-disconnect');
    if (disconnectBtn && !disconnectBtn._syncBound) {
        disconnectBtn._syncBound = true;
        disconnectBtn.addEventListener('click', () => {
            const current = window.SyncIndicator.current;
            const transport = window.SyncLive._transports[current];
            if (transport && transport.disconnect) {
                transport.disconnect();
            }
        });
    }
}
function setupBluetoothUI() {
    const bluetoothSyncBtn = document.getElementById('bluetooth-sync-button');
    const bluetoothExportSelect = document.getElementById('bluetooth-export-select');
    const bluetoothImportSelect = document.getElementById('bluetooth-import-select');
    const backToSelectFromExport = document.getElementById('back-to-select-from-export');
    const backToSelectFromImport = document.getElementById('back-to-select-from-import');
    const bluetoothModal = document.getElementById('bluetooth-modal');
    const closeBluetoothModal = document.getElementById('close-bluetooth-modal');
    if (bluetoothSyncBtn) {
        bluetoothSyncBtn.addEventListener('click', () => {
            showBluetoothModal('select');
        });
    }
    if (bluetoothExportSelect) {
        bluetoothExportSelect.addEventListener('click', handleBluetoothExport);
    }
    if (bluetoothImportSelect) {
        bluetoothImportSelect.addEventListener('click', handleBluetoothImport);
    }
    if (backToSelectFromExport) {
        backToSelectFromExport.addEventListener('click', () => {
            showBluetoothModal('select');
        });
    }
    if (backToSelectFromImport) {
        backToSelectFromImport.addEventListener('click', () => {
            showBluetoothModal('select');
        });
    }
    if (closeBluetoothModal) {
        closeBluetoothModal.addEventListener('click', () => {
            hideBluetoothModal();
            if (bluetoothSyncInstance && !bluetoothSyncInstance.liveMode) {
                bluetoothSyncInstance.dismissed = true;
                bluetoothSyncInstance.disconnect();
            }
        });
    }
    const bluetoothDisconnectBtn = document.getElementById('bluetooth-disconnect-button');
    if (bluetoothDisconnectBtn) {
        bluetoothDisconnectBtn.addEventListener('click', () => {
            if (bluetoothSyncInstance) {
                bluetoothSyncInstance.disconnect();
            }
            updateBluetoothSelectPanel();
        });
    }
    const bindSettingsCheckbox = (id) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                window.SyncLive.setIncludeSettings('bluetooth', checkbox.checked);
                if (bluetoothSyncInstance && bluetoothSyncInstance.liveMode) {
                    window.SyncLive.flushTransport('bluetooth');
                }
            });
        }
    };
    bindSettingsCheckbox('bluetooth-export-settings-checkbox');
    bindSettingsCheckbox('bluetooth-import-settings-checkbox');
    const liveSyncCheckbox = document.getElementById('bluetooth-live-sync-checkbox');
    if (liveSyncCheckbox) {
        liveSyncCheckbox.addEventListener('change', () => {
            window.SyncLive.setEnabled('bluetooth', liveSyncCheckbox.checked);
            if (liveSyncCheckbox.checked && bluetoothSyncInstance && bluetoothSyncInstance.liveMode) {
                window.SyncLive.flushTransport('bluetooth');
            }
        });
    }
}
function updateBluetoothSelectPanel() {
    const panel = document.getElementById('bluetooth-connected-panel');
    const actions = document.getElementById('bluetooth-select-actions');
    const live = !!(bluetoothSyncInstance && bluetoothSyncInstance.liveMode);
    if (panel) {
        panel.style.display = live ? 'block' : 'none';
    }
    if (actions) {
        actions.style.display = live ? 'none' : 'flex';
    }
    const nameEl = document.getElementById('bluetooth-live-device-name');
    if (nameEl && live) {
        nameEl.textContent = bluetoothSyncInstance.connectedDeviceName || '-';
    }
}
function getGameDataForExport(includeSettings) {
    const gameState = window.gameState;
    const gameData = {
        gameState: {
            grid: gameState.grid,
            gridSize: gameState.gridSize,
            gridRows: gameState.gridRows,
            gridCols: gameState.gridCols,
            score: gameState.score,
            bestScore: gameState.bestScore,
            gameOver: gameState.gameOver,
            gameWon: gameState.gameWon,
            isEndlessMode: gameState.isEndlessMode,
            difficulty: gameState.difficulty,
            history: []
        },
        bestScore: gameState.bestScore
    };
    if (includeSettings) {
        gameData.settings = window.SettingStore.getAll();
    }
    return gameData;
}
function applyImportedData(importedData) {
    const gameState = window.gameState;
    if (importedData.gameState) {
        if (importedData.gameState.grid !== undefined) {
            gameState.grid = importedData.gameState.grid;
        }
        if (importedData.gameState.gridSize !== undefined) {
            gameState.gridSize = importedData.gameState.gridSize;
        }
        if (importedData.gameState.gridRows !== undefined) {
            gameState.gridRows = importedData.gameState.gridRows;
        }
        if (importedData.gameState.gridCols !== undefined) {
            gameState.gridCols = importedData.gameState.gridCols;
        }
        if (importedData.gameState.score !== undefined) {
            gameState.score = importedData.gameState.score;
        }
        if (importedData.gameState.gameOver !== undefined) {
            gameState.gameOver = importedData.gameState.gameOver;
        }
        if (importedData.gameState.gameWon !== undefined) {
            gameState.gameWon = importedData.gameState.gameWon;
        }
        if (importedData.gameState.isEndlessMode !== undefined) {
            gameState.isEndlessMode = importedData.gameState.isEndlessMode;
        }
        if (importedData.gameState.difficulty !== undefined) {
            gameState.difficulty = importedData.gameState.difficulty;
        }
        gameState.history = [];
    }
    if (importedData.bestScore !== undefined) {
        gameState.bestScore = importedData.bestScore;
        localStorage.setItem('2048-best-score', importedData.bestScore);
    }
    if (importedData.settings) {
        for (const [key, value] of Object.entries(importedData.settings)) {
            if (value !== null) {
                window.SettingStore.set(key, value);
            }
        }
    }
    saveGameState();
}
async function handleBluetoothExport() {
    try {
        if (!bluetoothSyncInstance) {
            alert(window.i18n ? window.i18n.t('bluetoothModuleError') : 'Bluetooth module error');
            return;
        }
        if (!bluetoothSyncInstance.isSupported) {
            alert(window.i18n ? window.i18n.t('bluetoothNotSupported') : 'Bluetooth is not supported in this browser');
            return;
        }
        bluetoothSyncInstance.dismissed = false;
        showBluetoothModal('export');
        const pin = bluetoothSyncInstance.generatePin();
        bluetoothSyncInstance.currentPin = pin;
        document.getElementById('bluetooth-pin-display').textContent = pin;
        document.getElementById('bluetooth-device-name').textContent = window.i18n ? window.i18n.t('ready') : 'Ready';
        const progressBar = document.getElementById('bluetooth-export-progress');
        const progressText = document.getElementById('bluetooth-export-progress-text');
        const progressBarFill = progressBar ? progressBar.querySelector('.bg-blue-600') : null;
        if (progressBar && progressText && progressBarFill) {
            progressBar.style.display = 'block';
            progressText.style.display = 'block';
            progressBarFill.style.width = '0%';
            progressText.textContent = '0%';
        }
        const includeSettings = document.getElementById('bluetooth-export-settings-checkbox').checked;
        window.SyncLive.setIncludeSettings('bluetooth', includeSettings);
        const gameData = getGameDataForExport(includeSettings);
        const result = await bluetoothSyncInstance.exportDataViaBluetooth(gameData, (progress) => {
            if (progressBar && progressText && progressBarFill) {
                progressBarFill.style.width = progress + '%';
                progressText.textContent = `${progress}%`;
            }
        });
        if (result.success) {
            if (progressBarFill) {
                progressBarFill.style.width = '100%';
                if (progressText) {
                    progressText.textContent = '100%';
                }
            }
            document.getElementById('bluetooth-device-name').textContent = `${window.i18n ? window.i18n.t('connected') : 'Connected'}: ${result.device}`;
            setTimeout(() => {
                if (!bluetoothSyncInstance.dismissed) {
                    alert(window.i18n ? window.i18n.t('bluetoothExportSuccess') : 'Bluetooth export successful!');
                }
                hideBluetoothModal();
            }, 1000);
        }
    } catch (error) {
        console.error('Bluetooth export error:', error);
        if (bluetoothSyncInstance.dismissed) {
            bluetoothSyncInstance.dismissed = false;
            hideBluetoothModal();
            return;
        }
        alert((window.i18n ? window.i18n.t('bluetoothExportFailed') : 'Bluetooth export failed') + ': ' + error.message);
        showBluetoothModal('select');
    }
}
async function handleBluetoothImport() {
    try {
        if (!bluetoothSyncInstance) {
            alert(window.i18n ? window.i18n.t('bluetoothModuleError') : 'Bluetooth module error');
            return;
        }
        if (!bluetoothSyncInstance.isSupported) {
            alert(window.i18n ? window.i18n.t('bluetoothNotSupported') : 'Bluetooth is not supported in this browser');
            return;
        }
        bluetoothSyncInstance.dismissed = false;
        showBluetoothModal('import');
        await verifyPinAndImport();
    } catch (error) {
        console.error('Bluetooth import error:', error);
        if (bluetoothSyncInstance.dismissed) {
            bluetoothSyncInstance.dismissed = false;
            hideBluetoothModal();
            return;
        }
        alert((window.i18n ? window.i18n.t('bluetoothImportFailed') : 'Bluetooth import failed') + ': ' + error.message);
        showBluetoothModal('select');
    }
}
async function verifyPinAndImport() {
    try {
        if (!bluetoothSyncInstance) {
            alert(window.i18n ? window.i18n.t('bluetoothModuleError') : 'Bluetooth module error');
            return;
        }
        const importCheckbox = document.getElementById('bluetooth-import-settings-checkbox');
        window.SyncLive.setIncludeSettings('bluetooth', importCheckbox ? importCheckbox.checked : true);
        const progressBar = document.getElementById('bluetooth-import-progress');
        const progressText = document.getElementById('bluetooth-import-progress-text');
        const progressBarFill = progressBar ? progressBar.querySelector('.bg-green-600') : null;
        if (progressBar && progressText && progressBarFill) {
            progressBar.style.display = 'block';
            progressText.style.display = 'block';
            progressBarFill.style.width = '0%';
            progressText.textContent = (window.i18n ? window.i18n.t('receiving') : 'Receiving') + '...';
        }
        const importedData = await bluetoothSyncInstance.importDataViaBluetooth((bytesReceived, progress, totalSize) => {
            if (progressText) {
                if (totalSize) {
                    progressText.textContent = (window.i18n ? window.i18n.t('receivingBytesTotal', { bytes: bytesReceived, total: totalSize }) : `Receiving: ${bytesReceived} / ${totalSize} bytes`);
                } else {
                    progressText.textContent = (window.i18n ? window.i18n.t('receivingBytes', { bytes: bytesReceived }) : `Receiving: ${bytesReceived} bytes`);
                }
            }
            if (progressBarFill && progress !== undefined) {
                progressBarFill.style.width = progress + '%';
            }
        });
        if (progressBarFill) {
            progressBarFill.style.width = '100%';
        }
        if (importedData) {
            window.__remoteSyncApply = true;
            try {
                applyImportedData(importedData);
            } finally {
                window.__remoteSyncApply = false;
            }
            if (!bluetoothSyncInstance.dismissed) {
                alert(window.i18n ? window.i18n.t('bluetoothImportSuccess') : 'Bluetooth import successful!');
            }
            hideBluetoothModal();
            if (typeof loadGameState === 'function') {
                loadGameState();
            }
        }
    } catch (error) {
        console.error('Bluetooth import error:', error);
        if (bluetoothSyncInstance.dismissed) {
            hideBluetoothModal();
            return;
        }
        alert((window.i18n ? window.i18n.t('bluetoothImportFailed') : 'Bluetooth import failed') + ': ' + error.message);
        showBluetoothModal('select');
    }
}
function showBluetoothModal(mode) {
    updateBluetoothSelectPanel();
    const modal = document.getElementById('bluetooth-modal');
    const selectSection = document.getElementById('bluetooth-select-section');
    const exportSection = document.getElementById('bluetooth-export-section');
    const importSection = document.getElementById('bluetooth-import-section');
    const content = modal?.querySelector('.bluetooth-content');
    if (modal && content) {
        content.style.opacity = '1';
        content.style.transform = 'scale(1)';
        content.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        content.style.opacity = '0';
        content.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (mode === 'select') {
                selectSection.style.display = 'block';
                exportSection.style.display = 'none';
                importSection.style.display = 'none';
            } else if (mode === 'export') {
                selectSection.style.display = 'none';
                exportSection.style.display = 'block';
                importSection.style.display = 'none';
            } else if (mode === 'import') {
                selectSection.style.display = 'none';
                exportSection.style.display = 'none';
                importSection.style.display = 'block';
            }
            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'scale(1)';
            }, 10);
        }, 200);
        if (modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
            modal.classList.add('modal-enter');
            setTimeout(() => {
                modal.classList.add('modal-enter-active');
            }, 10);
        }
    }
}
function hideBluetoothModal() {
    const modal = document.getElementById('bluetooth-modal');
    if (modal) {
        modal.classList.remove('modal-enter-active');
        modal.classList.add('modal-exit-active');
        const content = modal.querySelector('.bluetooth-content');
        if (content) {
            content.classList.remove('modal-enter-active');
            content.classList.add('modal-exit-active');
        }
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('modal-enter', 'modal-exit-active');
            if (content) {
                content.classList.remove('modal-enter', 'modal-exit-active');
            }
        }, 300);
    }
}
window.bluetoothSync = {
    version: bluetoothSyncVersion,
    init: initBluetoothSync,
    get instance() {
        return bluetoothSyncInstance;
    }
};
