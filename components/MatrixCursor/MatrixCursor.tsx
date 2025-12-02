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

const TRAIL_LENGTH = 30; // Reduced for better performance
const FADE_INTERVAL = 20; // Optimized interval for performance
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 20;
const THROTTLE_MS = 16; // Optimized throttle for better performance
const TRAIL_OPACITY_STEP = 0.03; // Optimized for performance

export default function MatrixCursor() {
  const [trail, setTrail] = useState<Point[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);

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

  // Detect mobile/touch devices and disable on mobile
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Only enable on desktop non-touch devices
    if (!isTouchDevice && !isMobile) {
      setIsEnabled(true);
    }
  }, []);

  const updatePosition = useThrottledCallback((e: MouseEvent) => {
    if (!isEnabled) return;

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
    if (!isEnabled) return;

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, [updatePosition, isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

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
  }, [isEnabled]);

  // Don't render on mobile/touch devices
  if (!isEnabled) return null;

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
