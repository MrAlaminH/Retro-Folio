"use client";

import React from "react";
import GitHubCalendar from "react-github-calendar";
import type { ThemeInput } from "react-activity-calendar";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import DecodeText from "./MatrixCursor/DecodeText";

interface GitHubContributionsProps {
  username: string;
  compact?: boolean;
  className?: string;
}

const themeColors: ThemeInput = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export function GitHubContributions({
  username,
  compact = false,
  className = "",
}: GitHubContributionsProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const colorScheme = theme === "dark" ? "dark" : "light";

  if (!mounted) {
    return (
      <section
        aria-label="GitHub contributions loading"
        className={`mt-8 w-full ${className}`}
      >
        <div
          className={`w-full ${
            compact ? "h-[120px]" : "h-[160px]"
          } rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse`}
        />
      </section>
    );
  }

  return (
    <section
      aria-labelledby="github-contributions-heading"
      className={`mt-8 ${className}`}
    >
      <h2
        id="github-contributions-heading"
        className="text-lg md:text-xl font-bold mb-3 text-green-500 dark:text-green-500"
      >
        <DecodeText text="GitHub Contributions @ MrAlaminH" />
      </h2>

      <motion.div
        className="relative overflow-hidden rounded-xl border border-green-600/40 dark:border-green-500/40 bg-transparent"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className={`${
            compact ? "p-3" : "p-4"
          } bg-black/5 dark:bg-white/5 backdrop-blur-sm`}
        >
          <GitHubCalendar
            username={username}
            colorScheme={colorScheme}
            fontSize={compact ? 14 : 12}
            blockSize={compact ? 12 : 12}
            blockMargin={compact ? 2 : 3}
            showWeekdayLabels={!compact}
            theme={themeColors}
          />
        </div>
      </motion.div>
    </section>
  );
}
