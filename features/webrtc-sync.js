const webRTCSyncVersion = '0.2';
window.webRTCSyncVersion = webRTCSyncVersion;
class WebRTCSync {
    constructor() {
        this.pc = null;
        this.channel = null;
        this.role = null;
        this.connected = false;
        this.onConnected = null;
        this.onMessage = null;
        this.onDisconnected = null;
    }
    createPeer() {
        this.close();
        this.pc = new RTCPeerConnection();
        this.pc.ondatachannel = (event) => {
            this.channel = event.channel;
            this.bindChannel();
        };
        this.pc.onconnectionstatechange = () => {
            if (this.pc && (this.pc.connectionState === 'failed' || this.pc.connectionState === 'disconnected' || this.pc.connectionState === 'closed')) {
                this.connected = false;
                if (this.onDisconnected) {
                    this.onDisconnected();
                }
            }
        };
    }
    bindChannel() {
        this.channel.onopen = () => {
            this.connected = true;
            if (this.onConnected) {
                this.onConnected();
            }
        };
        this.channel.onmessage = (event) => {
            if (this.onMessage) {
                this.onMessage(event.data);
            }
        };
        this.channel.onclose = () => {
            this.connected = false;
            if (this.onDisconnected) {
                this.onDisconnected();
            }
        };
    }
    async createOffer() {
        this.createPeer();
        this.role = 'host';
        this.channel = this.pc.createDataChannel('2048-sync');
        this.bindChannel();
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        await this.waitIceGathering();
        return this.encodeCode(this.pc.localDescription);
    }
    async acceptAnswer(code) {
        if (!this.pc || this.role !== 'host') {
            throw new Error('No pending offer');
        }
        const desc = JSON.parse(await this.decodeCode(code));
        if (!desc || desc.type !== 'answer') {
            throw new Error('Invalid answer code');
        }
        await this.pc.setRemoteDescription(desc);
        return true;
    }
    async joinWithOffer(code) {
        this.createPeer();
        this.role = 'joiner';
        const desc = JSON.parse(await this.decodeCode(code));
        if (!desc || desc.type !== 'offer') {
            throw new Error('Invalid offer code');
        }
        await this.pc.setRemoteDescription(desc);
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        await this.waitIceGathering();
        return this.encodeCode(this.pc.localDescription);
    }
    waitIceGathering() {
        if (this.pc.iceGatheringState === 'complete') {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const finish = () => {
                this.pc.removeEventListener('icegatheringstatechange', onStateChange);
                clearTimeout(timer);
                resolve();
            };
            const onStateChange = () => {
                if (this.pc.iceGatheringState === 'complete') {
                    finish();
                }
            };
            const timer = setTimeout(finish, 3000);
            this.pc.addEventListener('icegatheringstatechange', onStateChange);
        });
    }
    send(message) {
        if (!this.connected || !this.channel) {
            throw new Error('Not connected');
        }
        this.channel.send(JSON.stringify(message));
    }
    sendData(gameData) {
        this.send({ type: 'gameData', data: gameData });
    }
    close() {
        if (this.channel) {
            try {
                this.channel.close();
            } catch (e) {}
            this.channel = null;
        }
        if (this.pc) {
            try {
                this.pc.close();
            } catch (e) {}
            this.pc = null;
        }
        this.connected = false;
        this.role = null;
    }
    async encodeCode(desc) {
        const text = JSON.stringify(desc);
        if (typeof CompressionStream === 'undefined') {
            return btoa(unescape(encodeURIComponent(text)));
        }
        const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('deflate-raw'));
        const buffer = await new Response(stream).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    async decodeCode(code) {
        const binary = atob(code.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        if (typeof DecompressionStream === 'undefined') {
            return decodeURIComponent(escape(binary));
        }
        try {
            const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
            return await new Response(stream).text();
        } catch (e) {
            return decodeURIComponent(escape(binary));
        }
    }
}
let webRTCSyncInstance = null;
function webrtcT(key, fallback) {
    return window.i18n && window.i18n.t ? window.i18n.t(key) : fallback;
}
function initWebRTCSync() {
    webRTCSyncInstance = new WebRTCSync();
    webRTCSyncInstance.onConnected = handleWebRTCConnected;
    webRTCSyncInstance.onMessage = handleWebRTCMessage;
    webRTCSyncInstance.onDisconnected = handleWebRTCDisconnected;
    setupWebRTCUI();
    window.SyncLive.register('webrtc', {
        includeSettings: true,
        enabled: true,
        isConnected: () => !!(webRTCSyncInstance && webRTCSyncInstance.connected),
        send: message => Promise.resolve().then(() => webRTCSyncInstance.send(message)),
        disconnect: () => handleWebRTCManualDisconnect(),
        onSendError: () => handleWebRTCDisconnected()
    });
}
function handleWebRTCConnected() {
    window.SyncIndicator.set('webrtc');
    const checkbox = document.getElementById('webrtc-settings-checkbox');
    window.SyncLive.setIncludeSettings('webrtc', checkbox ? checkbox.checked : true);
    const liveSyncCheckbox = document.getElementById('webrtc-live-sync-checkbox');
    window.SyncLive.setEnabled('webrtc', liveSyncCheckbox ? liveSyncCheckbox.checked : true);
    showWebRTCModal('connected');
    setWebrtcStatus('webrtc-connected-status', webrtcT('webrtcConnectedReady', '已连接，可以发送游戏数据'));
    setTimeout(() => {
        if (webRTCSyncInstance && webRTCSyncInstance.connected) {
            window.SyncLive.flushTransport('webrtc');
        }
    }, 400);
}
function handleWebRTCDisconnected() {
    window.SyncIndicator.clear('webrtc');
    setWebrtcStatus('webrtc-connected-status', webrtcT('webrtcDisconnected', '连接已断开'));
    updateWebRTCSelectPanel();
    const modal = document.getElementById('webrtc-modal');
    if (modal && !modal.classList.contains('hidden') && modal._webrtcMode === 'connected') {
        showWebRTCModal('select');
    }
}
function handleWebRTCManualDisconnect() {
    if (webRTCSyncInstance) {
        webRTCSyncInstance.close();
    }
    handleWebRTCDisconnected();
    const modal = document.getElementById('webrtc-modal');
    if (modal && !modal.classList.contains('hidden')) {
        showWebRTCModal('select');
    }
}
function updateWebRTCSelectPanel() {
    const live = !!(webRTCSyncInstance && webRTCSyncInstance.connected);
    const actions = document.getElementById('webrtc-select-actions');
    const panel = document.getElementById('webrtc-connected-panel');
    if (actions) {
        actions.style.display = live ? 'none' : 'flex';
    }
    if (panel) {
        panel.style.display = live ? 'block' : 'none';
    }
}
function setupWebRTCUI() {
    const webrtcSyncBtn = document.getElementById('webrtc-sync-button');
    const webrtcHostBtn = document.getElementById('webrtc-host-button');
    const webrtcJoinBtn = document.getElementById('webrtc-join-button');
    const webrtcAcceptAnswerBtn = document.getElementById('webrtc-accept-answer-button');
    const webrtcGenerateAnswerBtn = document.getElementById('webrtc-generate-answer-button');
    const webrtcSendBtn = document.getElementById('webrtc-send-button');
    const webrtcCopyOfferBtn = document.getElementById('webrtc-copy-offer');
    const webrtcCopyAnswerBtn = document.getElementById('webrtc-copy-answer');
    const closeWebrtcModal = document.getElementById('close-webrtc-modal');
    const webrtcHostBack = document.getElementById('webrtc-host-back');
    const webrtcJoinBack = document.getElementById('webrtc-join-back');
    const webrtcConnectedBack = document.getElementById('webrtc-connected-back');
    if (webrtcSyncBtn) {
        webrtcSyncBtn.addEventListener('click', () => {
            showWebRTCModal(webRTCSyncInstance && webRTCSyncInstance.connected ? 'connected' : 'select');
        });
    }
    if (webrtcHostBtn) {
        webrtcHostBtn.addEventListener('click', handleWebRTCHost);
    }
    if (webrtcJoinBtn) {
        webrtcJoinBtn.addEventListener('click', () => {
            showWebRTCModal('join');
        });
    }
    if (webrtcAcceptAnswerBtn) {
        webrtcAcceptAnswerBtn.addEventListener('click', handleWebRTCAcceptAnswer);
    }
    if (webrtcGenerateAnswerBtn) {
        webrtcGenerateAnswerBtn.addEventListener('click', handleWebRTCJoin);
    }
    if (webrtcSendBtn) {
        webrtcSendBtn.addEventListener('click', handleWebRTCSend);
    }
    if (webrtcCopyOfferBtn) {
        webrtcCopyOfferBtn.addEventListener('click', () => {
            copyWebrtcText('webrtc-offer-code');
        });
    }
    if (webrtcCopyAnswerBtn) {
        webrtcCopyAnswerBtn.addEventListener('click', () => {
            copyWebrtcText('webrtc-answer-code');
        });
    }
    if (closeWebrtcModal) {
        closeWebrtcModal.addEventListener('click', () => {
            hideWebRTCModal();
            if (webRTCSyncInstance && !webRTCSyncInstance.connected) {
                webRTCSyncInstance.close();
            }
        });
    }
    ['webrtc-disconnect-button', 'webrtc-select-disconnect-button'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', handleWebRTCManualDisconnect);
        }
    });
    const webrtcSettingsCheckbox = document.getElementById('webrtc-settings-checkbox');
    if (webrtcSettingsCheckbox) {
        webrtcSettingsCheckbox.addEventListener('change', () => {
            window.SyncLive.setIncludeSettings('webrtc', webrtcSettingsCheckbox.checked);
            if (webRTCSyncInstance && webRTCSyncInstance.connected) {
                window.SyncLive.flushTransport('webrtc');
            }
        });
    }
    const webrtcLiveSyncCheckbox = document.getElementById('webrtc-live-sync-checkbox');
    if (webrtcLiveSyncCheckbox) {
        webrtcLiveSyncCheckbox.addEventListener('change', () => {
            window.SyncLive.setEnabled('webrtc', webrtcLiveSyncCheckbox.checked);
            if (webrtcLiveSyncCheckbox.checked && webRTCSyncInstance && webRTCSyncInstance.connected) {
                window.SyncLive.flushTransport('webrtc');
            }
        });
    }
    if (webrtcHostBack) {
        webrtcHostBack.addEventListener('click', () => {
            showWebRTCModal('select');
        });
    }
    if (webrtcJoinBack) {
        webrtcJoinBack.addEventListener('click', () => {
            showWebRTCModal('select');
        });
    }
    if (webrtcConnectedBack) {
        webrtcConnectedBack.addEventListener('click', () => {
            showWebRTCModal('select');
        });
    }
}
async function handleWebRTCHost() {
    try {
        showWebRTCModal('host');
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcGeneratingCode', '正在生成连接码...'));
        const code = await webRTCSyncInstance.createOffer();
        document.getElementById('webrtc-offer-code').value = code;
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcHostInstructions', '1. 将连接码发送给对方\n2. 把对方回传的应答码粘贴到下方并点击"完成连接"'));
    } catch (error) {
        console.error('WebRTC host error:', error);
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcGenerateFailed', '生成连接码失败') + ': ' + error.message);
    }
}
async function handleWebRTCAcceptAnswer() {
    try {
        const input = document.getElementById('webrtc-answer-input');
        await webRTCSyncInstance.acceptAnswer(input.value);
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcConnecting', '正在建立连接...'));
    } catch (error) {
        console.error('WebRTC accept answer error:', error);
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcInvalidAnswer', '应答码无效') + ': ' + error.message);
    }
}
async function handleWebRTCJoin() {
    try {
        setWebrtcStatus('webrtc-join-status', webrtcT('webrtcGeneratingAnswer', '正在生成应答码...'));
        const input = document.getElementById('webrtc-offer-input');
        const code = await webRTCSyncInstance.joinWithOffer(input.value);
        document.getElementById('webrtc-answer-code').value = code;
        document.getElementById('webrtc-answer-box').style.display = 'block';
        setWebrtcStatus('webrtc-join-status', webrtcT('webrtcSendAnswerBack', '将应答码发回给对方，等待连接建立...'));
    } catch (error) {
        console.error('WebRTC join error:', error);
        setWebrtcStatus('webrtc-join-status', webrtcT('webrtcInvalidOffer', '连接码无效') + ': ' + error.message);
    }
}
function handleWebRTCSend() {
    try {
        const includeSettings = document.getElementById('webrtc-settings-checkbox').checked;
        const gameData = getGameDataForExport(includeSettings);
        webRTCSyncInstance.sendData(gameData);
        setWebrtcStatus('webrtc-connected-status', webrtcT('webrtcDataSent', '已发送游戏数据'));
    } catch (error) {
        console.error('WebRTC send error:', error);
        setWebrtcStatus('webrtc-connected-status', webrtcT('webrtcSendFailed', '发送失败') + ': ' + error.message);
    }
}
function handleWebRTCMessage(raw) {
    try {
        const message = JSON.parse(raw);
        if (message.type === 'stateUpdate') {
            window.SyncLive.handleRemoteMessage('webrtc', message);
            return;
        }
        if (message.type === 'gameData') {
            const apply = window.confirm(webrtcT('webrtcConfirmApply', '收到对方发来的游戏数据，是否应用？'));
            if (apply) {
                window.__remoteSyncApply = true;
                try {
                    applyImportedData(message.data);
                } finally {
                    window.__remoteSyncApply = false;
                }
                if (typeof loadGameState === 'function') {
                    loadGameState();
                }
                alert(window.i18n ? window.i18n.t('importSuccess') : '数据导入成功');
            }
        }
    } catch (error) {
        console.error('WebRTC message error:', error);
    }
}
function setWebrtcStatus(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
    }
}
function copyWebrtcText(elementId) {
    const textarea = document.getElementById(elementId);
    if (!textarea || !textarea.value) {
        return;
    }
    textarea.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textarea.value).catch(() => document.execCommand('copy'));
    } else {
        document.execCommand('copy');
    }
    textarea.blur();
}
function showWebRTCModal(mode) {
    const modal = document.getElementById('webrtc-modal');
    if (!modal) {
        return;
    }
    const sections = {
        select: 'webrtc-select-section',
        host: 'webrtc-host-section',
        join: 'webrtc-join-section',
        connected: 'webrtc-connected-section'
    };
    const isOpen = !modal.classList.contains('hidden');
    if (isOpen && modal._webrtcMode === mode) {
        return;
    }
    Object.values(sections).forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.classList.remove('webrtc-section-in');
        }
    });
    const target = document.getElementById(sections[mode]);
    if (target) {
        target.style.display = 'block';
    }
    modal._webrtcMode = mode;
    updateWebRTCSelectPanel();
    if (isOpen) {
        if (target) {
            void target.offsetWidth;
            target.classList.add('webrtc-section-in');
        }
        return;
    }
    modal.classList.remove('hidden');
    const box = modal.querySelector('div');
    clearTimeout(modal._hideTimer);
    box.classList.remove('scale-100', 'opacity-100');
    box.classList.add('scale-95', 'opacity-0');
    void box.offsetWidth;
    requestAnimationFrame(() => {
        box.classList.remove('scale-95', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');
    });
}
function hideWebRTCModal() {
    const modal = document.getElementById('webrtc-modal');
    if (modal) {
        const box = modal.querySelector('div');
        box.classList.remove('scale-100', 'opacity-100');
        box.classList.add('scale-95', 'opacity-0');
        modal._hideTimer = setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}
window.webrtcSync = {
    version: webRTCSyncVersion,
    init: initWebRTCSync,
    get instance() {
        return webRTCSyncInstance;
    }
};
