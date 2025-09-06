import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Assistant() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // Persisted user ID (per session)
  const userIdRef = useRef(uuidv4());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, `You: ${input}`]);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          userId: userIdRef.current, // persistent across all messages
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          `Error: ${data?.error || 'Unknown error.'}`,
        ]);
      } else {
        setMessages((prev) => [...prev, `Angel: ${data.output}`]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        `Network error: ${err?.message || 'Request failed.'}`,
      ]);
    }
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
