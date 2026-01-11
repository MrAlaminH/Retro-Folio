import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import { FooterClock } from "./footer-clock";
import { FooterVisitorCounter } from "./footer-visitor-counter";

const Footer = () => {
  return (
    <footer className="bg-transparent text-black dark:text-gray-100 p-4">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <hr className="border-green-700 dark:border-green-500 my-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs md:text-sm">
            {/* Left side: Clock, Visitor Counter, and Copyright */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <FooterClock />
              <span className="text-neutral-400 dark:text-neutral-600">|</span>
              <FooterVisitorCounter />
              <span className="hidden sm:inline text-center">
                © 2026
                <span className="text-green-700 dark:text-green-500">
                  {" "}
                  MrAlaminH.{" "}
                </span>
                All rights reserved.🚀
              </span>
            </div>
            <div className="sm:hidden text-center">
              © 2026
              <span className="text-green-700 dark:text-green-500">
                {" "}
                MrAlaminH.{" "}
              </span>
              All rights reserved.🚀
            </div>

            {/* Right side: Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://github.com/MrAlaminH"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500 transition-colors duration-200"
                aria-label="Visit GitHub profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com/MrAlaminH"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500 transition-colors duration-200"
                aria-label="Visit Twitter profile"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/itsalamin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hover:text-green-700 dark:hover:text-green-500 transition-colors duration-200"
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
