"use client";
import React, { useState } from "react";

interface AboutMeToggleProps {
  children: React.ReactNode;
  collapsedChildren: React.ReactNode;
}

export default function AboutMeToggle({ children, collapsedChildren }: AboutMeToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <p className="mt-4 whitespace-pre-wrap text-black dark:text-gray-100 ">
        <span className="mr-2 text-green-500 dark:text-green-500">{">"}</span>
        {isExpanded ? children : collapsedChildren}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline"
      >
        {isExpanded ? "Learn less >" : "Learn more>"}
      </button>
    </>
  );
}
