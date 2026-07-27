import React from "react";
import DecodeText from "../../components/MatrixCursor/DecodeText";
import ContactForm from "@/components/contact-form";

const contacts = [
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

export default function Contact() {
  return (
    <section className="bg-transparent text-black dark:text-gray-100 min-h-screen p-4 flex justify-center text-sm">
      <div className="w-full max-w-3xl">
        <h2 className="text-lg md:text-xl font-extrabold mb-4 text-green-600 dark:text-green-500">
          <DecodeText text="Contact / Socials" />
        </h2>
        <ul className="list-none text-xs md:text-sm space-y-2">
          {contacts.map((contact, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2 text-green-600 dark:text-green-500">
                {">"}
              </span>
              <a
                href={contact.link}
                className="hover:underline hover:text-black dark:hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{contact.name}:</span>
                <span className="ml-2 text-green-600 dark:text-green-500">
                  {contact.value}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <h2 className="text-green-600 dark:text-green-500 text-center py-12 underline underline-offset-4">
          <DecodeText text="Send me a direct message" />
        </h2>

        <ContactForm />
      </div>
    </section>
  );
}
