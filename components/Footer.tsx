import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-transparent text-black dark:text-gray-100 p-4 flex justify-center sm:text-sm">
      <div className="flex justify-between items-center w-full max-w-3xl">
        <div className="text-xs md:text-sm mb-4">
          © 2024
          <span className="text-green-700 dark:text-green-500">
            {" "}
            MrAlaminH.{" "}
          </span>
          All rights reserved.🚀
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/MrAlaminH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com/MrAlaminH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/itsalamin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
