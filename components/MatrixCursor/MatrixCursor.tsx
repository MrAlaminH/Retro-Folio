"use client";

import React, { useRef, useEffect, useCallback } from "react";

const TRAIL_LENGTH = 30;
const FADE_INTERVAL_MS = 20;
const THROTTLE_MS = 16;
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 22;
const TRAIL_OPACITY_STEP = 0.04;

interface Point {
  x: number;
  y: number;
  char: string;
  opacity: number;
}

export default function MatrixCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Point[]>([]);
  const isEnabledRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastFadeTimeRef = useRef(0);

  const matrixChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";

  const getRandomChar = useCallback(
    () => matrixChars[Math.floor(Math.random() * matrixChars.length)],
    [matrixChars]
  );

  // Detect mobile/touch devices — same as before
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    isEnabledRef.current = !isTouchDevice && !isMobile;
  }, []);

  // Mouse move handler — writes to ref (no state update)
  useEffect(() => {
    if (!isEnabledRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTimeRef.current < THROTTLE_MS) return;
      lastMoveTimeRef.current = now;

      const trail = trailRef.current;
      trail.unshift({
        x: e.clientX,
        y: e.clientY,
        char: getRandomChar(),
        opacity: 1,
      });
      if (trail.length > TRAIL_LENGTH) {
        trail.length = TRAIL_LENGTH;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [getRandomChar]);

  // Animation loop — renders to canvas via requestAnimationFrame
  useEffect(() => {
    if (!isEnabledRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Fade trail points at a controlled interval
      if (timestamp - lastFadeTimeRef.current >= FADE_INTERVAL_MS) {
        lastFadeTimeRef.current = timestamp;
        const trail = trailRef.current;
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i].opacity -= TRAIL_OPACITY_STEP;
          if (trail[i].opacity <= 0) {
            trail.splice(i, 1);
          }
        }
      }

      // Clear canvas (semi-transparent for motion blur effect)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      ctx.font = `${MAX_FONT_SIZE}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        const t = 1 - i / TRAIL_LENGTH; // 1 = newest, 0 = oldest
        const opacity = p.opacity * t;
        if (opacity <= 0) continue;

        const fontSize = Math.max(
          MIN_FONT_SIZE,
          MAX_FONT_SIZE - i * 0.2
        );
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.shadowColor = "rgba(34, 197, 94, 0.5)";
        ctx.shadowBlur = 5;
        ctx.fillText(p.char, p.x, p.y);
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
