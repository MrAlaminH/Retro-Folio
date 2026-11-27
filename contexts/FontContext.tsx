"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Font, getFontFamily, parseStoredFont } from "@/lib/font";

interface FontContextType {
  font: Font;
  setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

function applyFontToDom(nextFont: Font) {
  document.documentElement.style.setProperty(
    "font-family",
    getFontFamily(nextFont)
  );

  // Dynamically load Inter font only when selected
  const linkId = "inter-font-preload";
  const existingLink = document.getElementById(linkId);

  if (nextFont === "inter" && !existingLink) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  } else if (nextFont !== "inter" && existingLink) {
    existingLink.remove();
  }
}

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [font, setFontState] = useState<Font>("departureMono");
  const hydratedRef = useRef(false);

  useEffect(() => {
    let saved: Font = "departureMono";
    try {
      saved = parseStoredFont(localStorage.getItem("font"));
    } catch {
      /* storage unavailable */
    }
    hydratedRef.current = true;
    applyFontToDom(saved);
    if (saved !== "departureMono") {
      setFontState(saved);
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    applyFontToDom(font);
  }, [font]);

  const setFont = useCallback((nextFont: Font) => {
    setFontState(nextFont);
    try {
      localStorage.setItem("font", nextFont);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const fontValue = useMemo(() => ({ font, setFont }), [font, setFont]);

  return (
    <FontContext.Provider value={fontValue}>{children}</FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
