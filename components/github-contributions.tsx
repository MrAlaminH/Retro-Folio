"use client";

import React from "react";
import GitHubCalendar from "react-github-calendar";
import { ActivityCalendar } from "react-activity-calendar";
import type { ThemeInput } from "react-activity-calendar";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO, useEnterTransform } from "@/lib/motion";
import { useTheme } from "@/contexts/ThemeContext";
import DecodeText from "./MatrixCursor/DecodeText";
import type { GitHubContribution } from "@/lib/github";

interface GitHubContributionsProps {
  username: string;
  compact?: boolean;
  className?: string;
  /** Server-fetched contributions; null = fetch failed → browser fallback. */
  contributions: GitHubContribution[] | null;
}

const themeColors: ThemeInput = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export function GitHubContributions({
  username,
  compact = false,
  className = "",
  contributions,
}: GitHubContributionsProps) {
  const { theme } = useTheme();
  const panelEnter = useEnterTransform("translateY(16px)");

  const colorScheme: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const hasData = !!contributions && contributions.length > 0;
  const calendarProps = {
    colorScheme,
    fontSize: compact ? 14 : 12,
    blockSize: 12,
    blockMargin: compact ? 2 : 3,
    showWeekdayLabels: !compact,
    theme: themeColors,
  };

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

      {contributions === null && (
        <div className="rounded-xl border border-red-500/40 bg-red-50 dark:bg-red-900/10 p-4 mb-4">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load contributions: Couldn&apos;t load contributions from
            the API.
          </p>
          <p className="text-red-500 dark:text-red-500 text-xs mt-2">
            Falling back to direct GitHub fetch...
          </p>
        </div>
      )}

      <motion.div
        className="relative overflow-hidden rounded-xl border border-green-600/40 dark:border-green-500/40 bg-transparent"
        initial={{ opacity: 0, transform: panelEnter }}
        animate={{
          opacity: 1,
          transform: panelEnter === undefined ? undefined : "translateY(0px)",
        }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      >
        <div
          className={`${
            compact ? "p-3" : "p-4"
          } bg-black/5 dark:bg-white/5 backdrop-blur-sm`}
        >
          {hasData ? (
            <ActivityCalendar data={contributions} {...calendarProps} />
          ) : (
            <GitHubCalendar username={username} {...calendarProps} />
          )}
        </div>
      </motion.div>
    </section>
  );
}
