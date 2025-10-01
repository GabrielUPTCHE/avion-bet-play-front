import { useEffect, useRef, useState } from "react";
import { getSocket } from "../utils/socket-service";

import './RenderAviatorGame.css'

interface RoundStartPayload { crashPoint: number; }
interface RoundEndPayload { finalMultiplier: number; }

interface RenderAviatorGameProps {
  isRunning: boolean;
  setIsRunning: (state: boolean) => void;
}

export function RenderAviatorGame({ isRunning, setIsRunning }: RenderAviatorGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [multiplier, setMultiplier] = useState(1);

  const target = useRef({ x: 50, y: 450 });
  const position = useRef({ x: 50, y: 450 });

  const startTime = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const socket = getSocket();

  useEffect(() => {
    const handleStart = (payload: RoundStartPayload) => {
      console.log("🎮 Round Start", payload);
      setIsRunning(true);
      setMultiplier(1);
      target.current = { x: 50, y: 450 };
      position.current = { x: 50, y: 450 };
      startTime.current = performance.now();
    };

    const handleEnd = (payload: RoundEndPayload) => {
      console.log("💥 Round End", payload);
      setIsRunning(false);
      target.current = { x: 50, y: 450 };
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

      ctx.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

      drawCloud(ctx, 200, 100);
      drawCloud(ctx, 500, 150);
      drawCloud(ctx, 350, 80);

      if (isRunning && startTime.current !== null) {
        const elapsed = (now - startTime.current) / 1000;
        const newMultiplier = 1 + elapsed * 0.91;
        setMultiplier(Number(newMultiplier.toFixed(1)));

        target.current = {
          x: 50 + elapsed * 30,
          y: 450 - newMultiplier * 20,
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
    <div className="game-container">
      <div>

        <h3 className="multiplier">Multiplicador: {multiplier.toFixed(2)}x</h3>
      </div>
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={900} height={500} />
      </div>
    </div>
  );
}

// -------- helpers --------
function drawPlane(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Fuselaje (cuerpo principal)
  ctx.fillStyle = "#d32f2f"; // rojo elegante
  ctx.beginPath();
  ctx.ellipse(x, y, 40, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cabina
 

  // Ala principal
  ctx.fillStyle = "#b71c1c";
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x - 35, y - 20);
  ctx.lineTo(x - 25, y);
  ctx.lineTo(x - 35, y + 20);
  ctx.closePath();
  ctx.fill();

  // Cola vertical
  ctx.fillStyle = "#9a0007";
  ctx.beginPath();
  ctx.moveTo(x - 38, y - 5);
  ctx.lineTo(x - 55, y - 15);
  ctx.lineTo(x - 38, y + 5);
  ctx.closePath();
  ctx.fill();

  // Cola horizontal
  ctx.fillStyle = "#7f0000";
  ctx.fillRect(x - 48, y - 3, 12, 6);

  // Detalle nariz
  ctx.fillStyle = "#ffebee";
  ctx.beginPath();
  ctx.arc(x + 40, y, 6, 0, Math.PI * 2);
  ctx.fill();
}


function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 25, y - 10, 25, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
  ctx.fill();
}