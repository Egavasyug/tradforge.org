// src/components/Assistant.tsx

import { useState } from 'react';

export default function Assistant() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, `🧠 You: ${input}`]);

    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setMessages([...messages, `🧠 You: ${input}`, `👼 Angel: ${data.reply}`]);
    setInput('');
  };

  return (
    <div className="mt-6 border-t pt-4">
      <div className="space-y-2">
        {messages.map((msg, idx) => (
          <p key={idx} className="text-sm">{msg}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          className="border px-3 py-1 rounded w-full"
          placeholder="Ask Angel anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="bg-black text-white px-4 py-1 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
