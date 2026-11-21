"use client";

import React, { useRef, useCallback } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

// Wall-clock pace (ms per decoded char) — frame-rate independent, unlike a
// per-frame counter which runs 2x fast on 120Hz displays.
const FIRST_DECODE_MS_PER_CHAR = 90;
// Repeat hovers re-commit to the full scramble; keep the brand, drop the wait.
const REPEAT_DECODE_MS_PER_CHAR = 35;

const DecodeText: React.FC<{ text: string }> = ({ text }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasDecodedRef = useRef(false);

  const animateDecode = useCallback(() => {
    // Cancel any running animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    // The scramble is pure decoration — don't run it for reduced-motion users
    if (prefersReducedMotion()) return;

    const msPerChar = hasDecodedRef.current
      ? REPEAT_DECODE_MS_PER_CHAR
      : FIRST_DECODE_MS_PER_CHAR;
    hasDecodedRef.current = true;
    const textLen = text.length;
    let startTime: number | null = null;

    const step = (now: number) => {
      const span = spanRef.current;
      if (!span) return;
      if (startTime === null) startTime = now;

      const iteration = (now - startTime) / msPerChar;

      // Build the decoded string directly
      let result = "";
      for (let i = 0; i < textLen; i++) {
        if (i < iteration) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      // Update DOM directly — no React state involved
      span.textContent = result;

      if (iteration >= textLen) {
        // Animation complete — ensure final text is correct
        span.textContent = text;
        animationRef.current = null;
        return;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  }, [text]);

  const handleMouseEnter = useCallback(() => {
    animateDecode();
  }, [animateDecode]);

  const handleMouseLeave = useCallback(() => {
    // Cancel animation and reset to original text
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (spanRef.current) {
      spanRef.current.textContent = text;
    }
  }, [text]);

  return (
    <span
      ref={spanRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </span>
  );
};

export default DecodeText;
