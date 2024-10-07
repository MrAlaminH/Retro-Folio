import React from "react";
import { projectData } from "@/data/projectData";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import fs from "fs/promises";
import path from "path";
import { Globe, Code } from "lucide-react";
import NotFound from "@/app/not-found";

export async function generateStaticParams() {
  return projectData.map((project) => ({
    slug: project.slug,
  }));
}

async function getProjectContent(contentPath: string) {
  const filePath = path.join(process.cwd(), "public", contentPath);
  const content = await fs.readFile(filePath, "utf8");
  return content;
}

const ProjectPage = async ({ params }: { params: { slug: string } }) => {
  const project = projectData.find((p) => p.slug === params.slug);

  if (!project) {
    return <NotFound />; // Render the NotFound component if the project is not found
  }

  const content = await getProjectContent(project.contentPath);

  return (
    <div className="max-w-3xl mx-auto p-4 bg-transparent text-gray-100 font-mono md:text-sm text-xs mb-16">
      <h2 className="text-2xl font-bold mb-2 text-green-500">
        {project.title}
      </h2>
      <p className="text-gray-500 mb-4">
        {project.publicationDate} • Read time: {project.readTime}
      </p>
      <div className="prose prose-invert prose-gray max-w-none text-black dark:text-gray-100">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-2xl font-bold mb-4 text-green-500"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-lg font-bold mb-3 text-green-400"
                {...props}
              />
            ),
            p: ({ node, ...props }) => <p className="mb-4" {...props} />,
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 mb-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 mb-4" {...props} />
            ),
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            img: ({ src, alt }) => (
              <Image
                src={src || ""}
                alt={alt || ""}
                width={600}
                height={400}
                className="w-full h-auto my-4"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {/* Adding the Links section below */}
      <div className="mt-8 flex justify-between">
        <a
          href={project.webPreviewLink}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="h-5 w-5 mr-2" />
          Project Preview
        </a>
        <a
          href={project.githubLink}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Code className="h-5 w-5 mr-2" />
          See the Code
        </a>
      </div>
    </div>
  );
};

export default ProjectPage;
