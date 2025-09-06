import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Assistant() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // Persisted user ID (browser localStorage)
  const userIdRef = useRef<string>('');
  // Persisted thread ID across requests (browser localStorage)
  const threadIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Load or create user id
    const storedUser = localStorage.getItem('assistant_user_id');
    if (storedUser) {
      userIdRef.current = storedUser;
    } else {
      const id = uuidv4();
      userIdRef.current = id;
      localStorage.setItem('assistant_user_id', id);
    }
    // Load thread id if present
    const storedThread = localStorage.getItem('assistant_thread_id');
    if (storedThread) threadIdRef.current = storedThread;
  }, []);

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
          threadId: threadIdRef.current,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const hint = data?.hint ? ` (hint: ${data.hint})` : '';
        setMessages((prev) => [
          ...prev,
          `Error: ${data?.error || 'Unknown error.'}${hint}`,
        ]);
      } else {
        // Save thread id if returned
        if (data?.threadId && data.threadId !== threadIdRef.current) {
          threadIdRef.current = data.threadId;
          localStorage.setItem('assistant_thread_id', data.threadId);
        }
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
