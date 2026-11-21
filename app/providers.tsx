// app/providers.tsx
"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { MotionConfig } from "framer-motion";

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: false, // Disabled: prevents bfcache issues
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      {/* All framer-motion animations respect prefers-reduced-motion:
          transforms are skipped, opacity/color feedback is kept. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </PostHogProvider>
  );
}
