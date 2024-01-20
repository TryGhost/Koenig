import * as AwarenessProtocol from 'y-protocols/awareness';
import * as SyncProtocol from 'y-protocols/sync';
import * as bc from 'lib0/broadcastchannel';
import * as decoding from 'lib0/decoding';
import * as encoding from 'lib0/encoding';
import {ObservableV2} from 'lib0/observable';
import {io} from 'socket.io-client';

export class SocketIOProvider extends ObservableV2 {
    /**
     * The connection url to server. Example: `ws://localhost:3000/multiplayer`
     * @type {string}
     */
    _url;
    /**
     * The socket connection
     * @type {Socket}
     */
    socket;
    /**
     * The yjs document
     * @type {Y.Doc}
     */
    doc;
    /**
     * The awareness
     * @type {AwarenessProtocol.Awareness}
     */
    awareness;
    /**
     * Disable broadcast channel, by default is false
     * @type {boolean}
     */
    disableBc;
    /**
     * The broadcast channel connection status indicator
     * @type {string}
     */
    _broadcastChannel;
    /**
     * The broadcast channel connection status indicator
     * @type {boolean}
     */
    bcconnected = false;
    /**
     * Interval to emit `sync-step-1` to sync changes
     * @type {ReturnType<typeof setTimeout> | null}
     * @private
     */
    resyncInterval = null;

    _synced = false;

    get synced() {
        return this._synced;
    }

    set synced(value) {
        if (this._synced !== value) {
            this._synced = value;
            this.emit('synced', [this._synced]);
            this.emit('sync', [this._synced]);
        }
    }

    /**
     * SocketIOProvider constructor
     * @constructor
     * @param {string} url The connection url from server
     * @param {Y.Doc} doc The yjs document
     * @param {ProviderConfiguration} options Configuration options to the SocketIOProvider
     * @param {Partial<ManagerOptions & SocketOptions> | undefined} socketIoOptions optional overrides for socket.io
     */
    constructor(url, doc, {
        autoConnect = true,
        awareness = new AwarenessProtocol.Awareness(doc),
        resyncInterval = -1,
        disableBc = false,
        auth = {}
    }, socketIoOptions) {
        super();
        this._url = url;
        this.doc = doc;
        this.awareness = awareness;

        this._broadcastChannel = this.doc.guid;

        this.disableBc = disableBc;

        this.socket = io(`${this.url}`, {
            autoConnect: false,
            transports: ['websocket'],
            forceNew: true,
            auth: auth,
            ...socketIoOptions
        });

        this.doc.on('update', this.onUpdateDoc);
        this.socket.on('connect', () => this.onSocketConnection(resyncInterval));
        this.socket.on('disconnect', event => this.onSocketDisconnection(event));
        this.socket.on('connect_error', error => this.onSocketConnectionError(error));

        this.socket.on('sync-update', this.onSocketSyncUpdate);
        this.socket.on('awareness-update', this.onSocketAwarenessUpdate);

        this.initSystemListeners();

        this.awareness.on('update', this.awarenessUpdate);

        if (autoConnect) {
            this.connect();
        }
    }

    /**
     * Broadcast channel room getter
     * @type {string}
     */
    get broadcastChannel() {
        return this._broadcastChannel;
    }

    /**
     * URL getter
     * @type {string}
     */
    get url() {
        return this._url;
    }

    /**
     * This function initialize the window or process events listener. Specifically set ups the
     * window `beforeunload` and process `exit` events to remove the client from the awareness.
     * @type {() => void}
     */
    initSystemListeners = () => {
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', this.beforeUnloadHandler);
        } else if (typeof process !== 'undefined') {
            process.on('exit', this.beforeUnloadHandler);
        }
    };

    /**
     * Connect provider's socket
     * @type {() => void}
     */
    connect() {
        if (!this.socket.connected) {
            this.emit('status', [{status: 'connecting'}]);
            this.socket.connect();
            this.connectBc();
        }
    }

    /**
     * This function runs when the socket connects and reconnects and emits the `sync-step-1`
     * and `awareness-update` socket events to start synchronization.
     *
     *  Also starts the resync interval if is enabled.
     * @private
     * @param {() => void | Promise<void>} onConnect (Optional) A callback that will be triggered every time that socket is connected or reconnected
     * @param {number} resyncInterval (Optional) A number of milliseconds for interval of synchronize
     * @type {(onConnect: () => void | Promise<void>, resyncInterval: number = -1) => void}
     */
    onSocketConnection = (resyncInterval = -1) => {
        this.emit('status', [{status: 'connected'}]);
        const encoder = encoding.createEncoder();
        SyncProtocol.writeSyncStep1(encoder, this.doc);
        this.socket.emit('sync-update', encoding.toUint8Array(encoder));
        if (this.awareness.getLocalState() !== null) {
            this.socket.emit('awareness-update', AwarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID]));
        }
        if (resyncInterval > 0) {
            this.resyncInterval = setInterval(() => {
                if (this.socket.disconnected) {
                    return;
                }
                const reSyncEncoder = encoding.createEncoder();
                SyncProtocol.writeSyncStep1(reSyncEncoder, this.doc);
                this.socket.emit('sync-update', encoding.toUint8Array(reSyncEncoder));
            }, resyncInterval);
        }
    };

    /**
     * Disconnect provider's socket
     * @type {() => void}
     */
    disconnect() {
        if (this.socket.connected) {
            this.disconnectBc();
            this.socket.disconnect(true);
        }
    }

    /**
     * This function runs when the socket is disconnected and emits the socket event `awareness-update`
     * which removes this client from awareness.
     * @private
     * @param {Socket.DisconnectReason} event The reason of the socket disconnection
     * @param {() => void | Promise<void>} onDisconnect (Optional) A callback that will be triggered every time that socket is disconnected
     * @type {(event: Socket.DisconnectReason, onDisconnect: () => void | Promise<void>) => void}
     */
    onSocketDisconnection = (event) => {
        this.emit('connection-close', [event, this]);
        AwarenessProtocol.removeAwarenessStates(this.awareness, Array.from(this.awareness.getStates().keys()).filter(client => client !== this.doc.clientID), this);
        this.emit('status', [{status: 'disconnected'}]);
        this.synced = false;
    };

    /**
     * This function is executed when the socket connection fails.
     * @param {Error} error The error in the connection
     * @param {(error: Error) => void | Promise<void>} onConnectError (Optional) A callback that will be triggered every time that socket has a connection error
     * @type {(error: Error, onConnectError: (error: Error) => void | Promise<void>) => void}
     */
    onSocketConnectionError = (error) => {
        this.emit('connection-error', [error, this]);
    };

    /**
     * Destroy the provider. This method clears the document, awareness, and window/process listeners and disconnects the socket.
     * @type {() => void}
     */
    destroy() {
        if (this.resyncInterval !== null) {
            clearInterval(this.resyncInterval);
        }
        this.disconnect();
        if (typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
        } else if (typeof process !== 'undefined') {
            process.off('exit', this.beforeUnloadHandler);
        }
        this.awareness.off('update', this.awarenessUpdate);
        this.awareness.destroy();
        this.doc.off('update', this.onUpdateDoc);
        super.destroy();
    }

    /**
     * This function is executed when the document is updated, if the instance that
     * emit the change is not this, it emit the changes by socket and broadcast channel.
     * @private
     * @param {Uint8Array} update Document update
     * @param {SocketIOProvider} origin The SocketIOProvider instance that emits the change.
     * @type {(update: Uint8Array, origin: SocketIOProvider) => void}
     */
    onUpdateDoc = (update, origin) => {
        if (origin === this) {
            return;
        }
        const encoder = encoding.createEncoder();
        SyncProtocol.writeUpdate(encoder, update);
        const data = encoding.toUint8Array(encoder);
        this.socket.emit('sync-update', data);
        if (this.bcconnected) {
            bc.publish(this.broadcastChannel, {type: 'sync-update', data}, this);
        }
    };

    /**
     * This function is called when the server emits the `sync-update` event and applies the received update to the local document.
     * @private
     * @param {ArrayBuffer}update A document update received by the `sync-update` socket event
     * @type {(update: ArrayBuffer) => void}
     */
    onSocketSyncUpdate = (update) => {
        const decoder = decoding.createDecoder(new Uint8Array(update));
        const encoder = encoding.createEncoder();
        const syncMessageType = SyncProtocol.readSyncMessage(decoder, encoder, this.doc, this);
        if (encoding.length(encoder) > 0) {
            this.socket.emit('sync-update', encoding.toUint8Array(encoder));
        }
        if (syncMessageType === SyncProtocol.messageYjsSyncStep2 && !this.synced) {
            this.synced = true;
        }
    };

    /**
     * This function is called when the server emits the `awareness-update` event and applies the received update to the local document's awareness.
     * @private
     * @param {ArrayBuffer}update A document's awareness update received by the `awareness-update` socket event
     * @type {(update: ArrayBuffer) => void}
     */
    onSocketAwarenessUpdate = (update) => {
        AwarenessProtocol.applyAwarenessUpdate(this.awareness, new Uint8Array(update), this);
    };

    /**
     * This function is executed when the local awareness changes and this broadcasts the changes per socket and broadcast channel.
     * @private
     * @param {{ added: number[], updated: number[], removed: number[] }} awarenessChanges The clients added, updated and removed
     * @param {SocketIOProvider | null} origin The SocketIOProvider instance that emits the change.
     * @type {({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }, origin: SocketIOProvider | null) => void}
     */
    awarenessUpdate = ({added, updated, removed}, origin) => {
        const data = AwarenessProtocol.encodeAwarenessUpdate(this.awareness, added.concat(updated, removed));
        this.socket.emit('awareness-update', data);
        if (this.bcconnected) {
            bc.publish(this.broadcastChannel, {type: 'awareness-update', data}, this);
        }
    };

    /**
     * This function is executed when the windows will be unloaded or the process will be closed and this
     * will remove the local client from awareness.
     * @private
     * @type {() => void}
     */
    beforeUnloadHandler = () => {
        AwarenessProtocol.removeAwarenessStates(this.awareness, [this.doc.clientID], 'window unload');
    };

    /**
     * This function subscribes the provider to the broadcast channel and initiates synchronization by broadcast channel.
     * @type {() => void}
     */
    connectBc = () => {
        if (this.disableBc) {
            return;
        }
        if (!this.bcconnected) {
            bc.subscribe(this.broadcastChannel, this.onBroadcastChannelMessage);
            this.bcconnected = true;
        }

        const encoderSync = encoding.createEncoder();
        SyncProtocol.writeSyncStep1(encoderSync, this.doc);
        bc.publish(this.broadcastChannel, {type: 'sync-update', data: encoding.toUint8Array(encoderSync)}, this);

        const encoderState = encoding.createEncoder();
        SyncProtocol.writeSyncStep2(encoderState, this.doc);
        bc.publish(this.broadcastChannel, {type: 'sync-update', data: encoding.toUint8Array(encoderState)}, this);

        bc.publish(this.broadcastChannel, {type: 'awareness-query', data: null}, this);

        bc.publish(this.broadcastChannel, {type: 'awareness-update', data: AwarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID])}, this);
    };

    /**
     * This function unsubscribes the provider from the broadcast channel and before unsubscribing, updates the awareness.
     * @type {() => void}
     */
    disconnectBc = () => {
        bc.publish(this.broadcastChannel, {
            type: 'awareness-update',
            data: AwarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID], new Map())
        }, this);
        if (this.bcconnected) {
            bc.unsubscribe(this.broadcastChannel, this.onBroadcastChannelMessage);
            this.bcconnected = false;
        }
    };

    /**
     * This method handles messages received by the broadcast channel and responds to them.
     * @param {{ type: string, data: ArrayBuffer | null }} message The object message received by broadcast channel
     * @param {SocketIOProvider} origin The SocketIOProvider instance that emits the change
     * @type {(message: { type: string, data: ArrayBuffer | null }, origin: SocketIOProvider) => void}
     */
    onBroadcastChannelMessage = (message, origin) => {
        if (origin === this) {
            return;
        }
        switch (message.type) {
        case 'sync-update': {
            const decoder = decoding.createDecoder(message.data);
            const encoder = encoding.createEncoder();
            SyncProtocol.readSyncMessage(decoder, encoder, this.doc, this);
            if (encoding.length(encoder) > 0) {
                bc.publish(this.broadcastChannel, {type: 'sync-update', data: encoding.toUint8Array(encoder)});
                this.socket.emit('sync-update', encoding.toUint8Array(encoder));
            }
        } break;

        case 'awareness-query':
            bc.publish(this.broadcastChannel, {
                type: 'awareness-update',
                data: AwarenessProtocol.encodeAwarenessUpdate(this.awareness, Array.from(this.awareness.getStates().keys()))
            }, this);
            break;

        case 'awareness-update':
            AwarenessProtocol.applyAwarenessUpdate(this.awareness, message.data, this);
            break;

        default:
            // eslint-disable-next-line no-console
            console.warn(`unknown bc message ${message.type}`);
            break;
        }
    };
}
