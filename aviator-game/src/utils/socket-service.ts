import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      autoConnect: false,
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) {
    const username = localStorage.getItem("username")
    if (username) {
      const socket = connectSocket()
      socket.connect()

      socket.emit("join_game", {
        username,
        register_date: new Date().toISOString(),
      })
    }
  }
  return socket
}
