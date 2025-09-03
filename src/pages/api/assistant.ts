// pages/api/assistant.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are Angel, the TradForge AI assistant. Speak with warmth and purpose. Keep it grounded in cultural tradition, family, and identity.',
        },
        {
          role: 'user',
          content: input,
        },
      ],
    });

    const reply = completion.data.choices[0]?.message?.content ?? '⚠️ No response.';
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('[OpenAI Error]', error.response?.data || error.message);
    res.status(500).json({ error: 'OpenAI API call failed' });
  }
}
