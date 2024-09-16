import React from "react";
import Link from "next/link";
import Image from "next/image";
import { projectData } from "@/data/projectData";
import DecodeText from "../../components/MatrixCursor/DecodeText";

const Projects = () => {
  return (
    <section className="flex justify-center min-h-screen p-4 bg-white dark:bg-black text-black dark:text-gray-100 text-sm transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <h2 className="mb-8 text-lg md:text-xl font-bold text-green-600 dark:text-green-500">
          <DecodeText text="Recent Projects" />
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {projectData.map((project) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project.id}
              className="block h-full group"
            >
              <div className="border-2 border-green-600 dark:border-green-500 p-4 cursor-pointer transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-900 hover:bg-opacity-20 h-full flex flex-col shadow-[0_0_10px_rgba(0,128,0,0.3)] dark:shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:shadow-[0_0_15px_rgba(0,128,0,0.5)] dark:hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] relative">
                <div className="relative w-full pt-[66.67%] mb-4 overflow-hidden">
                  <Image
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                    src={project.imageSrc}
                    alt={project.altText}
                    layout="fill"
                  />
                </div>
                <h3 className="mb-2 text-lg font-bold text-green-600 dark:text-green-500 group-hover:underline">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow">
                  {project.shortDescription}
                </p>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
                  <span>Read more</span>
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
