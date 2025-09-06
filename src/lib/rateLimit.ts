import { kvAvailable, kvExpire, kvIncr } from './kv';

type Window = { count: number; resetAt: number };
const mem = new Map<string, Window>();

export async function checkRateLimit(id: string, limit = 30, windowSec = 60): Promise<{ allowed: boolean; count: number }>{
  const key = `rl:${id}`;
  if (kvAvailable) {
    const count = await kvIncr(key);
    if (count === 1) await kvExpire(key, windowSec);
    return { allowed: count <= limit, count };
  }
  const now = Date.now();
  const w = mem.get(key);
  if (!w || w.resetAt <= now) {
    mem.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { allowed: true, count: 1 };
  }
  w.count += 1;
  mem.set(key, w);
  return { allowed: w.count <= limit, count: w.count };
}

