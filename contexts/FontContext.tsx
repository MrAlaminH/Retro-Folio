"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

type Font = "ibmBios" | "inter" | "departureMono";

interface FontContextType {
  font: Font;
  setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [font, setFont] = useState<Font>("ibmBios");

  useEffect(() => {
    const savedFont = localStorage.getItem("font") as Font | null;
    if (savedFont) {
      setFont(savedFont);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("font", font);
    document.documentElement.style.setProperty(
      "font-family",
      font === "ibmBios"
        ? "'IBM BIOS', monospace"
        : font === "inter"
        ? "'Inter', sans-serif"
        : "'Departure Mono', monospace"
    );
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
