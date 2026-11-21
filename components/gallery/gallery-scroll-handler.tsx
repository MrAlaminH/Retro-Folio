"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function GalleryScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam) return;

    // Retry machine: poll until the category section exists (it hydrates
    // after first paint), then scroll once. Deadline instead of the old
    // two fixed-guess timeouts, which could both miss on a slow device.
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = undefined;
    };
    const attemptScroll = () => {
      const element = document.getElementById(`category-${categoryParam}`);
      if (!element) return;
      stop();
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    attemptScroll();
    intervalId = setInterval(attemptScroll, 100);
    // ponytail: fixed 2s deadline rather than unbounded polling; bump if
    // image hydration ever legitimately exceeds it.
    const deadlineId = setTimeout(stop, 2000);

    return () => {
      stop();
      clearTimeout(deadlineId);
    };
  }, [searchParams]);

  return null;
}
