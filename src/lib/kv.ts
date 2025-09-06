// Lightweight Vercel KV (Upstash REST) helper with in-memory fallback

type MemEntry = { value: string; expiresAt?: number };
const mem = new Map<string, MemEntry>();

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function now() {
  return Date.now();
}

function cleanupMem() {
  const t = now();
  for (const [k, v] of mem) {
    if (v.expiresAt && v.expiresAt <= t) mem.delete(k);
  }
}

export const kvAvailable = Boolean(KV_URL && KV_TOKEN);

export async function kvGet(key: string): Promise<string | null> {
  if (kvAvailable) {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as any;
    return typeof data?.result === 'string' ? data.result : data?.result ?? null;
  }
  cleanupMem();
  const hit = mem.get(key);
  if (!hit) return null;
  if (hit.expiresAt && hit.expiresAt <= now()) {
    mem.delete(key);
    return null;
  }
  return hit.value;
}

export async function kvSet(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
  if (kvAvailable) {
    const url = ttlSeconds
      ? `${KV_URL}/set/${encodeURIComponent(key)}?EX=${ttlSeconds}`
      : `${KV_URL}/set/${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    return res.ok;
  }
  cleanupMem();
  mem.set(key, { value, expiresAt: ttlSeconds ? now() + ttlSeconds * 1000 : undefined });
  return true;
}

export async function kvIncr(key: string): Promise<number> {
  if (kvAvailable) {
    const res = await fetch(`${KV_URL}/incr/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as any;
    return Number(data?.result ?? 0);
  }
  cleanupMem();
  const hit = mem.get(key);
  const num = hit ? Number(hit.value) + 1 : 1;
  mem.set(key, { value: String(num), expiresAt: hit?.expiresAt });
  return num;
}

export async function kvExpire(key: string, ttlSeconds: number): Promise<boolean> {
  if (kvAvailable) {
    const res = await fetch(`${KV_URL}/expire/${encodeURIComponent(key)}/${ttlSeconds}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    return res.ok;
  }
  const hit = mem.get(key);
  if (!hit) return false;
  hit.expiresAt = now() + ttlSeconds * 1000;
  mem.set(key, hit);
  return true;
}

