import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-transparent text-black dark:text-gray-100 p-4">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <hr className="border-green-700 dark:border-green-500 my-8" />
          <div className="flex justify-between items-center">
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
                aria-label="Visit GitHub profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com/MrAlaminH"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500"
                aria-label="Visit Twitter profile"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/itsalamin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500"
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
