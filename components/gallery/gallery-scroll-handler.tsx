"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function GalleryScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const attemptScroll = () => {
        const element = document.getElementById(`category-${categoryParam}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };

      if (attemptScroll()) return;

      const timeoutId = setTimeout(() => {
        attemptScroll();
      }, 100);

      const longTimeoutId = setTimeout(() => {
        attemptScroll();
      }, 500);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(longTimeoutId);
      };
    }
  }, [searchParams]);

  return null;
}
