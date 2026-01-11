"use client";

import React from "react";
import { skillsData } from "@/data/skills-data";
import { cn } from "@/lib/utils";
import DecodeText from "./MatrixCursor/DecodeText";

interface SkillsSectionProps {
  className?: string;
}

export function SkillsSection({ className }: SkillsSectionProps) {
  return (
    <section aria-labelledby="skills-heading" className={cn("mb-8", className)}>
      <h2
        id="skills-heading"
        className="text-lg md:text-xl font-bold mb-3 sm:mb-4 text-green-500 dark:text-green-500 text-balance"
      >
        <DecodeText text="Technologies & Tools" />
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-3">
        {skillsData.map((skill) => {
          const IconComponent = skill.icon;
          const isLinux = skill.name === "Linux";
          return (
            <a
              key={skill.name}
              href={skill.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex items-center gap-1.5 sm:gap-2 px-2 py-2 sm:px-3 sm:py-2.5 rounded-md",
                "bg-neutral-700 dark:bg-neutral-800",
                "border border-dotted border-neutral-500 dark:border-neutral-600",
                "text-white dark:text-gray-100",
                "transition-all duration-200",
                "hover:bg-neutral-600 dark:hover:bg-neutral-700",
                "hover:border-green-500/60 dark:hover:border-green-500/60",
                "focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 dark:focus:ring-offset-neutral-900",
                isLinux && "hidden sm:flex"
              )}
              aria-label={`${skill.name} - Opens in new tab`}
            >
              <IconComponent
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-white dark:text-gray-100",
                  "transition-transform duration-200",
                  "group-hover:scale-110"
                )}
                aria-hidden="true"
              />
              <span className="text-[10px] sm:text-xs md:text-sm font-medium truncate">
                {skill.name}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
