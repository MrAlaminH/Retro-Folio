"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";
import { useFont } from "@/contexts/FontContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import MusicPlayer from "@/components/music-player";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Gallery", path: "/gallery" },
  { name: "Terminal", path: "/Terminal" },
];

export default function Navbar() {
  const email = "itsalamin999@gmail.com";
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { font, setFont } = useFont();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 3000);
    });
  };

  return (
    <div className="bg-transparent text-black dark:text-gray-100 flex flex-col">
      <header className="w-full py-4 px-4 sm:px-8 lg:px-16">
        <div className="flex justify-center items-center mb-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <Image
                src="/my-image.jpg"
                alt="Profile"
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 640px) 96px, 128px"
                priority
                quality={85}
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-500">
                It&apos;s Alamin Here
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 sm:pl-1">
                24 | Engineer | Builder
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-3">
                <div className="flex space-x-2">
                  <MusicPlayer />
                  <button
                    onClick={handleCopyEmail}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs font-bold py-1 px-2 rounded flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="ml-1">Copy Email</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-xs font-bold py-1 px-2 rounded flex items-center"
                    aria-label={
                      theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {theme === "dark" ? "☀️" : "🌗"}
                  </button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        // variant="outline"
                        size="sm"
                        className="h-8 border-dashed bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-xs font-bold py-1 px-2 rounded flex items-center"
                      >
                        <span className="mr-1">Aa</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 bg-gray-300 dark:bg-gray-700">
                      <div className="grid gap-4 ">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Select a font for the website.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => setFont("Kalam")}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                font === "Kalam" ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            Kalam
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => setFont("departureMono")}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                font === "departureMono"
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            Departure
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => setFont("inter")}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                font === "inter" ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            Inter
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav>
          <ul className="flex flex-wrap justify-center gap-2 text-green-500 text-sm md:text-base py-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`hover:underline ${
                    pathname === item.path ? "text-black dark:text-white" : ""
                  }`}
                >
                  {item.name}
                </Link>
                {index < navItems.length - 1 && <span className="ml-2">|</span>}
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {showCopyMessage && (
        <div className="fixed top-4 right-4">
          <Alert
            variant="default"
            className="text-green-700 dark:text-green-500"
          >
            Email copied to clipboard!
          </Alert>
        </div>
      )}
    </div>
  );
}
