"use client";
import React, { useState, useEffect, useCallback } from "react";

const DecodeText: React.FC<{ text: string }> = ({ text }) => {
  const [decodedText, setDecodedText] = useState(text);
  const [isDecoding, setIsDecoding] = useState(false);

  const decodeEffect = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let iteration = 0;

    const interval = setInterval(() => {
      setDecodedText((prevText) =>
        prevText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsDecoding(false);
      }
      iteration += 1 / 3;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (isDecoding) {
      decodeEffect();
    }
  }, [isDecoding, decodeEffect]);

  return (
    <span
      onMouseEnter={() => setIsDecoding(true)}
      onMouseLeave={() => setDecodedText(text)}
    >
      {decodedText}
    </span>
  );
};

export default DecodeText;
