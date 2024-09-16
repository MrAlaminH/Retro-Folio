"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  Terminal,
  Zap,
  Power,
  Bot,
  Wifi,
  Shield,
  Server,
} from "lucide-react";

type HistoryItem = string | { id: string; text: string };

interface MatrixChar {
  char: string;
  x: number;
  y: number;
  speed: number;
}

const Component: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(true);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const [matrixMode, setMatrixMode] = useState<boolean>(false);
  const [hackerLevel, setHackerLevel] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    bootSequence();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    let animationId: number;
    if (matrixMode && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
        const fontSize = 10;
        const columns = canvasRef.current.width / fontSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
          drops[i] = 1;
        }

        const draw = () => {
          ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
          ctx.fillRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
          ctx.fillStyle = "#0F0";
          ctx.font = `${fontSize}px monospace`;

          for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (
              drops[i] * fontSize > canvasRef.current!.height &&
              Math.random() > 0.975
            ) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        };

        const animate = () => {
          draw();
          animationId = requestAnimationFrame(animate);
        };

        animate();
      }
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [matrixMode]);

  const bootSequence = () => {
    const bootMessages = [
      "Initializing HedaOS v3.1337...",
      "Establishing secure connection...",
      "HedaOS v3.1337 ready. Welcome, Agent.",
    ];

    let delay = 0;
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setHistory((prev) => [...prev, msg]);
        if (index === bootMessages.length - 1) {
          setIsBooting(false);
          setHistory((prev) => [...prev, 'Type "help" for available commands']);
        }
      }, delay);
      delay += Math.random() * 1000 + 500;
    });
  };

  const simulateHacking = () => {
    const hackingSteps = [
      "Bypassing firewall...",
      "Cracking encryption...",
      "Accessing mainframe...",
      "Downloading classified data...",
      "Covering tracks...",
      "Hack complete! Access granted.",
    ];

    let delay = 0;
    hackingSteps.forEach((step, index) => {
      setTimeout(() => {
        setHistory((prev) => [...prev, step]);
        if (index === hackingSteps.length - 1) {
          setAccessGranted(true);
          setHackerLevel((prev) => Math.min(prev + 1, 10));
        }
      }, delay);
      delay += Math.random() * 1000 + 500;
    });
  };

  const getAIResponse = async (query: string): Promise<string> => {
    setIsAIThinking(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData.error);
        setIsAIThinking(false);
        return `Error: ${errorData.error || "Unable to get AI response"}`;
      }
      const data = await response.json();
      setIsAIThinking(false);
      return data.result;
    } catch (error: any) {
      console.error("Network or unexpected error:", error.message);
      setIsAIThinking(false);
      return "Error: Unable to get AI response";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, `> ${input}`];
    setInput("");

    if (input.toLowerCase().startsWith("ask ")) {
      const query = input.slice(4);
      const tempMessageId = Date.now().toString();
      newHistory.push({ id: tempMessageId, text: "Querying AI..." });
      setHistory(newHistory);

      try {
        const aiResponse = await getAIResponse(query);
        setHistory((prev) =>
          prev
            .filter(
              (msg) => typeof msg === "string" || msg.id !== tempMessageId
            )
            .concat(aiResponse)
        );
      } catch (error) {
        console.error("Error getting AI response:", error);
        setHistory((prev) =>
          prev
            .filter(
              (msg) => typeof msg === "string" || msg.id !== tempMessageId
            )
            .concat("Error: Unable to get AI response")
        );
      }
    } else {
      switch (input.toLowerCase()) {
        case "help":
          newHistory.push(
            "Available commands: help, clear, hack, matrix, ask [your question], exit, upgrade, scan, encrypt"
          );
          break;
        case "clear":
          setHistory([]);
          return;
        case "hack":
          newHistory.push("Initiating hack sequence...");
          simulateHacking();
          break;
        case "matrix":
          newHistory.push("Activating Matrix mode...");
          setMatrixMode(true);
          setTimeout(() => setMatrixMode(false), 30000);
          break;
        case "exit":
          newHistory.push("System shutdown initiated...");
          setTimeout(() => {
            setHistory(["System rebooted. Welcome back, Agent."]);
            setAccessGranted(false);
          }, 2000);
          break;
        case "upgrade":
          newHistory.push(
            `Upgrading system... Hacker level: ${hackerLevel + 1}`
          );
          setHackerLevel((prev) => Math.min(prev + 1, 10));
          break;
        case "scan":
          newHistory.push("Scanning nearby networks...");
          setTimeout(() => {
            setHistory((prev) => [
              ...prev,
              "3 vulnerable networks detected. Type 'hack' to exploit.",
            ]);
          }, 2000);
          break;
        case "encrypt":
          newHistory.push("Encrypting all communications...");
          setTimeout(() => {
            setHistory((prev) => [
              ...prev,
              "All channels secured. You're now invisible.",
            ]);
          }, 1500);
          break;
        default:
          newHistory.push(`Command not recognized: ${input}`);
      }
      setHistory(newHistory);
    }
  };

  const togglePower = () => {
    setIsPoweredOn(!isPoweredOn);
    if (isPoweredOn) {
      setHistory([]);
      setIsBooting(true);
    } else {
      setTimeout(() => {
        setIsBooting(false);
        bootSequence();
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col p-4  text-black dark:text-gray-100 bg-white dark:bg-black transition-colors duration-300">
      <h2 className="text-center text-green-500 text-2xl mb-8">The Terminal</h2>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* PC Case Top */}
          <div className="bg-gray-800 p-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-green-400 text-sm ">HedaOS v3.1337</div>
            <button
              onClick={togglePower}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          {/* Monitor Screen */}
          <div
            className="flex-grow bg-black p-4 relative overflow-hidden"
            style={{ minHeight: "60vh" }}
          >
            {isPoweredOn ? (
              <>
                <div className="absolute inset-0 bg-green-500 opacity-5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900 opacity-5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-scan-lines pointer-events-none"></div>
                <div className="glitch-effect"></div>

                {accessGranted && (
                  <div className="absolute top-4 right-4 flex items-center bg-green-900 px-3 py-1 rounded animate-pulse">
                    <Shield className="w-4 h-4 mr-2 text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      Access Granted
                    </span>
                  </div>
                )}

                {isBooting ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Terminal className="w-16 h-16 mb-4 mx-auto animate-pulse text-green-500" />
                      <h1 className="text-2xl mb-4 text-green-500">
                        HedaOS v3.1337
                      </h1>
                      <div className="w-64 h-2 bg-green-900 rounded-full">
                        <div className="w-0 h-full bg-green-500 rounded-full animate-load"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    ref={outputRef}
                    className="h-full overflow-auto pb-8 terminal-output text-green-500 font-mono relative"
                  >
                    {matrixMode && (
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                        width={800}
                        height={600}
                      />
                    )}
                    {history.map((item, index) => (
                      <div key={index} className="mb-1 typewriter">
                        {typeof item === "string" ? item : item.text}
                      </div>
                    ))}
                    <form onSubmit={handleSubmit} className="flex items-center">
                      {isAIThinking ? (
                        <Bot className="w-4 h-4 mr-2 text-yellow-500 animate-pulse" />
                      ) : (
                        <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                      )}
                      <span className="mr-2 text-green-500">{">"}</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent focus:outline-none caret-green-500 text-green-500"
                        autoFocus
                        disabled={isAIThinking}
                      />
                    </form>
                  </div>
                )}

                {/* Blinking cursor */}
                <div className="absolute bottom-6 left-[3.5ch] w-2 h-4 bg-green-500 animate-blink"></div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-600 text-2xl font-mono">
                  System Offline
                </span>
              </div>
            )}
          </div>

          {/* PC Case Bottom */}
          <div className="bg-gray-800 p-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400 hidden md:inline" />
              <span className="text-yellow-400 text-sm hidden md:inline">
                Power
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm">Server</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 text-sm">AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
