import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/password";

describe("Password utilities", () => {
  it("should hash a password", async () => {
    const hashed = await hashPassword("testpassword123");
    expect(hashed).toBeDefined();
    expect(hashed).not.toBe("testpassword123");
    expect(hashed.length).toBeGreaterThan(20);
    expect(hashed.startsWith("$2")).toBe(true);
  });

  it("should verify a correct password", async () => {
    const password = "mysecretpassword";
    const hashed = await hashPassword(password);
    const result = await verifyPassword(password, hashed);
    expect(result).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const hashed = await hashPassword("correctpassword");
    const result = await verifyPassword("wrongpassword", hashed);
    expect(result).toBe(false);
  });

  it("should produce different hashes for the same password", async () => {
    const hash1 = await hashPassword("samepassword");
    const hash2 = await hashPassword("samepassword");
    expect(hash1).not.toBe(hash2);
    // But both should verify correctly
    expect(await verifyPassword("samepassword", hash1)).toBe(true);
    expect(await verifyPassword("samepassword", hash2)).toBe(true);
  });
});
