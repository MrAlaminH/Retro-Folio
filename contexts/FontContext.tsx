"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

type Font = "Kalam" | "inter" | "departureMono";

interface FontContextType {
  font: Font;
  setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [font, setFont] = useState<Font>("departureMono");

  useEffect(() => {
    const savedFont = localStorage.getItem("font") as Font | null;
    if (savedFont) {
      setFont(savedFont);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("font", font);

    // Build font-family value
    let fontFamily: string;
    if (font === "Kalam") {
      fontFamily = "'Kalam', cursive";
    } else if (font === "inter") {
      fontFamily = "'Inter', sans-serif";
    } else {
      fontFamily = "'Departure Mono', monospace";
    }

    document.documentElement.style.setProperty("font-family", fontFamily);

    // Dynamically load Inter font only when selected
    const linkId = "inter-font-preload";
    const existingLink = document.getElementById(linkId);

    if (font === "inter" && !existingLink) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    } else if (font !== "inter" && existingLink) {
      existingLink.remove();
    }
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
