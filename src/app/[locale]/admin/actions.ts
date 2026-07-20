"use server";

import { randomBytes, createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { signIn } from "@/lib/auth-config";
import { auth } from "@/lib/auth-config";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { adminUser } from "@/lib/db/schema";
import { eq, or, and, ne } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/password";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getSenderEmail(): string {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  if (process.env.NODE_ENV === "production") return "Portfolio Contact <noreply@at.com>";
  return "Portfolio Contact <onboarding@resend.dev>";
}

// Build the public origin for reset links. Prefers NEXT_PUBLIC_SITE_URL, then
// the incoming request host (so production emails never point to localhost),
// then NEXTAUTH_URL as a final fallback.
async function getBaseUrl(): Promise<string> {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) return site.replace(/\/$/, "");
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  } catch {
    // headers() is unavailable outside a request context
  }
  const authUrl = process.env.NEXTAUTH_URL;
  if (authUrl) return authUrl.replace(/\/$/, "");
  return "http://localhost:3000";
}

// Resend sandbox only delivers to the account's verified email. Try the
// requested recipient first, then fall back to the owner's verified address.
async function sendResetEmail(
  recipient: string,
  name: string,
  resetLink: string
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const res: any = await resend.emails.send({
      from: getSenderEmail(),
      to: recipient,
      subject: "[Portfolio] Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h2 style="margin: 0 0 16px; color: #0f172a;">Réinitialisation du mot de passe</h2>
          <p style="color: #475569; line-height: 1.6;">Bonjour ${name},</p>
          <p style="color: #475569; line-height: 1.6;">Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte administrateur. Ce lien expire dans 1 heure.</p>
          <p style="margin: 24px 0;">
            <a href="${resetLink}" style="display: inline-block; background: #ed8116; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600;">Réinitialiser mon mot de passe</a>
          </p>
          <p style="color: #94a3b8; font-size: 13px;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Le lien ne fonctionnera qu'une seule fois.</p>
        </div>
      `,
    });
    return !!res?.data?.id;
  } catch {
    return false;
  }
}

export async function requestPasswordResetAction(
  email: string
): Promise<{ success: boolean; message: string; devToken?: string }> {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    return { success: false, message: "Veuillez saisir une adresse email valide." };
  }

  // Always respond generically to avoid user enumeration.
  const user = await db.select().from(adminUser).where(eq(adminUser.email, normalized)).get();

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = Math.floor((Date.now() + RESET_TOKEN_TTL_MS) / 1000);

    await db
      .update(adminUser)
      .set({ resetToken: hashToken(token), resetTokenExpiresAt: expiresAt })
      .where(eq(adminUser.id, user.id))
      .run();

    const baseUrl = await getBaseUrl();
    const resetLink = `${baseUrl}/en/admin/reset-password?token=${token}`;
    console.log(`[password-reset] Reset link for ${user.email}: ${resetLink}`);

    let sent = await sendResetEmail(user.email, user.name, resetLink);
    const ownerEmail = process.env.CONTACT_EMAIL;
    if (!sent && ownerEmail && ownerEmail !== user.email) {
      sent = await sendResetEmail(ownerEmail, user.name, resetLink);
    }

    // When email can't be delivered (sandbox restriction, exhausted quota,
    // or no API key), surface the token so the owner can still reset.
    if (!sent) {
      return {
        success: true,
        message:
          "Le service email n'a pas pu délivrer le message (compte Resend en mode sandbox ou quota atteint). Utilisez le token ci-dessous sur la page de réinitialisation, ou vérifiez les logs serveur.",
        devToken: token,
      };
    }
  }

  return {
    success: true,
    message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
  };
}

export async function resetPasswordAction(
  token: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  if (!token || password.length < 8) {
    return { success: false, message: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const hashedToken = hashToken(token);
  const now = Math.floor(Date.now() / 1000);

  const user = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.resetToken, hashedToken))
    .get();

  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < now) {
    return { success: false, message: "Lien de réinitialisation invalide ou expiré." };
  }

  await db
    .update(adminUser)
    .set({
      passwordHash: await hashPassword(password),
      resetToken: null,
      resetTokenExpiresAt: null,
      updatedAt: now,
    })
    .where(eq(adminUser.id, user.id))
    .run();

  return { success: true, message: "Mot de passe mis à jour. Vous pouvez vous connecter." };
}

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
      identifier: email,
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

const MIN_PASSWORD_LENGTH = 8;

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
    return { success: false, message: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Non authentifié." };
  }

  const user = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.id, Number(session.user.id)))
    .get();

  if (!user) return { success: false, message: "Utilisateur introuvable." };

  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    return { success: false, message: "Le mot de passe actuel est incorrect." };
  }

  await db
    .update(adminUser)
    .set({ passwordHash: await hashPassword(newPassword), updatedAt: Math.floor(Date.now() / 1000) })
    .where(eq(adminUser.id, user.id))
    .run();

  return { success: true, message: "Mot de passe mis à jour avec succès." };
}

export async function createAdminUserAction(
  email: string,
  name: string,
  password: string,
  username?: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Non authentifié." };
  }

  const normalized = (email || "").trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    return { success: false, message: "Veuillez saisir une adresse email valide." };
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return { success: false, message: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const normalizedUsername = (username || "").trim().toLowerCase();
  const conditions = [eq(adminUser.email, normalized)];
  if (normalizedUsername) conditions.push(eq(adminUser.username, normalizedUsername));
  const existing = await db.select().from(adminUser).where(or(...conditions)).get();
  if (existing) {
    return {
      success: false,
      message: existing.email === normalized ? "Un administrateur avec cet email existe déjà." : "Ce nom d'utilisateur est déjà pris.",
    };
  }

  const now = Math.floor(Date.now() / 1000);
  await db
    .insert(adminUser)
    .values({
      email: normalized,
      username: normalizedUsername || null,
      name: (name || "").trim() || normalized,
      passwordHash: await hashPassword(password),
      createdAt: now,
      updatedAt: now,
    })
    .run();

  return { success: true, message: "Administrateur créé avec succès." };
}

export async function deleteAdminUserAction(
  id: number
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Non authentifié." };
  }
  if (Number(session.user.id) === id) {
    return { success: false, message: "Vous ne pouvez pas supprimer votre propre compte." };
  }

  const target = await db.select().from(adminUser).where(eq(adminUser.id, id)).get();
  if (!target) return { success: false, message: "Utilisateur introuvable." };

  await db.delete(adminUser).where(eq(adminUser.id, id)).run();
  return { success: true, message: "Administrateur supprimé." };
}

export async function updateAdminUserAction(
  id: number,
  data: { name?: string; username?: string; email?: string }
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Non authentifié." };
  }

  const target = await db.select().from(adminUser).where(eq(adminUser.id, id)).get();
  if (!target) return { success: false, message: "Utilisateur introuvable." };

  const email = (data.email || "").trim().toLowerCase();
  const username = (data.username || "").trim().toLowerCase() || null;
  const name = (data.name || "").trim() || target.name;

  if (email && !email.includes("@")) {
    return { success: false, message: "Veuillez saisir une adresse email valide." };
  }

  const conditions = [];
  if (email && email !== target.email) conditions.push(eq(adminUser.email, email));
  if (username && username !== (target.username ?? "")) conditions.push(eq(adminUser.username, username));
  if (conditions.length) {
    const conflict = await db
      .select()
      .from(adminUser)
      .where(and(or(...conditions), ne(adminUser.id, id)))
      .get();
    if (conflict) {
      return {
        success: false,
        message: conflict.email === email ? "Cet email est déjà utilisé." : "Ce nom d'utilisateur est déjà pris.",
      };
    }
  }

  await db
    .update(adminUser)
    .set({
      name,
      email: email || target.email,
      username,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(adminUser.id, id))
    .run();

  return { success: true, message: "Administrateur mis à jour." };
}
