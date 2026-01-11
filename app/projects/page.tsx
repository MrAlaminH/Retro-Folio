"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { projectData } from "@/data/projectData";
import DecodeText from "@/components/MatrixCursor/DecodeText";
import { Globe } from "lucide-react";
import {
  SiGithub,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiPython,
  SiReact,
  SiTelegram,
  SiVercel,
  SiSupabase,
  SiPostgresql,
  SiOpenai,
} from "react-icons/si";

const Projects = () => {
  return (
    <section className="flex justify-center min-h-screen p-4 bg-transparent text-black dark:text-gray-100 text-sm mb-16">
      <div className="w-full max-w-3xl">
        <h2 className="mb-8 text-lg md:text-xl font-bold text-green-500 dark:text-green-500">
          <DecodeText text="Recent Projects" />
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {projectData.map((project) => (
            <div
              key={project.id}
              className="border-2 border-green-600 dark:border-green-500 p-4 transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-900 hover:bg-opacity-20 h-full flex flex-col shadow-[0_0_10px_rgba(0,128,0,0.3)] dark:shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:shadow-[0_0_15px_rgba(0,128,0,0.5)] dark:hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] relative group"
            >
              <div className="relative w-full pt-[66.67%] mb-4 overflow-hidden">
                <Image
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                  src={project.imageSrc}
                  alt={project.altText}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
              </div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-green-600 dark:text-green-500 group-hover:underline">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  {project.webPreviewLink && (
                    <a
                      href={project.webPreviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors duration-200 group/icon"
                      aria-label={`Visit ${project.title} website`}
                      title="Visit website"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-800 text-white dark:text-gray-100 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        Visit website
                      </span>
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors duration-200 group/icon"
                      aria-label={`View ${project.title} on GitHub`}
                      title="View on GitHub"
                    >
                      <SiGithub className="w-4 h-4" />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-800 text-white dark:text-gray-100 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        View on GitHub
                      </span>
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow mb-3">
                {project.shortDescription}
              </p>
              <div className="flex items-center justify-between gap-4">
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => {
                      const techIcons: Record<
                        string,
                        React.ComponentType<{ className?: string }>
                      > = {
                        "Next.js": SiNextdotjs,
                        Nextjs: SiNextdotjs,
                        Tailwind: SiTailwindcss,
                        TailwindCSS: SiTailwindcss,
                        TypeScript: SiTypescript,
                        Python: SiPython,
                        React: SiReact,
                        Telegram: SiTelegram,
                        Vercel: SiVercel,
                        Supabase: SiSupabase,
                        PostgreSQL: SiPostgresql,
                        OpenAI: SiOpenai,
                      };
                      const IconComponent = techIcons[tech];
                      if (!IconComponent) return null;
                      return (
                        <div
                          key={tech}
                          className="flex items-center justify-center w-6 h-6 rounded bg-neutral-800 dark:bg-neutral-700 border border-neutral-600 dark:border-neutral-600"
                          title={tech}
                        >
                          <IconComponent className="w-4 h-4 text-white dark:text-gray-100" />
                        </div>
                      );
                    })}
                  </div>
                )}
                <Link
                  href={`/projects/${project.slug}`}
                  className="flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 cursor-pointer"
                >
                  <span>View details</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
