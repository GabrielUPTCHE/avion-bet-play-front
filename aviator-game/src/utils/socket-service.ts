import { io, Socket } from "socket.io-client"
import { enviroments } from "../environment/environment"

let socket: Socket | null = null

export const connectSocket = () => {
  if (!socket) {
    
    socket = io(`http://${enviroments.ipClient}`, {  // Apuntando al balanceador de carga
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity, // Intentar reconectar indefinidamente
      reconnectionDelay: 500, // Esperar 500ms antes del primer reintento
      reconnectionDelayMax: 2000, // Máximo 2s entre reintentos
      timeout: 5000, // Timeout de conexión
      forceNew: false, // Reutilizar conexión existente
      multiplex: true,
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
