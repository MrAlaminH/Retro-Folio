"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { BotMessageSquare } from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContext";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface QuickMessage {
  id: string;
  text: string;
}

const WEBHOOK_URL =
  "https://n8n.deployify.xyz/webhook/4dcdb776-e47d-4d1a-8739-4f02c73b2c91/chat";

const ChatWidget = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("ChatWidget must be used within a ThemeProvider");
  }
  const { theme } = themeContext;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi there! 👋" },
    { sender: "bot", text: "How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState("");

  // Predefined quick messages
  const quickMessages: QuickMessage[] = [
    { id: "get-started", text: "I'd like to get started" },
    { id: "learn-more", text: "Tell me more about MrAlaminH" },
  ];

  // Generate a session ID on component mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(
        `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      );
    }
  }, [sessionId]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Format bot messages to be more readable
  const formatBotMessage = (text: string): string => {
    if (/\d+\.\s+/.test(text)) {
      return text;
    }

    let formattedText = text.split(/\n\n|\n/).join("\n\n");

    if (text.includes(", ") && !text.includes("\n") && text.length > 100) {
      const parts = text.split(": ");
      if (parts.length > 1) {
        const intro = parts[0] + ":";
        const items = parts[1].split(", ").map((item) => "• " + item.trim());
        formattedText = `${intro}\n\n${items.join("\n")}`;
      }
    }

    return formattedText;
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMsg = { sender: "user" as const, text: messageText };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const url = `${WEBHOOK_URL}?action=sendMessage`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: messageText,
          sessionId: sessionId,
        }),
      });

      const data = await res.json();
      console.log("Response from n8n:", data);

      let reply = "";

      if (Array.isArray(data) && data.length > 0) {
        if (data[0]?.output) {
          reply = data[0].output;
        }
      } else if (typeof data === "object") {
        if (data.response) {
          reply = data.response;
        } else if (data.reply) {
          reply = data.reply;
        } else if (data.output) {
          reply = data.output;
        }
      }

      reply = reply.trim();

      const formattedReply = formatBotMessage(reply);

      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: formattedReply || "Sorry, I didn't get that." },
      ]);
    } catch (e) {
      console.error("Error sending message:", e);
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMessage = (message: QuickMessage) => {
    sendMessage(message.text);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {!open && (
        <button
          className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
            theme === "dark"
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <BotMessageSquare
            size={32}
            color={theme === "dark" ? "white" : "black"}
          />
        </button>
      )}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-96 max-w-full h-[600px] rounded-2xl shadow-2xl flex flex-col border-2 animate-fade-in ${
            theme === "dark"
              ? "bg-black border-green-400"
              : "bg-white border-gray-300"
          }`}
        >
          <div
            className={`flex items-center justify-between px-5 py-4 rounded-t-2xl border-b-2 ${
              theme === "dark"
                ? "bg-gradient-to-r from-green-500 to-green-400 border-green-300"
                : "bg-gradient-to-r from-gray-200 to-gray-100 border-gray-300"
            }`}
          >
            <div>
              <div
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Alamin Here
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-green-100" : "text-gray-500"
                }`}
              >
                How can I help you?
              </div>
            </div>
            <button
              className={`text-2xl font-bold ml-2 ${
                theme === "dark"
                  ? "text-white hover:text-green-200"
                  : "text-black hover:text-gray-600"
              }`}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div
            className={`flex-1 overflow-y-auto px-4 py-3 ${
              theme === "dark" ? "bg-black" : "bg-white"
            }`}
            style={{ scrollbarWidth: "thin" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow ${
                    msg.sender === "user"
                      ? theme === "dark"
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-gray-300 text-black rounded-br-none"
                      : theme === "dark"
                      ? "bg-black text-green-400 border border-green-200 rounded-bl-none"
                      : "bg-gray-100 text-gray-700 border border-gray-300 rounded-bl-none"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="whitespace-pre-line">{msg.text}</div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-2">
                <div
                  className={`px-4 py-2 rounded-xl rounded-bl-none text-sm shadow flex items-center gap-2 ${
                    theme === "dark"
                      ? "bg-black border border-green-200 text-green-400"
                      : "bg-gray-100 border border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="animate-bounce">...</span>
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    Typing
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {messages.length <= 2 && (
            <div
              className={`p-3 border-t flex flex-wrap gap-2 ${
                theme === "dark"
                  ? "bg-black border-green-100"
                  : "bg-white border-gray-300"
              }`}
            >
              {quickMessages.map((qm) => (
                <button
                  key={qm.id}
                  className={`text-sm rounded-full px-3 py-1.5 border transition flex-grow ${
                    theme === "dark"
                      ? "bg-black hover:bg-green-100 text-green-400 border-green-200"
                      : "bg-white hover:bg-gray-200 text-gray-700 border-gray-300"
                  }`}
                  onClick={() => handleQuickMessage(qm)}
                >
                  {qm.text}
                </button>
              ))}
            </div>
          )}
          <div
            className={`p-4 border-t flex items-center gap-2 ${
              theme === "dark"
                ? "bg-black border-green-200"
                : "bg-white border-gray-300"
            }`}
          >
            <input
              className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
                theme === "dark"
                  ? "border-green-300 bg-black text-green-400 focus:ring-green-400"
                  : "border-gray-300 bg-white text-gray-700 focus:ring-gray-400"
              }`}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
            />
            <button
              className={`rounded-lg px-4 py-2 font-semibold transition disabled:opacity-50 ${
                theme === "dark"
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
          <div
            className={`text-center text-xs py-2 rounded-b-2xl border-t ${
              theme === "dark"
                ? "bg-black text-green-400 border-green-100"
                : "bg-white text-gray-500 border-gray-300"
            }`}
          >
            Powered by MrAlaminH 🚀
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
