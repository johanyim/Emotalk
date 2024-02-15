
export interface MessageStorage {
    id: string, //socket id
    message: string,
    emotion: string,
    sender:string, // remove later
}

export interface RoomStorage {
    messages: MessageStorage[]
}

//Room name to Room storage
export interface ServerStorage extends Record<string, RoomStorage> { }