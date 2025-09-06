import { kvAvailable, kvGet, kvSet } from './kv';

const PREFIX = 'thread:';
const local = new Map<string, string>();

export async function getThreadId(userId: string): Promise<string | null> {
  if (!userId) return null;
  if (kvAvailable) {
    const v = await kvGet(PREFIX + userId);
    if (v) return v;
  }
  return local.get(userId) ?? null;
}

export async function setThreadId(userId: string, threadId: string): Promise<void> {
  if (!userId || !threadId) return;
  local.set(userId, threadId);
  try {
    await kvSet(PREFIX + userId, threadId);
  } catch {
    // best-effort; ignore
  }
}

