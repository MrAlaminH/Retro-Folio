import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white p-4 flex justify-center sm:text-sm">
      <div className="flex justify-between items-center w-full max-w-3xl">
        <div className="text-xs md:text-sm">
          © 2024
          <span className="text-green-500"> MrAlaminH. </span>
          All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/MrAlaminH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            <Github color="green" size={20} />
          </a>
          <a
            href="https://twitter.com/MrAlaminH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            <Twitter color="green" size={20} />
          </a>
          <a
            href="https://linkedin.com/in/MrAlaminH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            <Linkedin color="green" size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
