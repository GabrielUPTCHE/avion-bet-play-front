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
  if (!socket) throw new Error("Socket no inicializado")
  return socket
}
