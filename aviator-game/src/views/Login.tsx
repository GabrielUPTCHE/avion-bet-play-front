import { useNavigate } from "react-router-dom"
import { connectSocket } from "../utils/socket-service"
import { useState } from "react"

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio")
      return
    }

    try {
      const res = await fetch("http://localhost/api/validate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()
      if (!data.success) {
        setError("El usuario no existe")
        return
      }

      // si es válido → conectar socket
      const socket = connectSocket()
      socket.connect()
      
      socket.emit("join_game", {
        username,
        register_date: new Date().toISOString(),
      })
      localStorage.setItem("username", username)

      navigate("/game")
    } catch (err) {
      console.error("Error validando usuario:", err)
      setError("Error de conexión con el servidor")
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Pantalla de Login</h1>
      <input
        type="text"
        placeholder="Ingresa tu nombre"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar Juego</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}
