"use client";

import React from "react";
import GitHubCalendar from "react-github-calendar";
import { ActivityCalendar } from "react-activity-calendar";
import type { ThemeInput } from "react-activity-calendar";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import DecodeText from "./MatrixCursor/DecodeText";
import type { GitHubContribution } from "@/lib/github";

interface GitHubContributionsProps {
  username: string;
  compact?: boolean;
  className?: string;
}

interface GitHubCalendarResponse {
  success: boolean;
  contributions: GitHubContribution[];
  count: number;
  cached?: boolean;
  error?: string;
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
  const [contributions, setContributions] = React.useState<
    GitHubContribution[] | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    let isMounted = true;

    async function fetchContributions() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ username });
        const response = await fetch(`/api/github-calendar?${params}`);

        if (!response.ok) {
          const text = await response.text().catch(() => "<no-body>");
          console.error("Failed to fetch GitHub calendar", {
            status: response.status,
            statusText: response.statusText,
            body: text,
          });
          throw new Error(
            `Request failed with status ${response.status}: ${response.statusText}`
          );
        }

        const data = (await response.json()) as GitHubCalendarResponse;

        if (!isMounted) return;

        if (!data.success) {
          console.error("GitHub calendar API returned error", data);
          throw new Error(data.error || "Unknown error from calendar API");
        }

        setContributions(data.contributions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub contributions from client", {
          username,
          error,
        });

        if (!isMounted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load GitHub contributions."
        );
        setIsLoading(false);
      }
    }

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [mounted, username]);

  const colorScheme = theme === "dark" ? "dark" : "light";

  if (!mounted || isLoading) {
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

  if (error) {
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
        <div className="rounded-xl border border-red-500/40 bg-red-50 dark:bg-red-900/10 p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load contributions: {error}
          </p>
          <p className="text-red-500 dark:text-red-500 text-xs mt-2">
            Falling back to direct GitHub fetch...
          </p>
        </div>
        {/* Fallback to direct fetch if API fails */}
        <motion.div
          className="relative overflow-hidden rounded-xl border border-green-600/40 dark:border-green-500/40 bg-transparent mt-4"
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
          {contributions && contributions.length > 0 ? (
            <ActivityCalendar
              data={contributions}
              colorScheme={colorScheme}
              fontSize={compact ? 14 : 12}
              blockSize={compact ? 12 : 12}
              blockMargin={compact ? 2 : 3}
              showWeekdayLabels={!compact}
              theme={themeColors}
            />
          ) : (
            <GitHubCalendar
              username={username}
              colorScheme={colorScheme}
              fontSize={compact ? 11 : 12}
              blockSize={compact ? 12 : 12}
              blockMargin={compact ? 2 : 3}
              showWeekdayLabels={!compact}
              theme={themeColors}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
