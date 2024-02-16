import { useState, useEffect, ChangeEvent } from "react";
import { ServerStorage, MessageStorage } from "../../types/storage";
import { useSocket } from "./SocketContext";

interface Message {
    id: string
    sender: string;
    message: string;
    emotion: string;
    room: string;
}

interface MessageProps {
    currentRoom: string //roomid
    emotion: string;
    storage: ServerStorage
    setStorage: React.Dispatch<React.SetStateAction<ServerStorage>>;
}


export function Chat({ currentRoom, emotion, storage, setStorage }: MessageProps) {
    const [messageInput, setMessageInput] = useState('');

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return


        socket.on("receiveMessage", (newMessageInfo: Message) => {
            const room = newMessageInfo.room;
            const message = {  // Create the new message object
                senderId: newMessageInfo.id,
                sender: newMessageInfo.sender,
                message: newMessageInfo.message,
                emotion: newMessageInfo.emotion
            };

            console.log('receive messages :>> ', message, room);
            addMessageToStorage(message, room)
            // console.log('messages.lobby :>> ', messageStorage[currentRoom]);
        })

    }, [socket]);

    const sendMessage = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        // Send message warning
        if (messageInput.trim() === '' || !socket) return
        if (emotion === "neutral") {
            window.alert("Sorry, I don't know how you feel about that.")
            return
        }

        socket.emit('sendMessage', { message: messageInput, emotion, room: currentRoom });

        // Display own message
        const newMessage = {
            senderId: socket.id,
            sender: 'me',
            message: messageInput,
            emotion
        }

        addMessageToStorage(newMessage, currentRoom)
        setMessageInput('');
    };

    function addMessageToStorage(newMessage: MessageStorage, room: string) {
        setStorage((prevStorage) => ({
            ...prevStorage,
            [room]: {
                ...prevStorage[room],
                messages: [...(prevStorage[room]?.messages || []), newMessage]
            }
        }));
    }

    console.log('storage :>> ', storage);


    return (
        <div className='flex flex-col justify-between h-full'>
            <div className="">
                {storage[currentRoom]?.messages?.map((messageObject: MessageStorage, index: number) => {
                    const { senderId, sender, message, emotion } = messageObject;
                    const fromSelf = senderId === socket?.id
                    return (

                        <div key={index} className={`mb-2 text-xl ${fromSelf && 'text-right'}`}>
                            {sender}: <span className={`${emotion} message`}>{message}</span>
                        </div>
                    );
                })}
            </div>

            <form className="flex gap-4 ">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className={`${emotion} border border-gray-300 p-2 rounded-lg mr-2 w-full`}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </form>
        </div>
    )
}