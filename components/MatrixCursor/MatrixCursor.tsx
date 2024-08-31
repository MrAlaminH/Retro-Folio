"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useThrottledCallback } from "use-debounce";

interface Point {
  x: number;
  y: number;
  id: number;
  char: string;
  initialOpacity: number;
}

const TRAIL_LENGTH = 50; // Increased for longer trail
const FADE_INTERVAL = 16; // Faster updates for smoother animation
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 20; // Slightly larger max font size
const THROTTLE_MS = 8; // Reduced for more responsive cursor tracking
const TRAIL_OPACITY_STEP = 0.02; // Smaller steps for smoother fade

export default function MatrixCursor() {
  const [trail, setTrail] = useState<Point[]>([]);

  const matrixChars = useMemo(
    () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~".split(
        ""
      ),
    []
  );

  const getRandomChar = useCallback(
    () => matrixChars[Math.floor(Math.random() * matrixChars.length)],
    [matrixChars]
  );

  const updatePosition = useThrottledCallback((e: MouseEvent) => {
    const newPoint = {
      x: e.clientX,
      y: e.clientY,
      id: Date.now(),
      char: getRandomChar(),
      initialOpacity: 1,
    };
    setTrail((prevTrail) => [
      newPoint,
      ...prevTrail.slice(0, TRAIL_LENGTH - 1),
    ]);
  }, THROTTLE_MS);

  useEffect(() => {
    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrail((prevTrail) =>
        prevTrail
          .map((point) => ({
            ...point,
            initialOpacity: Math.max(
              0,
              point.initialOpacity - TRAIL_OPACITY_STEP
            ),
          }))
          .filter((point) => point.initialOpacity > 0)
      );
    }, FADE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="absolute text-green-500 text-xs font-mono transition-all duration-100 ease-out"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            opacity: point.initialOpacity * (1 - index / TRAIL_LENGTH),
            fontSize: `${Math.max(
              MIN_FONT_SIZE,
              MAX_FONT_SIZE - index * 0.2
            )}px`,
            filter: `blur(${index * 0.2}px)`,
            textShadow: "0 0 5px #22c55e",
            transform: `translate(-50%, -50%) scale(${1 - index * 0.01})`,
          }}
        >
          {point.char}
        </div>
      ))}
    </div>
  );
}
