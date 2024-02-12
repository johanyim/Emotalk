// pages/api/socket.ts
import { getRandomIndex } from "@/app/utils/utils"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer } from "socket.io"
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

export const socketToNameMap: { [socketId: string]: string } = {};
export const socketToRoomMap = {};

const random_names = [
  "Jasmine", "Xavier", "Emily", "Blake", "Mia", "Ethan", "Sophia", "Jackson", "Olivia", "Liam",
  "Ava", "Noah", "Isabella", "Lucas", "Harper", "Aiden", "Emma", "Elijah", "Charlotte", "Mason",
  "Amelia", "Logan", "Evelyn", "Carter", "Abigail", "Benjamin", "Grace", "Alexander", "Riley",
  "Scarlett", "James", "Lily", "Jacob", "Zoe", "Michael", "Avery", "William", "Evelyn", "Henry",
  "Mia", "Samuel", "Chloe", "Ethan", "Madison", "Elijah", "Addison", "Alexander", "Eleanor",
  "Daniel", "Victoria", "David", "Aria", "Joseph", "Penelope", "Matthew", "Harper", "Gabriel",
  "Layla", "Christopher", "Aubrey", "Joshua", "Natalie", "Oliver", "Brooklyn", "Sebastian", "Hannah",
  "Andrew", "Savannah", "Dylan", "Stella", "Nathan", "Zoey", "Jonathan", "Paisley", "Isaac", "Leah",
  "Owen", "Audrey", "Julian", "Grace", "Lincoln", "Sofia", "Isaac", "Ruby", "Zachary", "Eleanor",
  "Levi", "Claire", "Aaron", "Jasmine", "Jack", "Bella", "Evan", "Lucy", "Grayson"
]


export default function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    res.status(200).json({ success: true, message: "Socket is already running", socket: `:${PORT + 1}` })
    return
  }

  console.log("Starting Socket.IO server on port:", PORT + 1)
  //@ts-expect-error
  const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } }).listen(PORT + 1)

  io.on("connect", socket => {
    const _socket = socket
    socketToNameMap[socket.id] = random_names[getRandomIndex(random_names)]
    
    console.log("socket connect", socket.id)

    //Server send initial message at inital connect
    const payload = {
      sender: 'Server', //Change later 
      message: `Welcome ${socketToNameMap[socket.id] }`,
      emotion:'-'
    }
    _socket.emit("receiveMessage", payload)


    //Server receive message
    socket.on('sendMessage', ({message,emotion}) => {
      const name = socketToNameMap[socket.id]
      console.log(`RECEIVED MESSAGE: Sender: ${name}, message: ${message}, emotion", ${emotion}`);

      const payload = {
        sender: name, //Change later 
        message,
        emotion
      }

      io.emit('receiveMessage', payload); // Broadcast to all clients
    });

    //Socket disconnects
    socket.on("disconnect", async () => {
      console.log("socket disconnect")
    })
  })

  res.socket.server.io = io
  res.status(201).json({ success: true, message: "Socket is started", socket: `:${PORT + 1}` })
}
