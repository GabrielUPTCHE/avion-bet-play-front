import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost", {  // Apuntando al balanceador de carga
      autoConnect: false,
      transports: ['polling', 'websocket']
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) throw new Error("Socket no inicializado")
  return socket
}
