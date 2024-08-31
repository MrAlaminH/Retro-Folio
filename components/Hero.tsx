"use client";
import React from "react";
import { usePathname } from "next/navigation";

const projects = [
  {
    name: "AI-Telegram-ChatBot",
    description: "AI Integrated Telegram ChatBot with Image Generation",
  },
  {
    name: "SolidART",
    description: "The Next Gen AI Image Generate Platform",
  },
];

const contacts = [
  {
    name: "Email",
    value: "itsalamin999@gmail.com",
    link: "mailto:itsalamin999@gmail.com",
  },
  {
    name: "LinkedIn",
    value: "AlaminH",
    link: "https://www.linkedin.com/in/AlaminH",
  },
  {
    name: "X/Twitter",
    value: "MrAlaminH",
    link: "https://www.twitter.com/MrAlaminH",
  },
];

export default function AIWebsite() {
  const pathname = usePathname();

  return (
    <div className="bg-black text-white min-h-screen p-4 flex justify-center text-sm">
      <div className="w-full max-w-3xl">
        <hr className="border-green-500 my-8" />

        <main>
          <section className="mb-8">
            <h2 className="text-lg md:text-xl mb-4 text-green-500">About Me</h2>
            <ul className="list-none text-xs md:text-sm space-y-2">
              <li>👨🏽‍💻 Learning AI/ML Development (prv: WebDev)</li>
              <li>🌱 Growing every day</li>
              <li>☕ Fun fact: I fuel myself with a LOT of coffee</li>
              <li>🧑 Pronouns: He/Him</li>
            </ul>
          </section>

          <hr className="border-green-500 my-8" />

          <section className="mb-8">
            <h2 className="text-lg md:text-xl mb-4 text-green-500">Projects</h2>
            <p className="mb-2">A random selection of stuff I made:</p>
            <ul className="list-none text-xs md:text-sm space-y-2">
              {projects.map((project, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-500">{">"}</span>
                  <span>
                    <span className="font-bold">{project.name}</span>:{" "}
                    {project.description}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-green-500 my-8" />

          <section>
            <h2 className="text-lg md:text-xl mb-4 text-green-500">
              Contact / Socials
            </h2>
            <ul className="list-none text-xs md:text-sm space-y-2">
              {contacts.map((contact, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-green-500">{">"}</span>
                  <a
                    href={contact.link}
                    className="hover:underline hover:text-white transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{contact.name}:</span>
                    <span className="ml-2 text-green-500">{contact.value}</span>
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
