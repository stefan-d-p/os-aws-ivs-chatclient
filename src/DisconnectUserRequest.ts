namespace AWS.IVS.Chat {
    export class DisconnectUserRequest {
        public readonly Action: string = 'DISCONNECT_USER';
        public UserId: string;
        public RequestId?: string;
        public Reason?: string;

        constructor(userId: string, requestId?: string, reason?: string) {
            this.UserId = userId;
            this.Reason = reason;
            this.RequestId = requestId;
        }
    }
}
