const webRTCSyncVersion = '0.5';
window.webRTCSyncVersion = webRTCSyncVersion;
const WEBRTC_ROOM_ID_PREFIX = '2048sync-';
class WebRTCSync {
    constructor() {
        this.pc = null;
        this.channel = null;
        this.peer = null;
        this.role = null;
        this.roomCode = null;
        this.connected = false;
        this._pendingJoin = null;
        this.onConnected = null;
        this.onMessage = null;
        this.onDisconnected = null;
        this.onSignalingError = null;
    }
    generateRoomCode() {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10).toString();
        }
        return code;
    }
    async createRoom() {
        if (typeof Peer === 'undefined') {
            const err = new Error('PeerJS library not loaded');
            err.type = 'peer-lib-missing';
            throw err;
        }
        this.close();
        this.role = 'room-host';
        for (let attempt = 0; attempt < 3; attempt++) {
            const code = this.generateRoomCode();
            try {
                await this._openRoomPeer(code);
                this.roomCode = code;
                return code;
            } catch (err) {
                if (err && err.type === 'unavailable-id' && attempt < 2) {
                    continue;
                }
                throw err;
            }
        }
    }
    _openRoomPeer(code) {
        return new Promise((resolve, reject) => {
            let settled = false;
            let timer = null;
            let peer = null;
            const cleanup = () => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            };
            const fail = (err) => {
                if (settled) {
                    if (this.onSignalingError && this.onSignalingError !== reject) {
                        try { this.onSignalingError(err); } catch (e) {}
                    }
                    return;
                }
                settled = true;
                cleanup();
                try { peer.destroy(); } catch (e) {}
                if (this.peer === peer) {
                    this.peer = null;
                }
                reject(err);
            };
            peer = new Peer(WEBRTC_ROOM_ID_PREFIX + code, { debug: 0 });
            this.peer = peer;
            timer = setTimeout(() => {
                const err = new Error('Signaling server timeout');
                err.type = 'server-error';
                fail(err);
            }, 15000);
            peer.on('open', () => {
                if (settled) return;
                settled = true;
                cleanup();
                peer.on('connection', (conn) => {
                    if (this.channel && this.channel.open) {
                        try { conn.close(); } catch (e) {}
                        return;
                    }
                    this.channel = conn;
                    this.bindPeerChannel(conn);
                });
                resolve();
            });
            peer.on('error', (err) => {
                fail(err || new Error('Peer error'));
            });
        });
    }
    async joinRoom(code) {
        if (typeof Peer === 'undefined') {
            const err = new Error('PeerJS library not loaded');
            err.type = 'peer-lib-missing';
            throw err;
        }
        const cleaned = String(code == null ? '' : code).replace(/\D/g, '');
        if (cleaned.length !== 6) {
            const err = new Error('Invalid room code');
            err.type = 'invalid-code';
            throw err;
        }
        this.close();
        this.role = 'room-joiner';
        return new Promise((resolve, reject) => {
            let settled = false;
            let timer = null;
            let peer = null;
            const fail = (err) => {
                if (settled) return;
                settled = true;
                if (timer) clearTimeout(timer);
                try { peer.destroy(); } catch (e) {}
                if (this.peer === peer) {
                    this.peer = null;
                }
                reject(err);
            };
            peer = new Peer({ debug: 0 });
            this.peer = peer;
            timer = setTimeout(() => {
                const err = new Error('Connection timeout');
                err.type = 'peer-unavailable';
                fail(err);
            }, 20000);
            peer.on('open', () => {
                if (settled) return;
                const conn = peer.connect(WEBRTC_ROOM_ID_PREFIX + cleaned, { reliable: true });
                this.channel = conn;
                this.bindPeerChannel(conn);
                this._pendingJoin = () => {
                    if (settled) return;
                    settled = true;
                    if (timer) clearTimeout(timer);
                    resolve();
                };
            });
            peer.on('error', (err) => {
                fail(err || new Error('Peer error'));
            });
        });
    }
    bindPeerChannel(conn) {
        conn.on('open', () => {
            this.connected = true;
            if (this._pendingJoin) {
                const resolve = this._pendingJoin;
                this._pendingJoin = null;
                resolve();
            }
            if (this.onConnected) {
                this.onConnected();
            }
        });
        conn.on('data', (data) => {
            if (this.onMessage) {
                this.onMessage(typeof data === 'string' ? data : JSON.stringify(data));
            }
        });
        conn.on('close', () => {
            this.connected = false;
            if (this.onDisconnected) {
                this.onDisconnected();
            }
        });
        conn.on('error', () => {});
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
            this.channel.onopen = null;
            this.channel.onmessage = null;
            this.channel.onclose = null;
            try {
                this.channel.close();
            } catch (e) {}
            this.channel = null;
        }
        if (this.pc) {
            this.pc.onconnectionstatechange = null;
            this.pc.ondatachannel = null;
            try {
                this.pc.close();
            } catch (e) {}
            this.pc = null;
        }
        if (this.peer) {
            try {
                this.peer.destroy();
            } catch (e) {}
            this.peer = null;
        }
        this.connected = false;
        this.role = null;
        this.roomCode = null;
        this._pendingJoin = null;
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
    webRTCSyncInstance.onSignalingError = (err) => {
        const modal = document.getElementById('webrtc-modal');
        if (!modal || modal.classList.contains('hidden') || (webRTCSyncInstance && webRTCSyncInstance.connected)) {
            return;
        }
        if (modal._webrtcMode === 'host') {
            setWebrtcStatus('webrtc-room-status', describeWebrtcRoomError(err, webrtcT('webrtcRoomFailed', '获取连接码失败，请检查网络后重试')));
        }
    };
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
    const webrtcCopyRoomCodeBtn = document.getElementById('webrtc-copy-room-code');
    const webrtcRoomRegenerateBtn = document.getElementById('webrtc-room-regenerate');
    const webrtcJoinRoomBtn = document.getElementById('webrtc-join-room-button');
    const webrtcRoomCodeInput = document.getElementById('webrtc-room-code-input');
    const webrtcHostManual = document.getElementById('webrtc-host-manual');
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
            resetWebrtcJoinUI();
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
    if (webrtcCopyRoomCodeBtn) {
        webrtcCopyRoomCodeBtn.addEventListener('click', copyWebrtcRoomCode);
    }
    if (webrtcRoomRegenerateBtn) {
        webrtcRoomRegenerateBtn.addEventListener('click', handleWebRTCHost);
    }
    if (webrtcJoinRoomBtn) {
        webrtcJoinRoomBtn.addEventListener('click', handleWebRTCJoinRoom);
    }
    if (webrtcRoomCodeInput) {
        webrtcRoomCodeInput.addEventListener('input', () => {
            const cleaned = webrtcRoomCodeInput.value.replace(/\D/g, '').slice(0, 6);
            if (cleaned !== webrtcRoomCodeInput.value) {
                webrtcRoomCodeInput.value = cleaned;
            }
        });
        webrtcRoomCodeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleWebRTCJoinRoom();
            }
        });
    }
    if (webrtcHostManual) {
        webrtcHostManual.addEventListener('toggle', () => {
            if (!webrtcHostManual.open) {
                return;
            }
            handleWebRTCHostManualOpen();
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
        });
    }
    const webrtcLiveSyncCheckbox = document.getElementById('webrtc-live-sync-checkbox');
    if (webrtcLiveSyncCheckbox) {
        webrtcLiveSyncCheckbox.addEventListener('change', () => {
            window.SyncLive.setEnabled('webrtc', webrtcLiveSyncCheckbox.checked);
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
    const modal = document.getElementById('webrtc-modal');
    try {
        showWebRTCModal('host');
        resetWebrtcHostUI();
        setWebrtcStatus('webrtc-room-status', webrtcT('webrtcCreatingRoom', '正在获取连接码...'));
        const code = await webRTCSyncInstance.createRoom();
        const display = document.getElementById('webrtc-room-code');
        if (display) {
            display.textContent = code;
        }
        if (!modal || modal._webrtcMode === 'host') {
            setWebrtcStatus('webrtc-room-status', webrtcT('webrtcWaitingForPeer', '等待对方加入...'));
        }
    } catch (error) {
        console.error('WebRTC room host error:', error);
        setWebrtcStatus('webrtc-room-status', describeWebrtcRoomError(error, webrtcT('webrtcRoomFailed', '获取连接码失败，请检查网络后重试')));
    }
}
function resetWebrtcHostUI() {
    const modal = document.getElementById('webrtc-modal');
    if (modal) {
        modal._manualHostReady = false;
    }
    const display = document.getElementById('webrtc-room-code');
    if (display) {
        display.textContent = '------';
    }
    setWebrtcStatus('webrtc-room-status', '');
    const offerCode = document.getElementById('webrtc-offer-code');
    if (offerCode) {
        offerCode.value = '';
    }
    const answerInput = document.getElementById('webrtc-answer-input');
    if (answerInput) {
        answerInput.value = '';
    }
    setWebrtcStatus('webrtc-host-status', '');
}
function resetWebrtcJoinUI() {
    const input = document.getElementById('webrtc-room-code-input');
    if (input) {
        input.value = '';
    }
    setWebrtcStatus('webrtc-join-room-status', '');
}
function describeWebrtcRoomError(error, fallback) {
    const type = error && error.type;
    if (type === 'invalid-code') {
        return webrtcT('webrtcCodeInvalid', '请输入 6 位数字连接码');
    }
    if (type === 'peer-unavailable') {
        return webrtcT('webrtcPeerUnavailable', '未找到该连接码对应的设备，请确认对方已创建连接且连接码正确');
    }
    if (type === 'network' || type === 'server-error' || type === 'socket-error' || type === 'peer-lib-missing') {
        return webrtcT('webrtcServerUnreachable', '无法连接公共信令服务器，请检查网络或展开下方手动模式');
    }
    if (type === 'browser-incompatible') {
        return webrtcT('webrtcBrowserIncompatible', '当前浏览器不支持 WebRTC，请更换浏览器或使用手动模式');
    }
    return fallback + (error && error.message ? ': ' + error.message : '');
}
async function handleWebRTCJoinRoom() {
    const input = document.getElementById('webrtc-room-code-input');
    const code = input ? input.value : '';
    if (code.replace(/\D/g, '').length !== 6) {
        setWebrtcStatus('webrtc-join-room-status', webrtcT('webrtcCodeInvalid', '请输入 6 位数字连接码'));
        return;
    }
    try {
        setWebrtcStatus('webrtc-join-room-status', webrtcT('webrtcJoiningRoom', '正在连接...'));
        await webRTCSyncInstance.joinRoom(code);
    } catch (error) {
        console.error('WebRTC room join error:', error);
        setWebrtcStatus('webrtc-join-room-status', describeWebrtcRoomError(error, webrtcT('webrtcJoinRoomFailed', '连接失败')));
    }
}
function copyWebrtcRoomCode() {
    const display = document.getElementById('webrtc-room-code');
    const code = display ? display.textContent.trim() : '';
    if (!code || code === '------') {
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => document.execCommand('copy'));
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    setWebrtcStatus('webrtc-room-status', webrtcT('webrtcCopied', '已复制') + ' · ' + webrtcT('webrtcWaitingForPeer', '等待对方加入...'));
}
async function handleWebRTCHostManualOpen() {
    const modal = document.getElementById('webrtc-modal');
    if (modal && modal._manualHostReady) {
        return;
    }
    if (modal) {
        modal._manualHostReady = true;
    }
    try {
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcGeneratingCode', '正在生成连接码...'));
        const code = await webRTCSyncInstance.createOffer();
        document.getElementById('webrtc-offer-code').value = code;
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcHostInstructions', '1. 将连接码发送给对方\n2. 把对方回传的应答码粘贴到下方并点击"完成连接"'));
    } catch (error) {
        console.error('WebRTC manual host error:', error);
        setWebrtcStatus('webrtc-host-status', webrtcT('webrtcGenerateFailed', '生成连接码失败') + ': ' + error.message);
        if (modal) {
            modal._manualHostReady = false;
        }
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
