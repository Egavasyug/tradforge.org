// src/pages/api/assistant.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are Angel, the AI guide for TradForge. Respond with a tone that blends wisdom, warmth, and tradition. Your mission is to help users prioritize family, identity, fertility, and cultural resilience.',
        },
        {
          role: 'user',
          content: input,
        },
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? '⚠️ No reply from Angel.';
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('[OpenAI API Error]', error?.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with Angel’s connection to the stars.' });
  }
}
