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
