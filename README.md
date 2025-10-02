# Avion Bet Play - Frontend

Aplicación frontend para el juego Aviator, desarrollada con React, TypeScript y Socket.IO para comunicación en tiempo real.

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Backend del juego en ejecución

## Configuración

1. Instalar dependencias:
```bash
cd aviator-game
npm install
```

2. Configurar conexión al backend:

Modificar el archivo `src/environment/environment.ts` y actualizar la URL del socket según donde esté alojado tu backend:

```typescript
// src/environment/environment.ts
export const enviroments = {
    ipClient:'TU_IP_BACKEND'
}
```

Ejemplos de configuración:
- Desarrollo local: `http://localhost`
- IP específica: `http://192.168.1.100`
- Dominio: `http://tu-dominio.com`

**IMPORTANTE:** Asegúrate de usar la IP o dominio correcto donde está alojado tu servidor backend.

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
cd aviator-game
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` por defecto.

## Estructura del Proyecto

```
aviator-game/
├── src/
│   ├── components/      # Componentes React
│   ├── models/         # Interfaces y tipos
│   ├── shared/         # Componentes compartidos
│   ├── utils/          # Utilidades (socket-service)
│   └── views/          # Vistas principales
```

## Funcionalidades Principales

- Inicio de sesión con nombre de usuario: debe iniciarse sesión con uno de los 3 jugadores establecidos en el campo "Ingresa tu nombre", estos jugadores son Gabriel, Edinson y Deivid.

- Visualización del juego en tiempo real
- Panel de apuestas
- Lista de jugadores activos
- Historial de apuestas
- Animación del multiplicador

## Solución de Problemas

1. Error de conexión al backend:
   - Verifica que la IP/dominio en `socket-service.ts` sea correcta
   - Confirma que el backend esté en ejecución
   - Revisa la consola del navegador para errores de CORS

2. Problemas con WebSocket:
   - El backend debe tener configurado CORS correctamente
   - Verifica que los puertos estén abiertos
   - Comprueba la configuración del balanceador de carga si existe

## Desarrollo

Para ejecutar en modo desarrollo con hot-reload:
```bash
npm run dev
```

Para compilar para producción:
```bash
npm run build
```

## Notas de Despliegue

1. Para producción, actualiza la URL del socket en `socket-service.ts` a tu dominio de producción.
2. Si usas HTTPS en producción, asegúrate de que la URL del socket también use HTTPS.
3. Configura las variables de entorno según sea necesario.

## Tecnologías Utilizadas

- React
- TypeScript
- Socket.IO Client
- Vite
- PIXI.js para animaciones
