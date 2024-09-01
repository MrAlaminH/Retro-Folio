import React from "react";

// Array of project data to dynamically generate project cards
const projectData = [
  {
    id: 1,
    title: "Machine Man",
    description:
      "AI-powered Telegram Bot including text and image generation using different models.",
    imageSrc: "/project2.png",
    altText: "Coding With Cursor AI",
  },
  {
    id: 2,
    title: "SolidArt",
    description:
      "The Next Gen AI Image Generation Platform built using TailwindCSS, Next.js, and open-source image generation models.",
    imageSrc: "/project1.png",
    altText: "How to Build an AI Web App with Claude 3.5 and Cursor",
  },
];

const Projects = () => {
  return (
    <section className="flex justify-center min-h-screen p-4 bg-black text-green-500 text-sm">
      <div className="w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-bold">Recent Projects</h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {projectData.map((project) => (
            <div key={project.id} className="border-2 border-green-500 p-4">
              <img
                className="w-full h-48 mb-4 transition-transform duration-200 ease-in-out hover:scale-105"
                src={project.imageSrc}
                alt={project.altText}
              />
              <h3 className="mb-2 text-lg font-bold text-green-500">
                {project.title}
              </h3>
              <p className="text-sm text-gray-100">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
