"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface RetroButtonProps {
  href: string;
  text: string;
  external?: boolean;
  className?: string;
}

export default function RetroButton({
  href,
  text,
  external = false,
  className = "",
}: RetroButtonProps) {
  const { theme } = useTheme();

  // Check if href is external URL
  const isExternalUrl =
    external || href.startsWith("http://") || href.startsWith("https://");

  // Theme-aware styles
  const isDark = theme === "dark";

  const backgroundGradient = isDark
    ? `linear-gradient(135deg, 
        rgba(0, 0, 0, 0.4) 0%, 
        rgba(20, 83, 45, 0.15) 50%, 
        rgba(0, 0, 0, 0.4) 100%
      )`
    : `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(220, 252, 231, 0.4) 50%, 
        rgba(255, 255, 255, 0.9) 100%
      )`;

  const borderColor = isDark
    ? `rgba(34, 197, 94, 0.4)`
    : `rgba(5, 46, 22, 0.6)`;

  const textShadow = isDark
    ? `0 0 4px rgba(34, 197, 94, 0.5),
       0 0 8px rgba(34, 197, 94, 0.3)`
    : `0 1px 2px rgba(0, 0, 0, 0.1),
       0 2px 4px rgba(5, 46, 22, 0.15)`;

  const scanlineColor = isDark
    ? `rgba(34, 197, 94, 0.1)`
    : `rgba(5, 46, 22, 0.08)`;

  const hoverGlow = isDark
    ? `inset 0 0 16px rgba(34, 197, 94, 0.3)`
    : `inset 0 0 16px rgba(5, 46, 22, 0.2)`;

  const buttonContent = (
    <div
      className={`group relative inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm leading-tight cursor-pointer transition-all duration-300 hover:scale-105 retro-button-pulse ${className}`}
      style={{
        background: backgroundGradient,
        border: `1px solid ${borderColor}`,
        textShadow: textShadow,
      }}
    >
      {/* Pixel border corners */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-green-700/60 dark:bg-green-500/40"></span>
      <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-700/60 dark:bg-green-500/40"></span>
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-green-700/60 dark:bg-green-500/40"></span>
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-700/60 dark:bg-green-500/40"></span>

      <span className="text-green-700 dark:text-green-400 font-bold retro-button-pulse-slow">
        &gt;
      </span>
      <span className="text-green-700 dark:text-green-400 font-semibold tracking-wider">
        {text}
      </span>
      <span className="text-green-700/50 dark:text-green-500/40 text-[10px] md:text-xs ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        &gt;&gt;
      </span>

      {/* Animated scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.06] retro-button-scanline"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            ${scanlineColor} 1px,
            ${scanlineColor} 2px
          )`,
        }}
      ></div>

      {/* Pulsing glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="w-full h-full retro-button-pulse-glow"
          style={{
            boxShadow: hoverGlow,
          }}
        ></div>
      </div>
    </div>
  );

  if (isExternalUrl) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <Link href={href} className="inline-block">
      {buttonContent}
    </Link>
  );
}
