namespace AWS.IVS.Chat {
    export class DeleteMessageRequest {
        public readonly Action: string = 'DELETE_MESSAGE';
        public Id: string;
        public Reason?: string;
        public RequestId?: string;

        constructor(id: string, reason?: string, requestId?: string) {
            this.Id = id;
            this.Reason = reason;
            this.RequestId = requestId;
        }
    }
}
