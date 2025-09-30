import { useEffect, useRef, useState } from "react";
import { getSocket } from "../utils/socket-service";

interface RoundStartPayload { crashPoint: number; }
interface PlaneUpdate { multiplier: number; timestamp: number; }
interface RoundEndPayload { finalMultiplier: number; }

interface RenderAviatorGameProp {
  isRunning: boolean;
  setIsRunning: (state:boolean) => void
  
}

export function RenderAviatorGame({isRunning, setIsRunning}: RenderAviatorGameProp) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);

  // posición objetivo (desde servidor)
  const target = useRef({ x: 50, y: 500 });
  // posición interpolada (animación)
  const position = useRef({ x: 50, y: 500 });

  const socket = getSocket();

  useEffect(() => {
    const handleStart = (payload: RoundStartPayload) => {
      setIsRunning(true);
      setCrashPoint(payload.crashPoint);
      setMultiplier(1);
      target.current = { x: 50, y: 500 };
      position.current = { x: 50, y: 500 };
    };

    const handleUpdate = ({multiplier}: PlaneUpdate) => {
      target.current = {
        x: target.current.x + 3,
        y: 500 - multiplier * 10,
      };
      setMultiplier(multiplier);
    };

    const handleEnd = (payload: RoundEndPayload) => {
      setIsRunning(false);
      target.current = { x: 50, y: 500 };
    };

    socket.on("round_start", handleStart);
    socket.on("plane_update", handleUpdate);
    socket.on("round_end", handleEnd);

    return () => {
      socket.off("round_start", handleStart);
      socket.off("plane_update", handleUpdate);
      socket.off("round_end", handleEnd);
    };
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas?.width ??0, canvas?.height ??0);

      // fondo
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas?.width ??0, canvas?.height ?? 0);

      // nubes
      drawCloud(ctx, 200, 100);
      drawCloud(ctx, 500, 150);
      drawCloud(ctx, 350, 80);

      // interpolar suavemente
      position.current.x += (target.current.x - position.current.x) * 0.1;
      position.current.y += (target.current.y - position.current.y) * 0.1;

      // avión (triángulo como avión)
      drawPlane(ctx, position.current.x, position.current.y);

      // multiplicador
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";

      requestAnimationFrame(draw);
    }

    draw();
  }, []);
  useEffect(()=>{
    console.log('el multiplier', multiplier)
  },[multiplier])

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Betplay Aviator clon</h2>
      <h3>Multiplicador: {multiplier}x</h3>
      <canvas ref={canvasRef} width={800} height={600} />
      {crashPoint && <p>Crash Point: {crashPoint}x</p>}
    </div>
  );
}

// -------- helpers --------

function drawPlane(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 40, y + 15);
  ctx.lineTo(x - 40, y - 15);
  ctx.closePath();
  ctx.fill();

  // alas
  ctx.fillStyle = "darkred";
  ctx.fillRect(x - 25, y - 5, 15, 10);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 25, y - 10, 25, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
  ctx.fill();
}
