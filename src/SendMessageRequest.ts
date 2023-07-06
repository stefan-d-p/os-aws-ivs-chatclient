namespace AWS.IVS.Chat {
    export class SendMessageRequest {
        public readonly Action: string = 'SEND_MESSAGE';
        public Content: string;
        public Attributes?: Record<string, string>;
        public RequestId?: string;

        constructor(content: string, attributes?: Record<string, string>, requestId?: string) {
            this.Content = content;
            this.Attributes = attributes;
            this.RequestId = requestId;
        }
    }
}
