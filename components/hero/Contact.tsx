"use client";
import React from "react";
import DecodeText from "../MatrixCursor/DecodeText";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Image from "next/image";
import RetroButton from "../retro-button";

const contacts = [
  {
    name: "LinkedIn",
    value: "itsalamin",
    link: "https://www.linkedin.com/in/itsalamin",
    icon: FaLinkedin,
  },
  {
    name: "Github",
    value: "MrAlaminH",
    link: "https://www.github.com/MrAlaminH",
    icon: FaGithub,
  },
  {
    name: "X/Twitter",
    value: "MrAlaminH",
    link: "https://www.twitter.com/MrAlaminH",
    icon: FaTwitter,
  },
  {
    name: "Discord",
    value: "alaminhosainn",
    link: "https://discord.com/users/440574272856129547",
    icon: FaDiscord,
  },
];

export default function Contact() {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold mb-4 text-green-500 dark:text-green-500">
        <DecodeText text="Contact / Socials" />
      </h2>
      <ul className="list-none text-xs md:text-sm space-y-2">
        {contacts.map((contact, index) => {
          const IconComponent = contact.icon;
          return (
            <li key={index} className="flex items-center">
              <span className="mr-2 text-green-500 dark:text-green-500">
                {">"}
              </span>
              <a
                href={contact.link}
                className="flex items-center gap-2 hover:underline group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {IconComponent && (
                  <IconComponent className="w-4 h-4 text-green-500 dark:text-green-500 flex-shrink-0" />
                )}
                <span>{contact.name}:</span>
                <span className="text-green-500 dark:text-green-500">
                  {contact.value}
                </span>
                <FaExternalLinkAlt className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 opacity-60 group-hover/link:opacity-100 transition-opacity duration-200" />
              </a>
            </li>
          );
        })}
      </ul>

      {/* Book a Free Call Section */}
      <div className="mt-6 mb-6">
        <p className="text-sm italic mb-3 text-center text-green-500 dark:text-green-500">
          Let&apos;s figure out if we&apos;re a good match.
        </p>
        <div className="flex justify-center">
          <RetroButton
            href="https://cal.com/mralamin/discovery-call"
            text="Book a Free Call"
            external
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Image
            src="/footer.png"
            alt="Human evolution pixel art"
            width={800}
            height={200}
            className="w-full h-auto object-contain opacity-90 dark:opacity-80 hover:opacity-100 dark:hover:opacity-90 transition-opacity duration-300"
            loading="lazy"
            quality={85}
          />
        </div>
      </div>
    </section>
  );
}
