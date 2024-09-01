"use client";
import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
  { name: "Random-Shit", path: "/RandomShit" },
];

export default function Navbar() {
  const [image, setImage] = useState("/my-image.jpg?height=48&width=48");
  const email = "itsalamin999@gmail.com";
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const pathname = usePathname();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 3000);
    });
  };

  return (
    <div className="bg-black text-gray-100 flex flex-col">
      <header className="w-full bg-black py-4 px-4 sm:px-8 lg:px-16">
        <div className="flex justify-center items-center mb-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <img
                src={image}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-500">
                Yoo, It&apos;s Alamin Here
              </h1>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4"
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
                  <p className="text-gray-400">{email}</p>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="bg-gray-700 hover:bg-gray-600 text-xs font-bold py-1 px-2 rounded flex items-center"
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
                      d="M8 16h8M8 12h8m-8 4h8m2-10H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2z"
                    />
                  </svg>
                  <span className="ml-1">Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <nav>
          <ul className="flex flex-wrap justify-center gap-2 text-green-500 text-xs md:text-sm">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`hover:underline ${
                    pathname === item.path ? "text-white" : ""
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

      <main className="flex-grow p-4">{/* Your main content goes here */}</main>

      {showCopyMessage && (
        <div className="fixed top-4 right-4">
          <Alert variant="default" className="text-green-500">
            Email copied to clipboard!
          </Alert>
        </div>
      )}
    </div>
  );
}
