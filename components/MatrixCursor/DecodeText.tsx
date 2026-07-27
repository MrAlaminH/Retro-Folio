"use client";
import React, { useRef, useCallback } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

const DecodeText: React.FC<{ text: string }> = ({ text }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const iterationRef = useRef(0);

  const animateDecode = useCallback(() => {
    // Cancel any running animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    iterationRef.current = 0;
    const textLen = text.length;

    const step = () => {
      const iteration = iterationRef.current;
      const span = spanRef.current;
      if (!span) return;

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

      // Advance 1 character every ~5 frames (~83ms at 60fps) to match
      // original ~90ms/character pace from the 30ms-interval implementation
      iterationRef.current = iteration + 0.2;
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
