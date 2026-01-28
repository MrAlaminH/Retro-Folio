"use client";
import React, { useState } from "react";
import Link from "next/link";
import DecodeText from "../MatrixCursor/DecodeText";
import { FaExternalLinkAlt } from "react-icons/fa";

interface AboutMeProps {}

export default function AboutMe({}: AboutMeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const paragraphTextParts = [
    `<span class="text-green-500 dark:text-green-500">Hey there!</span> I'm Alamin, and like my name (which means "the trusted one" in Arabic), I believe in building reliability into everything I create. I started my journey in tech with crypto back in 2017, which quickly led me to work as a community manager for Web3 projects. It was an amazing experience—getting to know the ins and outs of blockchain technology while connecting with people from all over the world. I believe in transparent communication and continuous learning, values I carried over from my time in Web3 communities.`,
    `<span class="text-green-500 dark:text-green-500"> While doing that,</span> I was also neck-deep in my computer studies. As much as I enjoyed community management, I realized my greatest satisfaction came from building things. After gaining some great experience, I decided to transition into web development, where I'm now focused on creating user-friendly web experiences using modern frameworks like Next.js, Tailwind CSS, and TypeScript, and bringing exciting ideas to life through code. Ultimately, I aim to merge my passion for community with my coding skills to contribute to impactful open-source projects.`,
    `<span class="text-green-500 dark:text-green-500"> When I'm </span> not behind my computer screen, you'll probably find me sleeping, trekking, gardening, taking photos of `,
    ` or learning something new that excites me. I love striking a balance between the natural and digital worlds.`,
  ];

  return (
    <section className="mb-8">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500">
        <DecodeText text="About Me" />
      </h2>
      <ul className="list-none text-xs md:text-sm space-y-2">
        <li>
          👨🏽‍💻 Learning AI Automation & Development{" "}
          <span className="text-green-500">(prv: WebDev)</span>{" "}
        </li>

        <li>
          ☕ Fun fact: I fuel myself with a LOT of{" "}
          <span className="text-green-500">caffeine</span>{" "}
        </li>
        <li>
          🗿 Personality Type: <span className="text-green-500">INTP-A</span>
        </li>
        <li>
          🧑 Pronouns: <span className="text-green-500">He/Him</span>{" "}
        </li>
      </ul>
      <p className="mt-4 whitespace-pre-wrap text-black dark:text-gray-100 ">
        <span className="mr-2 text-green-500 dark:text-green-500">{">"}</span>
        {isExpanded ? (
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: paragraphTextParts[0],
              }}
            />
            <br />
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: paragraphTextParts[1],
              }}
            />
            <br />
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: paragraphTextParts[2],
              }}
            />
            <Link
              href="/gallery?category=nature"
              className="text-green-500 dark:text-green-500 underline group relative inline hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              nature
              <FaExternalLinkAlt className="w-3 h-3 ml-1 inline" />
            </Link>
            <span
              dangerouslySetInnerHTML={{
                __html: paragraphTextParts[3],
              }}
            />
          </>
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: `${paragraphTextParts[0].substring(0, 240)}...`,
            }}
          />
        )}
      </p>
      <button
        onClick={handleToggle}
        className="text-green-500 dark:text-green-400 mt-2 focus:outline-none hover:text-green-800 dark:hover:text-green-500 hover:underline "
      >
        {isExpanded ? "Learn less >" : "Learn more>"}
      </button>
    </section>
  );
}
