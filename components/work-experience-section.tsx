"use client";

import React, { useState } from "react";
import Image from "next/image";
import { workExperienceData } from "@/data/experience-data";
import { cn } from "@/lib/utils";
import DecodeText from "./MatrixCursor/DecodeText";
import { ChevronDown, Building2 } from "lucide-react";

interface WorkExperienceSectionProps {
  className?: string;
}

export function WorkExperienceSection({
  className,
}: WorkExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      aria-labelledby="work-experience-heading"
      className={cn("mb-8", className)}
    >
      <h2
        id="work-experience-heading"
        className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500 text-balance"
      >
        <DecodeText text="Work Experience" />
      </h2>
      <ul className="list-none space-y-4 sm:space-y-6">
        {workExperienceData.map((experience, index) => {
          const isExpanded = expandedId === experience.id;
          const isLast = index === workExperienceData.length - 1;
          return (
            <li key={experience.id}>
              <button
                onClick={() => toggleExpand(experience.id)}
                className="w-full flex items-start gap-2 sm:gap-3 text-left focus:outline-none group py-1 sm:py-2 hover:opacity-80 transition-opacity duration-200"
                aria-expanded={isExpanded}
                aria-controls={`experience-details-${experience.id}`}
              >
                {/* Company Logo/Icon */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                  {experience.logo ? (
                    <Image
                      src={experience.logo}
                      alt={`${experience.company} logo`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-full"
                      unoptimized={experience.logo.startsWith("http")}
                    />
                  ) : (
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-green-500 dark:text-green-500 mb-0.5 sm:mb-1 break-words">
                        {experience.company}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 break-words">
                        {experience.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      <span className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {experience.startDate} - {experience.endDate}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 dark:text-green-500 transition-transform duration-200 flex-shrink-0",
                          isExpanded && "transform rotate-180",
                        )}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* Expandable Details */}
              {isExpanded && (
                <div
                  id={`experience-details-${experience.id}`}
                  className="mt-2 sm:mt-3 pl-[44px] sm:pl-[60px] pt-2"
                >
                  {experience.description && (
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 mb-2 sm:mb-3 break-words">
                      {experience.description}
                    </p>
                  )}
                  {experience.achievements &&
                    experience.achievements.length > 0 && (
                      <ul className="list-none space-y-1.5 sm:space-y-2">
                        {experience.achievements.map((achievement, index) => (
                          <li
                            key={index}
                            className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 flex items-start gap-1.5 sm:gap-2"
                          >
                            <span className="text-green-500 dark:text-green-500 mt-0.5 flex-shrink-0">
                              •
                            </span>
                            <span className="break-words">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
              {!isLast && (
                <hr className="border-neutral-200 dark:border-neutral-800 mt-4 sm:mt-6" />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
