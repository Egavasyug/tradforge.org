import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'error';
  text: string;
};

const markdownComponents: Components = {
  a({ children, ...props }) {
    return (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children as ReactNode}
      </a>
    );
  },
  code(props) {
    const { inline, className, children, ...rest } = props as typeof props & {
      inline?: boolean;
      className?: string;
      children?: ReactNode;
    };
    if (inline) {
      return (
        <code
          {...rest}
          className={`rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.85em] ${className || ''}`}
        >
          {children}
        </code>
      );
    }
    return (
      <pre className="my-2 rounded-md bg-gray-900 p-3 text-xs text-gray-100">
        <code {...rest} className={`block overflow-x-auto ${className || ''}`}>
          {children}
        </code>
      </pre>
    );
  },
};

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Persisted user ID (browser localStorage)
  const userIdRef = useRef<string>('');
  // Persisted thread ID across requests (browser localStorage)
  const threadIdRef = useRef<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('assistant_user_id');
    if (storedUser) {
      userIdRef.current = storedUser;
    } else {
      const id = uuidv4();
      userIdRef.current = id;
      localStorage.setItem('assistant_user_id', id);
    }
    const storedThread = localStorage.getItem('assistant_thread_id');
    if (storedThread) threadIdRef.current = storedThread;
  }, []);

  const pushMessage = (role: ChatMessage['role'], text: string) => {
    setMessages((prev) => [...prev, { id: uuidv4(), role, text }]);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    pushMessage('user', message);
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowHeader(false); // auto-hide header after first message
    }
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: message, userId: userIdRef.current, threadId: threadIdRef.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        const hint = data?.hint ? ` (hint: ${data.hint})` : '';
        pushMessage('error', `${data?.error || 'Unknown error.'}${hint}`);
      } else {
        if (data?.threadId && data.threadId !== threadIdRef.current) {
          threadIdRef.current = data.threadId;
          localStorage.setItem('assistant_thread_id', data.threadId);
        }
        pushMessage('assistant', data?.output || '');
      }
    } catch (err: any) {
      pushMessage('error', `Network error: ${err?.message || 'Request failed.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const toSend = input;
    setInput('');
    await sendMessage(toSend);
  };

  const handleReset = () => {
    localStorage.removeItem('assistant_thread_id');
    threadIdRef.current = null;
    setMessages([]);
  };

  return (
    <div className="mt-6 border-t pt-4">
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            {msg.role === 'assistant' ? (
              <div>
                <p className="font-semibold text-gray-700">Angel</p>
                <div className="prose prose-sm max-w-none text-gray-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {msg.text?.trim() ? msg.text : '_No response_'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <p className={msg.role === 'error' ? 'text-red-600' : ''}>
                <span className="font-semibold">{msg.role === 'user' ? 'You' : 'Error'}:</span>{' '}
                {msg.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Compact header with show/hide toggle */}
      {showHeader ? (
        <div className="p-4 bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm rounded-md mb-2 fade-in">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <Image src="/Angel-Avatar.png" alt="Angel Avatar" width={48} height={48} className="w-12 h-12 rounded-full border object-cover" priority />
              <div>
                <p className="text-sm font-semibold text-gray-700">Angel</p>
                <p className="text-sm text-gray-500">Ask me anything...</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHeader(false)}
              className="text-xs text-gray-600 underline hover:text-gray-800"
              disabled={loading}
              aria-expanded={showHeader}
            >
              Hide
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setShowHeader(true)}
            className="text-xs text-gray-600 underline hover:text-gray-800"
            disabled={loading}
            aria-expanded={showHeader}
          >
            Show header
          </button>
        </div>
      )}

      {loading && <p className="text-xs text-gray-500 mb-2">Angel is thinking...</p>}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          className="border px-3 py-1 rounded w-full disabled:opacity-60"
          placeholder="Ask Angel anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="bg-black text-white px-4 py-1 rounded disabled:opacity-50" disabled={loading} aria-busy={loading}>
          Send
        </button>
        <button type="button" onClick={handleReset} className="px-3 py-1 rounded border">
          Reset
        </button>
      </form>
    </div>
  );
}
