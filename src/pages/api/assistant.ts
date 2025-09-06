// src/pages/api/assistant.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// In-memory user-thread store
const threadStore: Record<string, string> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, userId } = req.body as { input?: string; userId?: string };

  if (!input || typeof input !== 'string' || !userId) {
    return res.status(400).json({ error: 'Invalid input or missing userId' });
  }

  const assistantId = process.env.ASSISTANT_ID;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!assistantId || !apiKey) {
    const missing = [!assistantId && 'ASSISTANT_ID', !apiKey && 'OPENAI_API_KEY'].filter(Boolean).join(', ');
    console.error(`Missing required env var(s): ${missing}`);
    return res.status(500).json({ error: 'Missing assistant configuration. Contact the site admin.' });
  }

  const openai = new OpenAI({ apiKey });

  try {
    let threadId = threadStore[userId];

    // Create a thread for the user if one doesn't exist
    if (!threadId) {
      const thread = await openai.beta.threads.create({});
      if (typeof thread.id !== 'string') {
        console.error('thread.id is not a string:', thread.id);
        return res.status(500).json({ error: 'Invalid thread ID from OpenAI.' });
      }
      threadId = thread.id;
      threadStore[userId] = threadId;
      console.log(`Created thread ${threadId} for user ${userId}`);
    }

    // Add user message
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: input,
    });

    // Start assistant run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Poll for run completion
    if (!threadId || typeof threadId !== 'string' || !run.id || typeof run.id !== 'string') {
      console.error('Invalid threadId or run.id:', { threadId, runId: (run as any)?.id });
      return res.status(500).json({ error: 'Invalid thread or run ID.' });
    }
    let runStatus = await (openai.beta.threads.runs as any).retrieve(threadId, run.id);

    let attempts = 0;
    const maxAttempts = 30;

    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      if (["failed", "cancelled"].includes(runStatus.status as string)) {
        return res.status(500).json({ error: 'Assistant run failed or cancelled.' });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await (openai.beta.threads.runs as any).retrieve(threadId, run.id);
      attempts++;
    }

    // Get assistant response
    const messages = await (openai.beta.threads.messages as any).list(threadId, {});
    console.log('Messages payload:', JSON.stringify(messages, null, 2));

    const responseMessage = messages.data.find((msg: any) => msg.role === 'assistant');

    const reply =
      responseMessage?.content?.[0]?.type === 'text'
        ? (responseMessage.content[0] as any).text.value
        : 'No valid assistant response.';

    return res.status(200).json({ output: reply });
  } catch (error: any) {
    const detail = error?.response?.data || error?.message || 'Unknown error';
    console.error('Assistant error:', detail);
    // Provide a slightly more actionable message without leaking sensitive data
    const hint = typeof detail === 'string' ? detail : detail?.error?.message || 'OpenAI request failed';
    return res.status(500).json({ error: 'Internal server error.', hint });
  }
}
