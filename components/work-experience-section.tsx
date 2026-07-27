import React from "react";
import { workExperienceData } from "@/data/experience-data";
import { cn } from "@/lib/utils";
import DecodeText from "./MatrixCursor/DecodeText";
import WorkExperienceExpandable from "./WorkExperienceExpandable";

interface WorkExperienceSectionProps {
  className?: string;
}

export function WorkExperienceSection({
  className,
}: WorkExperienceSectionProps) {
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
        {workExperienceData.map((experience, index) => (
          <WorkExperienceExpandable
            key={experience.id}
            experience={experience}
            isLast={index === workExperienceData.length - 1}
          />
        ))}
      </ul>
    </section>
  );
}
