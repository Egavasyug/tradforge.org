// src/pages/api/assistant.ts — Angel chat (OpenAI Chat Completions; no Assistants/threads API)

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { getThreadId, setThreadId } from '@/lib/threadStore';
import { checkRateLimit } from '@/lib/rateLimit';

/** In-memory conversation turns per thread (serverless-friendly best-effort). */
const historyStore: Record<string, { role: 'user' | 'assistant'; content: string }[]> = {};

const SYSTEM_PROMPT = `You are Angel, the TradForge AI assistant for tradforge.org.
You help visitors understand TradForge's mission: a cultural DAO promoting traditional family formation, biologically complementary gender roles, soulbound NFT credentialing, decentralized education, and community resilience.
Be clear, respectful, and mission-aligned. Prefer plain language. Do not invent token prices, legal advice, or private keys.
When useful, point readers to the TradForge whitepaper at /TradForge_Whitepaper_Soulbound.pdf on this site.
If asked about code or wallet ops, stay high-level and safety-first.`;

function newThreadId(): string {
  return `chat_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, userId, threadId: clientThreadId } = req.body as {
    input?: string;
    userId?: string;
    threadId?: string | null;
  };

  if (!input || typeof input !== 'string' || !userId) {
    return res.status(400).json({ error: 'Invalid input or missing userId' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing required env var: OPENAI_API_KEY');
    return res.status(500).json({ error: 'Missing assistant configuration. Contact the site admin.' });
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const openai = new OpenAI({ apiKey });

  try {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const rlId = userId || ip;
    const { allowed } = await checkRateLimit(String(rlId));
    if (!allowed) {
      return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }

    let threadId = clientThreadId || (userId ? await getThreadId(userId) : null);
    if (!threadId) {
      threadId = newThreadId();
      if (userId) await setThreadId(userId, threadId);
    }

    const prior = historyStore[threadId] || [];
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...prior.slice(-12),
      { role: 'user', content: input },
    ];

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.6,
      max_tokens: 800,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      'No valid assistant response.';

    const nextHist: { role: 'user' | 'assistant'; content: string }[] = [
      ...prior,
      { role: 'user', content: input },
      { role: 'assistant', content: reply },
    ];
    historyStore[threadId] = nextHist.slice(-24);

    return res.status(200).json({ output: reply, threadId });
  } catch (error: any) {
    const detail = error?.response?.data || error?.message || 'Unknown error';
    console.error('Assistant error:', detail);
    const hint =
      typeof detail === 'string' ? detail : detail?.error?.message || 'OpenAI request failed';
    return res.status(500).json({ error: 'Internal server error.', hint });
  }
}
