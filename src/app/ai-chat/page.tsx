"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your CareerAI assistant. How can I help you navigate your career today?" }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    setError(null);
    const prompt = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: "chat", prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to fetch career advice.");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setMessages((prev) => [...prev, { role: "assistant", text: "I couldn't complete that request. Please try again." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] max-w-4xl mx-auto w-full p-4">
      <div className="flex-1 overflow-y-auto space-y-6 p-4">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex gap-4 ${msg.role === "assistant" ? "items-start" : "items-start flex-row-reverse"}`}
          >
            <div className={`p-2 rounded-full ${msg.role === "assistant" ? "bg-blue-500/20 text-blue-400" : "bg-violet-500/20 text-violet-400"}`}>
              {msg.role === "assistant" ? <Bot size={24} /> : <User size={24} />}
            </div>
            <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.role === "assistant" ? "glass rounded-tl-none" : "bg-violet-600/20 rounded-tr-none border border-violet-500/30 text-white"}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {error ? (
        <div className="text-sm text-red-400 px-4 pb-2">{error}</div>
      ) : null}

      <div className="p-4 mt-auto">
        <GlassCard className="flex items-center p-2 rounded-full" hoverEffect={false}>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder-gray-500"
            placeholder="Ask about salary, skills, or career paths..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
