
export interface MessageStorage {
    message: string,
    emotion: string,
    sender:string, // remove later
    senderId: string, //socket id
}

type roomType = 'Direct Message'|'Group Chat';

export interface RoomStorage {
    messages: MessageStorage[]
    type:roomType
    name?:string
    members: string[]
    // members: User[]
    lastModified?: Date
}

export interface User {
    id:string
    name:string
}

//Room name to Room storage
export interface ServerStorage extends Record<string, RoomStorage> { }

export const defaultRoom = {
    messages: [],
    type:'Direct Message' as roomType,
    members: [],
}