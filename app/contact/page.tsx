"use client";
import React, { useState } from "react";
import DecodeText from "../../components/MatrixCursor/DecodeText";

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

export default function Contact() {
  const [email, setEmail] = useState(""); // New state for email
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replace 'your-access-key' with your actual Web3Forms access key
    const formData = new FormData();
    formData.append("access_key", "f287cf62-319c-4651-be84-ff27611ea0ec");
    formData.append("email", email); // Add the user's email
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("reply_to", "itsalamin999@gmail.com"); // Set 'reply_to' email field

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Set the success message
        setAlertMessage("Message sent successfully!");
        // Reset form fields
        setEmail(""); // Reset email field
        setSubject("");
        setMessage("");
      } else {
        setAlertMessage("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setAlertMessage("An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
      // Clear the success or error message after 3 seconds
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  return (
    <section className="bg-white dark:bg-black text-black dark:text-gray-100 min-h-screen p-4 flex justify-center text-sm transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <h2 className="text-lg md:text-xl mb-4 text-green-600 dark:text-green-500">
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
                className="hover:underline hover:text-black dark:hover:text-white "
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-green-600 dark:text-green-500 text-center py-12 underline underline-offset-4">
            <DecodeText text="Send me a direct message" />
          </h2>
          {alertMessage && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {alertMessage}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-1">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-transparent text-black dark:text-white border border-green-600 dark:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="block mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 bg-transparent text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 bg-transparent text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className={`bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}
