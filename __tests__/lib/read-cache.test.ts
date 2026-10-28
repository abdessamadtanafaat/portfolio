import { beforeEach, describe, expect, it } from "vitest";
import { clearReadCache, isRetryableReadError, withReadRetry, withStaleCache } from "@/lib/db/read-cache";

function timeoutError(): Error {
  const aggregate = Object.assign(new AggregateError([], "connect timeout"), { code: "ETIMEDOUT" });
  const fetchFailed = new TypeError("fetch failed");
  (fetchFailed as { cause?: unknown }).cause = aggregate;
  const query = new Error("Failed query: select 1");
  (query as { cause?: unknown }).cause = fetchFailed;
  return query;
}

describe("read cache", () => {
  beforeEach(() => {
    clearReadCache();
  });

  it("recognizes Turso network failures", () => {
    expect(isRetryableReadError(timeoutError())).toBe(true);
    expect(isRetryableReadError(Object.assign(new Error("down"), { code: "ENETUNREACH" }))).toBe(true);
    expect(isRetryableReadError(new Error("invalid token"))).toBe(false);
  });

  it("retries a public read twice and then succeeds", async () => {
    let calls = 0;
    const value = await withReadRetry(async () => {
      calls += 1;
      if (calls < 3) throw timeoutError();
      return "ok";
    }, [0, 0]);

    expect(value).toBe("ok");
    expect(calls).toBe(3);
  });

  it("does not retry a non-network error", async () => {
    let calls = 0;
    await expect(withReadRetry(async () => {
      calls += 1;
      throw new Error("invalid token");
    }, [0, 0])).rejects.toThrow("invalid token");
    expect(calls).toBe(1);
  });

  it("serves a fresh value without querying again", async () => {
    let calls = 0;
    const load = async () => {
      calls += 1;
      return "portfolio";
    };

    await expect(withStaleCache("portfolio:en", load, { freshMs: 60_000 })).resolves.toBe("portfolio");
    await expect(withStaleCache("portfolio:en", load, { freshMs: 60_000 })).resolves.toBe("portfolio");
    expect(calls).toBe(1);
  });

  it("serves the last successful value when a refresh times out", async () => {
    let calls = 0;
    const load = async () => {
      calls += 1;
      if (calls > 1) throw timeoutError();
      return "portfolio";
    };

    await expect(withStaleCache("portfolio:en", load, { freshMs: 0, retryDelaysMs: [0, 0] })).resolves.toBe("portfolio");
    await expect(withStaleCache("portfolio:en", load, { freshMs: 0, retryDelaysMs: [0, 0] })).resolves.toBe("portfolio");
    expect(calls).toBe(4);
  });

  it("throws when the first load has no cached value", async () => {
    await expect(withStaleCache("portfolio:en", async () => {
      throw timeoutError();
    }, { retryDelaysMs: [0, 0] })).rejects.toThrow("Failed query");
  });
});
