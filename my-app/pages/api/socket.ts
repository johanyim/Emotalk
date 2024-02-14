// pages/api/socket.ts
import { getRandomIndex, getRandomName } from "../../utils"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer, Socket } from "socket.io"
import { Server } from "socket.io"

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

    //Set name
    socket.username = getRandomName()
    socket.emit("setName", socket.username)

    //Server receive message
    socket.on('sendMessage', ({ message, emotion }) => {
      const from = socket.username
      console.log(`RECEIVED MESSAGE: Sender: ${from}, message: ${message}, emotion", ${emotion}`);

      const payload = {
        sender: from,
        message,
        emotion
      }

      socket.broadcast.emit('receiveMessage', payload);
    });

    //Get all current online people, exclude the user itself
    socket.on('getCurrentPeople', (cb) => {
      const users = getCurrentUsers()
      // filter their own name
      cb(users.filter(info => info.id !== socket.id))
    });

    //Socket disconnects
    socket.on("disconnect", async () => {
      console.log("socket disconnect")
    })
  })

  res.socket.server.io = io
  res.status(201).json({ success: true, message: "Socket is started", socket: `:${PORT + 1}` })
}

export function getCurrentUsers() {
  //io.sockets.sockets return a map <id, socket>
  const socketEntries = Array.from(io.sockets.sockets.entries());
  const socketInfo = socketEntries.map(([id, socket]) => ({
    id,
    username: (socket as ISocket).username
  }));

  return socketInfo
}

export const socketToRoomMap = {};

