namespace AWS.IVS.Chat {
    export type RoomSubscribeCallback = (message: string) => void;

    enum SocketEvents {
        open = 'open',
        close = 'close',
        error = 'error',
        message = 'message'
    }

    export enum SubscriptionEvents {
        message = 'room-message',
        event = 'room-event',
        error = 'room-error'
    }

    export interface IMessage {
        Id: string;
        RequestId: string;
        Type: string;
    }

    export class Room {
        private _id: string;
        private _websocket?: WebSocket;

        private _subscriptions: Map<string, RoomSubscribeCallback>;

        public get State(): number {
            return this._websocket ? this._websocket.readyState : 0;
        }

        /**
         * Constructor
         * @param id - Unique identifier for this Instance
         */
        constructor(id: string) {
            this._id = id;
            this._subscriptions = new Map();
        }

        public connect(socket: string, token: string) {
            if (this._websocket) {
                this.removeEventHandlers();
                this._websocket.close();
            }

            this._websocket = new WebSocket(socket, token);
            this.addEventHandlers();
        }

        public on(event: string, callback: RoomSubscribeCallback) {
            this._subscriptions.set(event, callback);
        }

        public off(event: string) {
            this._subscriptions.delete(event);
        }

        public sendMessage(content: string, attributes?: Record<string, string>, requestId?: string) {
            let request: SendMessageRequest = new SendMessageRequest(content, attributes, requestId);
            let data = JSON.stringify(request);
            this.send(data);
        }

        public deleteMessage(id: string, reason?: string, requestId?: string) {
            let request: DeleteMessageRequest = new DeleteMessageRequest(id, reason, requestId);
            let data = JSON.stringify(request);
            this.send(data);
        }

        public disconnectUser(userId: string, requestId?: string, reason?: string) {
            let request: DisconnectUserRequest = new DisconnectUserRequest(userId, requestId, reason);
            let data = JSON.stringify(request);
            this.send(data);
        }

        private send(data: string) {
            if (this._websocket && this._websocket.readyState === this._websocket.OPEN) {
                this._websocket.send(data);
            }
        }

        public disconnect() {
            if (this._websocket) {
                this.removeEventHandlers();
                this._websocket.close();
            }
        }

        private addEventHandlers() {
            if (this._websocket) {
                this._websocket.addEventListener(SocketEvents.open, this.handleOpenEvent);
                this._websocket.addEventListener(SocketEvents.close, this.handleCloseEvent);
                this._websocket.addEventListener(SocketEvents.message, this.handleMessageEvent);
            }
        }

        private removeEventHandlers() {
            if (this._websocket) {
                this._websocket.removeEventListener(SocketEvents.open, this.handleOpenEvent);
                this._websocket.removeEventListener(SocketEvents.close, this.handleCloseEvent);
                this._websocket.removeEventListener(SocketEvents.message, this.handleMessageEvent);
            }
        }

        private handleOpenEvent = (ev: Event) => {
            console.log(`Open event for target ${ev.target}`);
        };

        private handleCloseEvent = (ev: CloseEvent) => {};

        private handleMessageEvent = (ev: MessageEvent) => {
            let obj: IMessage = JSON.parse(ev.data);

            switch (obj.Type) {
                case 'EVENT':
                    let eventCallback = this._subscriptions.get(SubscriptionEvents.event);
                    if (eventCallback) eventCallback(ev.data);
                    break;
                case 'MESSAGE':
                    let messageCallback = this._subscriptions.get(SubscriptionEvents.message);
                    if (messageCallback) messageCallback(ev.data);
                    break;
                case 'ERROR':
                    let errorCallback = this._subscriptions.get(SubscriptionEvents.error);
                    if (errorCallback) errorCallback(ev.data);
                    break;
            }
        };
    }
}
