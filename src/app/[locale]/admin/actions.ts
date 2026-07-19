"use server";

import { signIn } from "@/lib/auth-config";
import { AuthError } from "next-auth";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = loginAttempts.get(email);

  if (!record || now > record.resetAt) {
    loginAttempts.set(email, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

export async function loginAction(
  email: string,
  password: string,
  callbackUrl: string = "/admin"
): Promise<{ success: boolean; error?: string }> {
  const rateLimit = checkRateLimit(email.toLowerCase());

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Trop de tentatives. Réessayez dans ${rateLimit.retryAfter} secondes.`,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
    loginAttempts.delete(email.toLowerCase());
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }
    throw error;
  }
}
