"use client";
import React, { useState } from "react";
import DecodeText from "./MatrixCursor/DecodeText";
import { ChevronRight, ExternalLink } from "lucide-react";

const projects = [
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
  // Add more projects as needed
];

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

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const paragraphText = `<span class="text-green-500 dark:text-green-500">Hey there!</span> I'm Alamin Hossain, which in Arabic means "the trusted one"—and I've been on quite a journey! I first got into crypto back in 2017, which led me to work as a community manager for Web3 projects. It was an amazing experience—getting to know the ins and outs of blockchain technology while connecting with people from all over the world.

    <span class="text-green-500 dark:text-green-500"> While doing that,</span> I was also neck-deep in my computer science studies. As much as I enjoyed community management, my heart was set on becoming a developer. After gaining some great experience, I decided to transition into web development, where I'm now focused on creating innovative, user-friendly web experiences and bringing exciting ideas to life through code.

    When I'm not behind my computer screen, you'll probably find me trekking, travelling, farming, or learning something new that excites me.
  `;

  return (
    <div className="bg-white dark:bg-black text-black dark:text-gray-100 min-h-screen p-4 flex justify-center text-sm transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <hr className="border-green-700 dark:border-green-500 my-4" />

        <main>
          <section className="mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500">
              <DecodeText text="About Me" />
            </h2>
            <ul className="list-none text-xs md:text-sm space-y-2">
              <li>👨🏽‍💻 Learning AI/ML Development (prv: WebDev)</li>
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
            <p className="mt-4 whitespace-pre-wrap text-black dark:text-gray-100 transition-colors duration-300">
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
              className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline transition-colors duration-300"
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
                  className="group flex items-start p-2 rounded-md transition-all duration-300 ease-in-out cursor-pointer"
                  onMouseEnter={() => setHoveredProjectIndex(index)}
                  onMouseLeave={() => setHoveredProjectIndex(null)}
                >
                  <span
                    className={`mr-2 text-green-500 dark:text-green-500 transition-transform duration-300 ${
                      hoveredProjectIndex === index ? "transform rotate-90" : ""
                    }`}
                  >
                    {">"}
                  </span>
                  <a
                    href={project.url}
                    className="flex-grow hover:underline text-green-500 dark:text-green-400 transition-all duration-300 ease-in-out"
                  >
                    <span className="font-semibold text-green-500 dark:text-green-500">
                      {project.name}
                    </span>
                    :{" "}
                    <span className="text-black dark:text-white transition-colors duration-300">
                      {project.description}
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
                </li>
              ))}
            </ul>
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
