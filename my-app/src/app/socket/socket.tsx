
// GETTING ERROR IF IMPORT

// import { io } from "socket.io-client"

// const PORT = 3000
// const socket = io(`:${PORT + 1}`, { path: "/api/socket", addTrailingSlash: false })

// socket.on("connect", () => {
//   console.log("Connected")
// })

// socket.on("disconnect", () => {
//   console.log("Disconnected")
// })

// socket.on("connect_error", async err => {
//   console.log(`connect_error due to ${err.message}`)
//   await fetch("/api/socket")
// })

// export default socket;