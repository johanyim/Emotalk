// pages/api/socket.ts
import { getRandomIndex, getRandomName } from "../../utils"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer, Socket } from "socket.io"
import { Server } from "socket.io"
import { MessageStorage, ServerStorage, defaultRoom } from "../../types/storage"

const PORT = 3000
export const config = {
  api: {
    bodyParser: false,
  },
}

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

let io: IOServer;

interface ISocket extends Socket {
  username?: string;
}

export default function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    res.status(200).json({ success: true, message: "Socket is already running", socket: `:${PORT + 1}` })
    return
  }

  console.log("Starting Socket.IO server on port:", PORT + 1)
  //@ts-expect-error
  io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } }).listen(PORT + 1)

  io.on("connect", (socket: ISocket) => {
    console.log("socket connect", socket.id)
    //Join starting room
    socket.join('lobby')

    //Set name
    socket.username = getRandomName()
    socket.emit("setName", socket.username)

    //Server receive message
    socket.on('sendMessage', ({ message, emotion, room = 'lobby' }) => {
      const from = socket.username
      if (!from) {
        console.error(`${socket} has no username`)
        return
      }
      console.log(`RECEIVED MESSAGE: Sender: ${from}, message: ${message}, emotion, ${emotion}, room, ${room}`);

      const payload = {
        message,
        emotion,
        sender: from,//remove later
        senderId: socket.id,
      }

      //Also store in server
      storeMessage(room, payload)
      socket.to(room).emit('receiveMessage', { ...payload, sender: from, room });
    });

    //Get all current rooms for the current socket
    socket.on('getRooms', (cb) => {
      const rooms = getCurrentRooms(socket)
      cb(rooms)
    });

    socket.on('fetchMessages', (cb) => {
      const rooms = socket.rooms;

      //Find in storage in rooms user joined
      let storage: ServerStorage = {};
      rooms.forEach(roomName => {
        const roomStorage = messageStorage[roomName] || [];
        storage[roomName] = roomStorage
      });

      cb(storage)
    });

    //Socket disconnects
    socket.on("disconnect", async () => {
      console.log("socket disconnect")
    })
  })

  res.socket.server.io = io
  res.status(201).json({ success: true, message: "Socket is started", socket: `:${PORT + 1}` })
}

//TODO Need to seperate this function out, propably not used later
export function getCurrentRooms(socket: ISocket) {

  // const currentRooms = Array.from(socket.rooms);

  // Find current user online
  // io.sockets.sockets return a map <id, socket>
  const socketEntries = Array.from(io.sockets.sockets.entries());
  const filteredSocketEntries = socketEntries.filter(([id, _]) => id !== socket.id); //Filter Self

  const roomInfo = filteredSocketEntries.map(([id, other_socket]) => {
    const roomId = generateRoomId(socket.id, id)
    if (messageStorage[roomId]) return null //indicate this room has been created already

    return {
      id: roomId,
      name: (other_socket as ISocket).username
    }
  }).filter(room => room !== null) // Filter out null elements from the array;; 

  return roomInfo
}


//Generate by just concating the socket ids
function generateRoomId(id1: string, id2: string) {
  let id;
  if (id1[0] < id2[0]) {
    id = id1 + id2;
  } else {
    id = id2 + id1;
  }
  return id;
}

const messageStorage: ServerStorage = {
  'lobby': {
    ...defaultRoom,
    type: 'Group Chat',
    name: 'Lobby',
  },
}

// Store new message in Server
function storeMessage(room: string, payload: MessageStorage) {
  if (!messageStorage[room]) {
    messageStorage[room] = { ...defaultRoom };
  }

  messageStorage[room].messages.push(payload)
}

//Create Group Chat
function createRoom(room: string, name: string) {

  // generate random id
  const random_id = Math.floor(Math.random() * 100000000)

  if (!messageStorage[room]) {
    messageStorage[random_id] = { ...defaultRoom, type: 'Group Chat', name: name };
  }
}