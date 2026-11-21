"use client";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// One submit machine instead of parallel isSubmitting/alert flags — the
// outcome drives the alert's color too (failures must not look successful).
type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [alertMessage, setAlertMessage] = useState("");
  // Visibility is separate from content: the message stays mounted while the
  // disclosure collapses, so the exit animation actually renders.
  const [alertVisible, setAlertVisible] = useState(false);
  // Reset per submit, so a rapid second submit isn't hidden early by the
  // first submit's timer.
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const showAlert = (msg: string, kind: "success" | "error") => {
    setStatus(kind);
    setAlertMessage(msg);
    setAlertVisible(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

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
        showAlert("Message sent successfully!", "success");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        showAlert("Failed to send message. Please try again later.", "error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showAlert("An error occurred while sending your message.", "error");
    } finally {
      clearTimeout(alertTimerRef.current);
      alertTimerRef.current = setTimeout(() => setAlertVisible(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Alert expands/collapses smoothly instead of teleporting and
          shoving the form down (disclosure = grid-rows trick) */}
      <div
        className={cn(
          "disclosure",
          alertVisible
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 invisible"
        )}
        role="status"
        aria-live="polite"
      >
        <div className="disclosure-inner">
          {alertMessage && (
            <div
              className={cn(
                "p-2 rounded mb-4 text-white",
                status === "error" ? "bg-red-500" : "bg-green-500"
              )}
            >
              {alertMessage}
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
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
      <div className="mb-4">
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
      <div className="mb-4">
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
        className={`bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-[background-color,color,opacity,transform] duration-150 active:scale-97 ${
          status === "submitting" ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
