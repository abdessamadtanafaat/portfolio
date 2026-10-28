const FRESH_MS = 60_000;
const RETRY_DELAYS_MS = [200, 400];
const RETRYABLE_CODES = new Set(["ETIMEDOUT", "ENETUNREACH"]);

type CacheEntry<T> = {
  value: T;
  storedAt: number;
};

type StaleCacheOptions = {
  freshMs?: number;
  retryDelaysMs?: number[];
};

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableReadError(error: unknown, depth = 0): boolean {
  if (!error || typeof error !== "object" || depth > 6) return false;

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    cause?: unknown;
    errors?: unknown;
  };

  if (typeof candidate.code === "string" && RETRYABLE_CODES.has(candidate.code)) {
    return true;
  }

  if (typeof candidate.message === "string" && candidate.message.includes("fetch failed")) {
    return true;
  }

  if (Array.isArray(candidate.errors) && candidate.errors.some((item) => isRetryableReadError(item, depth + 1))) {
    return true;
  }

  return isRetryableReadError(candidate.cause, depth + 1);
}

export async function withReadRetry<T>(
  load: () => Promise<T>,
  delays: number[] = RETRY_DELAYS_MS,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await load();
    } catch (error) {
      lastError = error;
      const delay = delays[attempt];
      if (delay === undefined || !isRetryableReadError(error)) throw error;
      await sleep(delay);
    }
  }

  throw lastError;
}

export async function withStaleCache<T>(
  key: string,
  load: () => Promise<T>,
  options: StaleCacheOptions = {},
): Promise<T> {
  const freshMs = options.freshMs ?? FRESH_MS;
  const current = cache.get(key) as CacheEntry<T> | undefined;

  if (current && Date.now() - current.storedAt < freshMs) {
    return current.value;
  }

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const promise = (async () => {
    try {
      const value = await withReadRetry(load, options.retryDelaysMs);
      cache.set(key, { value, storedAt: Date.now() });
      return value;
    } catch (error) {
      if (current) return current.value;
      throw error;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

export function clearReadCache(): void {
  cache.clear();
  inflight.clear();
}
