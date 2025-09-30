import { useEffect, useRef, useState } from "react";
import { getSocket } from "../utils/socket-service";

interface RoundStartPayload { crashPoint: number; }
interface RoundEndPayload { finalMultiplier: number; }

interface RenderAviatorGameProps {
  isRunning: boolean;
  setIsRunning: (state: boolean) => void;
}

export function RenderAviatorGame({ isRunning, setIsRunning }: RenderAviatorGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [multiplier, setMultiplier] = useState(1);

  const target = useRef({ x: 50, y: 500 });
  const position = useRef({ x: 50, y: 500 });

  const startTime = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const socket = getSocket();

  useEffect(() => {
    const handleStart = (payload: RoundStartPayload) => {
      console.log("🎮 Round Start", payload);
      setIsRunning(true);
      setMultiplier(1);
      target.current = { x: 50, y: 500 };
      position.current = { x: 50, y: 500 };
      startTime.current = performance.now();
    };

    const handleEnd = (payload: RoundEndPayload) => {
      console.log("💥 Round End", payload);
      setIsRunning(false);
      target.current = { x: 50, y: 500 };
      startTime.current = null;
    };

    socket.on("round_start", handleStart);
    socket.on("round_end", handleEnd);

    return () => {
      socket.off("round_start", handleStart);
      socket.off("round_end", handleEnd);
    };
  }, [socket, setIsRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw(now: number) {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas?.width ??0, canvas?.height ?? 0);

      // fondo
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

      // nubes
      drawCloud(ctx, 200, 100);
      drawCloud(ctx, 500, 150);
      drawCloud(ctx, 350, 80);

      if (isRunning && startTime.current !== null) {
        const elapsed = (now - startTime.current) / 1000; // segundos
        const newMultiplier = 1 + elapsed * 0.91; // 
        setMultiplier(Number(newMultiplier.toFixed(1)));

        // actualizar target en base al multiplicador
        target.current = {
          x: 50 + elapsed * 30, // velocidad horizontal
          y: 500 - newMultiplier * 20, // altura
        };
      }

      // interpolar suavemente
      position.current.x += (target.current.x - position.current.x) * 0.1;
      position.current.y += (target.current.y - position.current.y) * 0.1;

      // avión
      drawPlane(ctx, position.current.x, position.current.y);

      // multiplicador
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.fillText(`${multiplier.toFixed(2)}x`, 20, 30);

      animationFrameId.current = requestAnimationFrame(draw);
    }

    animationFrameId.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRunning, multiplier]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Betplay Aviator clon</h2>
      <h3>Multiplicador: {multiplier.toFixed(2)}x</h3>
      <canvas ref={canvasRef} width={800} height={600} />
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
