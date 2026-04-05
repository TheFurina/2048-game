const bluetoothSyncVersion = '1.0';
window.bluetoothSyncVersion = bluetoothSyncVersion;
class BluetoothSync {
    constructor() {
        this.isSupported = 'bluetooth' in navigator && !window.simulateNoBluetooth;
        this.server = null;
        this.characteristic = null;
        this.currentPin = null;
        this.isVerified = false;
        this.maxRetries = 3;
        this.timeoutDuration = 15000;
        this.discoverAllDevices = false;
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
                requestOptions.filters = [{ services: ['generic_access'] }];
            }
            const device = await this.withTimeout(
                navigator.bluetooth.requestDevice(requestOptions),
                this.timeoutDuration,
                'Device selection timeout'
            );
            return device;
        } catch (error) {
            console.error('Bluetooth device selection failed:', error);
            throw error;
        }
    }
    async connect(device) {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                this.server = await this.withTimeout(
                    device.gatt.connect(),
                    this.timeoutDuration,
                    'Connection timeout'
                );
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
            const payloadString = JSON.stringify(payload);
            const totalSize = payloadString.length;
            await this.withTimeout(
                this.characteristic.writeValue(encoder.encode('SIZE:' + totalSize + '\n')),
                this.timeoutDuration,
                'Size send timeout'
            );
            await this.delay(100);
            const chunks = this.chunkData(payloadString, 20);
            for (let i = 0; i < chunks.length; i++) {
                await this.withTimeout(
                    this.characteristic.writeValue(encoder.encode(chunks[i] + '\n')),
                    this.timeoutDuration,
                    'Data send timeout'
                );
                await this.delay(100);
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
    async receiveData(onProgress) {
        try {
            let receivedData = '';
            let isComplete = false;
            let totalSize = null;
            let receivedSize = 0;
            const decoder = new TextDecoder();
            const notificationCallback = (event) => {
                const value = event.target.value;
                const chunk = decoder.decode(value);
                if (chunk.startsWith('SIZE:')) {
                    const sizeStr = chunk.substring(5).trim();
                    totalSize = parseInt(sizeStr, 10);
                    return;
                }
                if (chunk.trim() === 'END') {
                    isComplete = true;
                    return;
                }
                receivedData += chunk;
                receivedSize += chunk.length;
                if (onProgress) {
                    if (totalSize) {
                        const progress = Math.min(Math.round((receivedSize / totalSize) * 100), 99);
                        onProgress(receivedSize, progress, totalSize);
                    } else {
                        onProgress(receivedSize);
                    }
                }
            };
            await this.withTimeout(
                this.characteristic.startNotifications(),
                this.timeoutDuration,
                'Notification start timeout'
            );
            this.characteristic.addEventListener('characteristicvaluechanged', notificationCallback);
            const startTime = Date.now();
            while (!isComplete && (Date.now() - startTime) < this.timeoutDuration) {
                await this.delay(100);
            }
            this.characteristic.removeEventListener('characteristicvaluechanged', notificationCallback);
            await this.characteristic.stopNotifications();
            if (!isComplete) {
                throw new Error('Data receive timeout');
            }
            const payload = JSON.parse(receivedData);
            const calculatedChecksum = this.calculateChecksum(payload.data);
            if (calculatedChecksum !== payload.checksum) {
                throw new Error('Data integrity check failed');
            }
            return JSON.parse(payload.data);
        } catch (error) {
            console.error('Data receiving failed:', error);
            throw error;
        }
    }
    chunkData(data, chunkSize) {
        const chunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            chunks.push(data.slice(i, i + chunkSize));
        }
        return chunks;
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
                throw new Error(i18n.t('bluetoothNotSupported'));
            }
            this.currentPin = this.generatePin();
            this.isVerified = true;
            const device = await this.requestDevice();
            await this.connect(device);
            await this.sendData({ type: 'pin', pin: this.currentPin });
            await this.sendData({ type: 'gameData', data: gameData }, onProgress);
            return {
                success: true,
                pin: this.currentPin,
                device: device.name
            };
        } catch (error) {
            console.error('Bluetooth export failed:', error);
            throw error;
        }
    }
    async importDataViaBluetooth(onProgress) {
        try {
            if (!this.isSupported) {
                throw new Error(i18n.t('bluetoothNotSupported'));
            }
            const device = await this.requestDevice();
            await this.connect(device);
            const pinData = await this.receiveData();
            if (pinData.type === 'pin') {
                this.currentPin = pinData.pin;
                const userPin = prompt(i18n.t('bluetoothImportPin') + ':\n' + pinData.pin + '\n' + i18n.t('enterPinToVerify'));
                if (userPin === pinData.pin) {
                    this.isVerified = true;
                    const gameData = await this.receiveData(onProgress);
                    if (gameData.type === 'gameData') {
                        return gameData.data;
                    } else {
                        throw new Error('Invalid data type received');
                    }
                } else {
                    throw new Error('PIN verification failed');
                }
            } else {
                throw new Error('Expected PIN data but received something else');
            }
        } catch (error) {
            console.error('Bluetooth import failed:', error);
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
    disconnect() {
        if (this.server && this.server.connected) {
            this.server.disconnect();
        }
        this.server = null;
        this.characteristic = null;
        this.currentPin = null;
        this.isVerified = false;
    }
}
let bluetoothSyncInstance = null;
function initBluetoothSync() {
    bluetoothSyncInstance = new BluetoothSync();
    setupBluetoothUI();
}
function setupBluetoothUI() {
    const bluetoothSyncBtn = document.getElementById('bluetooth-sync-button');
    const bluetoothExportSelect = document.getElementById('bluetooth-export-select');
    const bluetoothImportSelect = document.getElementById('bluetooth-import-select');
    const backToSelectFromExport = document.getElementById('back-to-select-from-export');
    const backToSelectFromImport = document.getElementById('back-to-select-from-import');
    const bluetoothModal = document.getElementById('bluetooth-modal');
    const closeBluetoothModal = document.getElementById('close-bluetooth-modal');
    const pinInput = document.getElementById('bluetooth-pin-input');
    const verifyPinBtn = document.getElementById('verify-pin-button');
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
            if (bluetoothSyncInstance) {
                bluetoothSyncInstance.disconnect();
            }
        });
    }
    if (verifyPinBtn) {
        verifyPinBtn.addEventListener('click', verifyPinAndImport);
    }
}
async function handleBluetoothExport() {
    try {
        if (!bluetoothSyncInstance) {
            alert(i18n.t('bluetoothModuleError'));
            return;
        }
        if (!bluetoothSyncInstance.isSupported) {
            alert(i18n.t('bluetoothNotSupported'));
            return;
        }
        showBluetoothModal('export');
        const pin = bluetoothSyncInstance.generatePin();
        bluetoothSyncInstance.currentPin = pin;
        document.getElementById('bluetooth-pin-display').textContent = pin;
        document.getElementById('bluetooth-device-name').textContent = i18n.t('ready');
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
        const gameData = {
            gameState: window.gameState,
            bestScore: window.bestScore
        };
        if (includeSettings) {
            gameData.gameSize = window.gameSize;
            gameData.theme = window.theme;
            gameData.music = window.musicEnabled;
            gameData.sound = window.soundEnabled;
            gameData.vibration = window.vibrationEnabled;
        }
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
            document.getElementById('bluetooth-device-name').textContent = `${i18n.t('connected')}: ${result.device}`;
            setTimeout(() => {
                alert(i18n.t('bluetoothExportSuccess'));
                hideBluetoothModal();
            }, 1000);
        }
    } catch (error) {
        console.error('Bluetooth export error:', error);
        alert(i18n.t('bluetoothExportFailed') + ': ' + error.message);
        showBluetoothModal('select');
    }
}
async function handleBluetoothImport() {
    try {
        if (!bluetoothSyncInstance) {
            alert(i18n.t('bluetoothModuleError'));
            return;
        }
        if (!bluetoothSyncInstance.isSupported) {
            alert(i18n.t('bluetoothNotSupported'));
            return;
        }
        showBluetoothModal('import');
        await verifyPinAndImport();
    } catch (error) {
        console.error('Bluetooth import error:', error);
        alert(i18n.t('bluetoothImportFailed') + ': ' + error.message);
        showBluetoothModal('select');
    }
}
async function verifyPinAndImport() {
    try {
        if (!bluetoothSyncInstance) {
            alert(i18n.t('bluetoothModuleError'));
            return;
        }
        const progressBar = document.getElementById('bluetooth-import-progress');
        const progressText = document.getElementById('bluetooth-import-progress-text');
        const progressBarFill = progressBar ? progressBar.querySelector('.bg-green-600') : null;
        if (progressBar && progressText && progressBarFill) {
            progressBar.style.display = 'block';
            progressText.style.display = 'block';
            progressBarFill.style.width = '0%';
            progressText.textContent = i18n.t('receiving') + '...';
        }
        const importedData = await bluetoothSyncInstance.importDataViaBluetooth((bytesReceived, progress, totalSize) => {
            if (progressText) {
                if (totalSize) {
                    progressText.textContent = i18n.t('receivingBytesTotal', { bytes: bytesReceived, total: totalSize });
                } else {
                    progressText.textContent = i18n.t('receivingBytes', { bytes: bytesReceived });
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
            if (importedData.gameState) {
                window.gameState = importedData.gameState;
            }
            if (importedData.bestScore !== undefined) {
                window.bestScore = importedData.bestScore;
                localStorage.setItem('2048-best-score', importedData.bestScore);
            }
            if (importedData.gameSize !== undefined) {
                window.gameSize = importedData.gameSize;
                localStorage.setItem('2048-game-size', importedData.gameSize);
            }
            if (importedData.theme) {
                window.theme = importedData.theme;
                localStorage.setItem('2048-theme', importedData.theme);
            }
            if (importedData.music !== undefined) {
                window.musicEnabled = importedData.music;
                localStorage.setItem('2048-music', importedData.music);
            }
            if (importedData.sound !== undefined) {
                window.soundEnabled = importedData.sound;
                localStorage.setItem('2048-sound', importedData.sound);
            }
            if (importedData.vibration !== undefined) {
                window.vibrationEnabled = importedData.vibration;
                localStorage.setItem('2048-vibration', importedData.vibration);
            }
            alert(i18n.t('bluetoothImportSuccess'));
            hideBluetoothModal();
            if (typeof initGame === 'function') {
                initGame();
            }
        }
    } catch (error) {
        console.error('Bluetooth import error:', error);
        alert(i18n.t('bluetoothImportFailed') + ': ' + error.message);
        showBluetoothModal('select');
    }
}
function showBluetoothModal(mode) {
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