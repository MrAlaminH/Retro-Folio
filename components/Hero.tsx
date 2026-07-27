import React from "react";
import { GitHubContributions } from "./github-contributions";
import { SkillsSection } from "./skills-section";
import { WorkExperienceSection } from "./work-experience-section";
import AboutMe from "./hero/AboutMe";
import MyProjects from "./hero/MyProjects";
import Contact from "./hero/Contact";

export default function Portfolio() {
  return (
    <div className="bg-transparent text-black dark:text-gray-100 min-h-screen p-4 flex justify-center text-sm ">
      <div className="w-full max-w-3xl">
        <hr className="border-green-700 dark:border-green-500 my-4" />

        <main>
          <AboutMe />

          <hr className="border-green-700 dark:border-green-500 my-8" />

          <MyProjects />
          <WorkExperienceSection />
          <hr className="border-green-700 dark:border-green-500 my-8" />
          <SkillsSection />
          <hr className="border-green-700 dark:border-green-500 my-8" />
          <GitHubContributions username="MrAlaminH" compact className="mt-6" />

          <hr className="border-green-700 dark:border-green-500 my-8" />

          <Contact />
        </main>
      </div>
    </div>
  );
}
