"use client";

import React from "react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className=" dark:text-gray-100 bg-white dark:bg-black transition-colors duration-300 text-green-400 min-h-screen font-mono p-8 flex flex-col items-center justify-center overflow-hidden">
      <svg
        className="w-full max-w-2xl mb-8"
        viewBox="0 0 300 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glitch">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="1"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              result="glitch1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="-5"
              result="glitch2"
            />
            <feBlend in="glitch1" in2="glitch2" mode="screen" result="blend" />
          </filter>
        </defs>
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          className="text-9xl font-bold fill-green-400"
          filter="url(#glitch)"
        >
          404
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </text>
      </svg>

      <div className="glitch-wrapper mb-8">
        <div className="glitch" data-text="PAGE NOT FOUND">
          PAGE NOT FOUND
        </div>
      </div>

      <Link href="/" className="relative px-6 py-3 group">
        <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-green-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-black border-2 border-green-400 group-hover:bg-green-400"></span>
        <span className="relative text-green-400 group-hover:text-black">
          Return to Home Base
        </span>
      </Link>

      <div className="mt-12 text-sm text-center w-full px-4 sm:px-0 max-w-[90vw] sm:max-w-md mx-auto">
        <div className="typewriter overflow-hidden">
          <p className="mb-2 whitespace-normal break-words">
            {" "}
            &gt;ERROR_MESSAGE: Page not found in the digital realm...
          </p>
          <p className="whitespace-normal break-words">
            {" "}
            &gt;SUGGESTION: Navigate back to base...
          </p>
        </div>
      </div>
    </div>
  );
}
