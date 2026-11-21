"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface AboutMeToggleProps {
  children: React.ReactNode;
  collapsedChildren: React.ReactNode;
}

export default function AboutMeToggle({ children, collapsedChildren }: AboutMeToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      {/* Preview and full text cross-fold: one collapses while the other
          expands, so the height change is always animated */}
      <div
        className={cn(
          "disclosure",
          !isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"
        )}
      >
        <div className="disclosure-inner whitespace-pre-wrap text-black dark:text-gray-100">
          <span className="mr-2 text-green-500 dark:text-green-500">{">"}</span>
          {collapsedChildren}
        </div>
      </div>
      <div
        className={cn(
          "disclosure",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"
        )}
      >
        <div className="disclosure-inner whitespace-pre-wrap text-black dark:text-gray-100">
          <span className="mr-2 text-green-500 dark:text-green-500">{">"}</span>
          {children}
        </div>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline active:scale-97 transition-transform duration-150 origin-left"
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Learn less >" : "Learn more>"}
      </button>
    </div>
  );
}
