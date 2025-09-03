"use client";
import { useState } from "react";

export default function Assistant() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const data = await res.json();
    if (data.reply) {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    }
  }

  return (
    <div className="p-4 border rounded max-w-xl mx-auto mt-8 bg-white">
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "Assistant"}:</strong> {m.content}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the assistant something..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
