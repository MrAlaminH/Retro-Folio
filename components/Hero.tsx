// "use client";
// import React from "react";
// import { usePathname } from "next/navigation";

// const projects = [
//   {
//     name: "AI-Telegram-ChatBot",
//     description: "AI Integrated Telegram ChatBot with Image Generation",
//   },
//   {
//     name: "SolidART",
//     description: "The Next Gen AI Image Generate Platform",
//   },
// ];

// const contacts = [
//   {
//     name: "Email",
//     value: "itsalamin999@gmail.com",
//     link: "mailto:itsalamin999@gmail.com",
//   },
//   {
//     name: "LinkedIn",
//     value: "AlaminH",
//     link: "https://www.linkedin.com/in/AlaminH",
//   },
//   {
//     name: "X/Twitter",
//     value: "MrAlaminH",
//     link: "https://www.twitter.com/MrAlaminH",
//   },
// ];

// export default function AIWebsite() {
//   const pathname = usePathname();

//   return (
//     <div className="bg-black text-white min-h-screen p-4 flex justify-center text-sm">
//       <div className="w-full max-w-3xl">
//         <hr className="border-green-500 my-8" />

//         <main>
//           <section className="mb-8">
//             <h2 className="text-lg md:text-xl mb-4 text-green-500">About Me</h2>
//             <ul className="list-none text-xs md:text-sm space-y-2">
//               <li>👨🏽‍💻 Learning AI/ML Development (prv: WebDev)</li>
//               <li>🌱 Growing every day</li>
//               <li>☕ Fun fact: I fuel myself with a LOT of coffee</li>
//               <li>🧑 Pronouns: He/Him</li>
//             </ul>
//           </section>

//           <hr className="border-green-500 my-8" />

//           <section className="mb-8">
//             <h2 className="text-lg md:text-xl mb-4 text-green-500">Projects</h2>
//             <p className="mb-2">A random selection of stuff I made:</p>
//             <ul className="list-none text-xs md:text-sm space-y-2">
//               {projects.map((project, index) => (
//                 <li key={index} className="flex items-start">
//                   <span className="mr-2 text-green-500">{">"}</span>
//                   <span>
//                     <span className="font-bold">{project.name}</span>:{" "}
//                     {project.description}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </section>

//           <hr className="border-green-500 my-8" />

//           <section>
//             <h2 className="text-lg md:text-xl mb-4 text-green-500">
//               Contact / Socials
//             </h2>
//             <ul className="list-none text-xs md:text-sm space-y-2">
//               {contacts.map((contact, index) => (
//                 <li key={index} className="flex items-center">
//                   <span className="mr-2 text-green-500">{">"}</span>
//                   <a
//                     href={contact.link}
//                     className="hover:underline hover:text-white transition-colors duration-300"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <span>{contact.name}:</span>
//                     <span className="ml-2 text-green-500">{contact.value}</span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
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

export default function AIWebsite() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const paragraphText = `Hey there! I’m Alamin Hossain, which in Arabic means “the trusted one”—and I’ve been on quite a journey! I first got into crypto back in 2017, which led me to work as a community manager for Web3 projects. It was an amazing experience—getting to know the ins and outs of blockchain technology while connecting with people from all over the world.

    While doing that, I was also neck-deep in my computer science studies. As much as I enjoyed community management, my heart was set on becoming a developer. After gaining some great experience, I decided to transition into web development, where I’m now focused on creating innovative, user-friendly web experiences and bringing exciting ideas to life through code.

    When I’m not behind my computer screen, you’ll probably find me trekking, travelling, farming, or learning something new that excites me.
  `;

  return (
    <div className="bg-black text-gray-100 min-h-screen p-4 flex justify-center text-sm">
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
            <p className="mt-4 whitespace-pre-wrap text-gray-300">
              <span className="mr-2 text-green-500">{">"}</span>
              {isExpanded
                ? paragraphText
                : `${paragraphText.substring(0, 240)}...`}
            </p>
            <button
              onClick={handleToggle}
              className="text-green-400 mt-2 focus:outline-none hover:text-green-500 hover:underline "
            >
              {isExpanded ? "Learn less" : "Learn more"}
            </button>
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
