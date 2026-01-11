"use client";

import React, { useState, useEffect } from "react";

export function FooterVisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndIncrementCount = async () => {
      try {
        // Check if we've already incremented in this session
        const hasIncremented = sessionStorage.getItem("visitorCounted");

        if (!hasIncremented) {
          // Increment the counter
          const incrementResponse = await fetch("/api/visitor-count", {
            method: "POST",
          });

          if (incrementResponse.ok) {
            const data = await incrementResponse.json();
            setCount(data.count);
            sessionStorage.setItem("visitorCounted", "true");
          }
        } else {
          // Just fetch the current count
          const response = await fetch("/api/visitor-count");
          if (response.ok) {
            const data = await response.json();
            setCount(data.count);
          }
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error);
        setCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndIncrementCount();
  }, []);

  if (isLoading) {
    return (
      <span className="flex items-center gap-1.5">
        <span className="text-black dark:text-white">Visitors:</span>
        <span className="text-green-700 dark:text-green-500 font-mono font-medium">
          ...
        </span>
      </span>
    );
  }

  if (count === null) {
    return null;
  }

  return (
    <span className="flex items-center gap-1.5">
      <span className="text-black dark:text-white">Visitors:</span>
      <span className="text-green-700 dark:text-green-500 font-mono font-medium">
        {count.toLocaleString()}
      </span>
    </span>
  );
}
