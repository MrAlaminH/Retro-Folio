"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Reads the current theme from the `.dark` class on <html>.
 *
 * Source-of-truth ownership:
 *  - Persistence (localStorage) and the `.dark` class toggle are owned by the
 *    `react-theme-switch-animation` hook used in <Navbar />.
 *  - This provider only *mirrors* that state into React so the read-only
 *    consumers (retro-button, github-contributions, ChatWidget) stay reactive.
 *
 * This split avoids two writers racing on localStorage.theme / the `.dark`
 * class (which previously corrupted the stored preference on first paint).
 */
const readThemeFromDom = (): Theme =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default to "dark" so SSR markup matches the server. The inline FOUC script
  // in layout.tsx sets the real `.dark` class on <html> before hydration; the
  // effect below syncs React state to the DOM on mount and on every toggle.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readThemeFromDom());

    // Keep React state in sync when the theme-switch animation toggles the class.
    const observer = new MutationObserver(() => setTheme(readThemeFromDom()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeContext };
