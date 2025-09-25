import { useNavigate } from "react-router-dom"
import { connectSocket } from "../utils/socket-service"

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    const socket = connectSocket()
    socket.connect()

    socket.emit("join_game", { username: "Jugador1", registerDate: new Date().toISOString() })

    navigate("/game")
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Pantalla de Login</h1>
      <button onClick={handleLogin}>Iniciar Juego</button>
    </div>
  )
}
