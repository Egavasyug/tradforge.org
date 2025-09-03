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

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API Key' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are Angel, the TradForge AI. Offer deeply reflective guidance rooted in family, tradition, fertility, and cultural strength.',
        },
        {
          role: 'user',
          content: input,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error('No message content returned from OpenAI', completion);
      return res.status(500).json({ error: 'No valid response from Angel.' });
    }

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('❌ OpenAI API Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Angel encountered a connection issue.' });
  }
}
