"use client";
import React, { useState } from "react";
import DecodeText from "./MatrixCursor/DecodeText";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { projectData } from "@/data/projectData";

// Utility function to convert publicationDate to short format (e.g., "July 03, 2024" -> "Jul 2024")
function formatDateShort(publicationDate: string): string {
  const monthMap: { [key: string]: string } = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };

  // Try to parse using Date constructor first
  const date = new Date(publicationDate);
  if (!isNaN(date.getTime())) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  // Fallback: try to parse common formats manually (e.g., "July 03, 2024" or "Feb 1, 2025")
  const match = publicationDate.match(/(\w+)\s+\d+,\s+(\d{4})/);
  if (match) {
    const fullMonth = match[1];
    const year = match[2];
    const shortMonth = monthMap[fullMonth] || fullMonth.substring(0, 3);
    return `${shortMonth} ${year}`;
  }

  return publicationDate; // Return original if parsing fails
}

// Utility function to match a project URL with projectData entry and get the date
function getProjectDate(url: string): string | null {
  // Extract slug from URL (e.g., "/projects/machine-man" -> "machine-man")
  const slugMatch = url.match(/\/projects\/(.+)/);
  if (!slugMatch) return null;

  const slug = slugMatch[1];
  const project = projectData.find((p) => p.slug === slug);

  if (project && project.publicationDate) {
    return formatDateShort(project.publicationDate);
  }

  return null;
}

const projectsBase = [
  {
    name: "Machine Man",
    description: "AI-powered Telegram Bot for text and image generation.",
    url: "/projects/machine-man",
  },
  {
    name: "SolidArt",
    description: "The Next Gen AI Image Generation Platform ",
    url: "/projects/solidart",
  },
  {
    name: "Fusion Calling App",
    description:
      "AI Call Agent Platform that helps businesses automate outbound calls.",
    url: "/projects/AI-Phone-Call-Agent",
  },
  {
    name: "TweetScraper",
    description:
      "TweetScraper empowers users to gather tweet data related to specific hashtags. ",
    url: "/projects/TweetScraper",
  },
  // Add more projects as needed
];

// Add dates to projects by matching with projectData
const projects = projectsBase.map((project) => ({
  ...project,
  date: getProjectDate(project.url) || "",
}));

const contacts = [
  {
    name: "Email",
    value: "itsalamin999@gmail.com",
    link: "mailto:itsalamin999@gmail.com",
  },
  {
    name: "LinkedIn",
    value: "itsalamin",
    link: "https://www.linkedin.com/in/itsalamin",
  },
  {
    name: "Github",
    value: "MrAlaminH",
    link: "https://www.github.com/MrAlaminH",
  },
  {
    name: "X/Twitter",
    value: "MrAlaminH",
    link: "https://www.twitter.com/MrAlaminH",
  },
];

export default function Portfolio() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(
    null
  );

  const router = useRouter();
  const handleMoreProjects = () => {
    router.push("/projects");
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const paragraphText = `<span class="text-green-500 dark:text-green-500">Hey there!</span> I'm Alamin Hossain, which in Arabic means "the trusted one"—and I've been on quite a journey! I first got into crypto back in 2017, which led me to work as a community manager for Web3 projects. It was an amazing experience—getting to know the ins and outs of blockchain technology while connecting with people from all over the world.

    <span class="text-green-500 dark:text-green-500"> While doing that,</span> I was also neck-deep in my computer science studies. As much as I enjoyed community management, my heart was set on becoming a developer. After gaining some great experience, I decided to transition into web development, where I'm now focused on creating innovative, user-friendly web experiences and bringing exciting ideas to life through code.

    When I'm not behind my computer screen, you'll probably find me trekking, travelling, farming, or learning something new that excites me.
  `;

  return (
    <div className="bg-transparent text-black dark:text-gray-100 min-h-screen p-4 flex justify-center text-sm ">
      <div className="w-full max-w-3xl">
        <hr className="border-green-700 dark:border-green-500 my-4" />

        <main>
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500">
              <DecodeText text="About Me" />
            </h2>
            <ul className="list-none text-xs md:text-sm space-y-2">
              <li>
                👨🏽‍💻 Learning AI/ML Development{" "}
                <span className="text-green-500">(prv: WebDev)</span>{" "}
              </li>

              <li>
                ☕ Fun fact: I fuel myself with a LOT of{" "}
                <span className="text-green-500">caffeine</span>{" "}
              </li>
              <li>
                🧑 Pronouns: <span className="text-green-500">He/Him</span>{" "}
              </li>
              <li>
                🗿 Personality Type:{" "}
                <span className="text-green-500">INTP-A</span>
              </li>
            </ul>
            <p className="mt-4 whitespace-pre-wrap text-black dark:text-gray-100 ">
              <span className="mr-2 text-green-500 dark:text-green-500">
                {">"}
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? paragraphText
                    : `${paragraphText.substring(0, 240)}...`,
                }}
              />
            </p>
            <button
              onClick={handleToggle}
              className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline "
            >
              {isExpanded ? "Learn less >" : "Learn more>"}
            </button>
          </section>

          <hr className="border-green-700 dark:border-green-500 my-8" />

          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500">
              <DecodeText text="Projects" />
            </h2>
            <p className="mb-2">A selection of stuff I made:</p>
            <ul className="list-none text-xs md:text-sm space-y-2">
              {projects.map((project, index) => (
                <li
                  key={index}
                  className="group p-2 rounded-md ease-in-out cursor-pointer"
                  onMouseEnter={() => setHoveredProjectIndex(index)}
                  onMouseLeave={() => setHoveredProjectIndex(null)}
                >
                  {/* Mobile: Stacked Layout */}
                  <div className="flex flex-col md:hidden">
                    {project.date && (
                      <span className="text-black dark:text-gray-300 opacity-50 dark:opacity-40 text-xs mb-0.5">
                        {project.date}
                      </span>
                    )}
                    <div className="flex items-center">
                      <span
                        className={`mr-2 text-green-500 dark:text-green-500 transition-transform duration-300 ${
                          hoveredProjectIndex === index
                            ? "transform rotate-90"
                            : ""
                        }`}
                      >
                        {">"}
                      </span>
                      <a
                        href={project.url}
                        className="text-green-500 dark:text-green-400 ease-in-out"
                      >
                        <span className="font-semibold text-green-500 dark:text-green-500 underline">
                          {project.name}
                        </span>
                      </a>
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
                      <span
                        className={`mr-2 text-green-500 dark:text-green-500 transition-transform duration-300 ${
                          hoveredProjectIndex === index
                            ? "transform rotate-90"
                            : ""
                        }`}
                      >
                        {">"}
                      </span>
                      <a
                        href={project.url}
                        className="text-green-500 dark:text-green-400 ease-in-out"
                      >
                        <span className="font-semibold text-green-500 dark:text-green-500 underline">
                          {project.name}
                        </span>
                      </a>
                      <ExternalLink
                        className={`ml-2 text-gray-400 transition-opacity duration-300 ${
                          hoveredProjectIndex === index
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        size={16}
                      />
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
              <button
                className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline"
                onClick={handleMoreProjects}
              >
                Check More Projects &gt;
              </button>
            </div>
          </section>

          <hr className="border-green-700 dark:border-green-500 my-8" />

          <section>
            <h2 className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500">
              <DecodeText text="Contact / Socials" />
            </h2>
            <ul className="list-none text-xs md:text-sm space-y-2">
              {contacts.map((contact, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-green-500 dark:text-green-500">
                    {">"}
                  </span>
                  <a
                    href={contact.link}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{contact.name}:</span>
                    <span className="ml-2 text-green-500 dark:text-green-500">
                      {contact.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
