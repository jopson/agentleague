// v0 in-memory rate limiter (per-process). Good enough for local dev.
// For production/serverless, swap to Upstash Redis / Vercel KV.

type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit({
  key,
  limitPerMinute,
}: {
  key: string;
  limitPerMinute: number;
}): { ok: boolean; remaining: number } {
  const now = Date.now();
  const refillPerMs = limitPerMinute / 60_000;

  const b = buckets.get(key) ?? { tokens: limitPerMinute, updatedAt: now };
  const elapsed = now - b.updatedAt;
  const refilled = Math.min(limitPerMinute, b.tokens + elapsed * refillPerMs);

  const tokensAfter = refilled - 1;
  const ok = tokensAfter >= 0;

  const next: Bucket = {
    tokens: ok ? tokensAfter : refilled,
    updatedAt: now,
  };
  buckets.set(key, next);

  return { ok, remaining: Math.max(0, Math.floor(next.tokens)) };
}
