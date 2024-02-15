
export interface MessageStorage {
    id: string, //socket id
    message: string,
    emotion: string,
    sender:string, // remove later
}

type roomType = 'Direct Message'|'Group Chat';

export interface RoomStorage {
    messages: MessageStorage[]
    type:roomType
    name?:string
}

//Room name to Room storage
export interface ServerStorage extends Record<string, RoomStorage> { }