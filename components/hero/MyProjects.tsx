import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import DecodeText from "../MatrixCursor/DecodeText";
import { getProjectDate, getProjectRawDate } from "./hero-utils";

interface Project {
  name: string;
  description: string;
  url: string;
  date?: string;
  rawDate?: Date | null;
}

const projectsBase = [
  {
    name: "Machine Man",
    description:
      "AI-powered Telegram Bot that generates creative text and stunning images. Built with advanced AI models to handle diverse user requests seamlessly.",
    url: "/projects/machine-man",
  },
  {
    name: "SolidArt",
    description:
      "Next Generation AI Image Generation Platform with cutting-edge algorithms. Create, explore, and share AI-generated artwork with powerful customization options.",
    url: "/projects/solidart",
  },
  {
    name: "Fusion Calling App",
    description:
      "AI Call Agent Platform that automates outbound calls for businesses. Intelligent conversation system that engages customers and drives conversions automatically.",
    url: "/projects/AI-Phone-Call-Agent",
  },
  {
    name: "TweetScraper",
    description:
      "Powerful tool to gather and analyze tweet data from specific hashtags. Extract valuable insights and trends from social media conversations with ease.",
    url: "/projects/TweetScraper",
  },
];

// Add dates to projects by matching with projectData and sort by date (most recent first)
const projects: Project[] = projectsBase
  .map((project) => ({
    ...project,
    date: getProjectDate(project.url) || "",
    rawDate: getProjectRawDate(project.url),
  }))
  .sort((a, b) => {
    // Projects without dates go to the bottom
    if (!a.rawDate && !b.rawDate) return 0;
    if (!a.rawDate) return 1;
    if (!b.rawDate) return -1;
    // Sort by date descending (most recent first)
    return b.rawDate.getTime() - a.rawDate.getTime();
  });

export default function MyProjects() {
  return (
    <section className="mb-8">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500">
        <DecodeText text="My Projects" />
      </h2>
      <p className="mb-2">A selection of stuff I made:</p>
      <ul className="list-none text-xs md:text-sm space-y-2">
        {projects.map((project, index) => (
          <li
            key={index}
            className="group p-2 rounded-md ease-in-out cursor-pointer pb-2 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0"
          >
            {/* Mobile: Stacked Layout */}
            <div className="flex flex-col md:hidden">
              {project.date && (
                <span className="text-black dark:text-gray-300 opacity-50 dark:opacity-40 text-xs mb-0.5">
                  {project.date}
                </span>
              )}
              <div className="flex items-center">
                <span className="mr-2 text-green-500 dark:text-green-500 transition-transform duration-300 group-hover:rotate-90">
                  {">"}
                </span>
                <Link
                  href={project.url}
                  className="text-green-500 dark:text-green-400 ease-in-out"
                >
                  <span className="font-semibold text-green-500 dark:text-green-500 underline">
                    {project.name}
                  </span>
                </Link>
                <ExternalLink className="ml-2 text-gray-400" size={16} />
              </div>
              <div className="flex items-start mt-0.5">
                <span className="mr-2 opacity-0 pointer-events-none">
                  {">"}
                </span>
                <span className="text-black dark:text-white">
                  {project.description}
                </span>
              </div>
            </div>
            {/* Desktop: Horizontal Layout */}
            <div className="hidden md:block">
              <div className="flex items-start">
                {project.date && (
                  <span className="mr-3 text-black dark:text-gray-300 whitespace-nowrap opacity-50 dark:opacity-40">
                    {project.date}
                  </span>
                )}
                <span className="mr-2 text-green-500 dark:text-green-500 transition-transform duration-300 group-hover:rotate-90">
                  {">"}
                </span>
                <Link
                  href={project.url}
                  className="text-green-500 dark:text-green-400 ease-in-out"
                >
                  <span className="font-semibold text-green-500 dark:text-green-500 underline">
                    {project.name}
                  </span>
                </Link>
                <ExternalLink className="ml-2 text-gray-400" size={16} />
              </div>
              <div className="flex items-start mt-1">
                {project.date && (
                  <span className="mr-3 opacity-0 pointer-events-none whitespace-nowrap">
                    {project.date}
                  </span>
                )}
                <span className="mr-2 opacity-0 pointer-events-none">
                  {">"}
                </span>
                <span className="text-black dark:text-white">
                  {project.description}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Check More Projects Button */}
      <div className="mt-4">
        <Link
          href="/projects"
          className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline inline-block"
        >
          Check More Projects &gt;
        </Link>
      </div>
    </section>
  );
}
