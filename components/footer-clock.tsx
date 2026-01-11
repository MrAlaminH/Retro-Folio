"use client";

import React, { useState, useEffect } from "react";

export function FooterClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      // Get current time in Bangladesh timezone (Asia/Dhaka, UTC+6)
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };

      const timeString = now.toLocaleTimeString("en-US", options);
      setTime(timeString);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-center gap-1.5">
      <span className="text-black dark:text-white">Local Time:</span>
      <span className="text-green-700 dark:text-green-500 font-mono font-medium">
        {time}
      </span>
    </span>
  );
}
