// pages/api/assistant.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  reply: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { input } = req.body;

    // Simple logic to simulate assistant reply
    const reply = `TradForge Insight: "${input}" is a great question. Reflect deeply and seek alignment.`;

    res.status(200).json({ reply });
  } else {
    res.status(405).json({ reply: 'Method Not Allowed' });
  }
}
