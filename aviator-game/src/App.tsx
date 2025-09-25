import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './views/Login'
import Game from './views/Game'

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />

    </Routes>
  )
}

export default App
