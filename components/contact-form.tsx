"use client";
import React, { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("access_key", "f287cf62-319c-4651-be84-ff27611ea0ec");
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("reply_to", "itsalamin999@gmail.com");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setAlertMessage("Message sent successfully!");
        setEmail("");
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
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full p-2 bg-transparent text-black dark:text-white border border-green-600 dark:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500"
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
          className="w-full p-2 bg-transparent text-black dark:text-white border border-green-600 dark:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 h-32"
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
  );
}
