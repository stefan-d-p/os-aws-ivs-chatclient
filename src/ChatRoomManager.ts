namespace AWS.IVS.Chat {
    const _chatRooms: Map<string, Room> = new Map();

    export const createRoom = (uniqueId: string): Room => {
        const _room = new Room(uniqueId);
        _chatRooms.set(uniqueId, _room);
        return _room;
    };

    export const connectRoom = (uniqueId: string, socket: string, token: string): void => {
        const _room = getRoomByUniqueId(uniqueId);
        _room.connect(socket, token);
    };

    export const onMessage = (uniqueId: string, callback: RoomSubscribeCallback): void => {
        const _room = getRoomByUniqueId(uniqueId);
        _room.on('room-message', callback);
    };

    export const onEvent = (uniqueId: string, callback: RoomSubscribeCallback): void => {
        const _room = getRoomByUniqueId(uniqueId);
        _room.on('room-event', callback);
    };

    export const onError = (uniqueId: string, callback: RoomSubscribeCallback): void => {
        const _room = getRoomByUniqueId(uniqueId);
        _room.on('room-error', callback);
    };

    export const sendMessage = (uniqueId: string, content: string): void => {
        const _room = getRoomByUniqueId(uniqueId);
        _room.sendMessage(content);
    };

    export const disconnectRoom = (uniqueId: string): void => {
        const _room = getRoomByUniqueId(uniqueId);
        _room.disconnect();
    };

    export const getRoomByUniqueId = (uniqueId: string): Room => {
        let _room: Room | undefined;
        if (_chatRooms.has(uniqueId)) {
            _room = _chatRooms.get(uniqueId);
        }

        if (_room === undefined) {
            throw new Error(`Room id ${uniqueId} does not exist`);
        }

        return _room;
    };
}
