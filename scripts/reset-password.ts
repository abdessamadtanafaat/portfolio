import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

import { db } from "../src/lib/db";
import { adminUser } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../src/lib/password";
import { randomBytes } from "node:crypto";

/**
 * Reset the admin password directly against the configured database.
 * Usage: npm run db:reset-password -- <email> <newPassword>
 * Best used when email/Resend is not configured or the reset link is unavailable.
 */
async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: npm run db:reset-password -- <email> <newPassword>");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const normalized = email.trim().toLowerCase();
  const user = await db.select().from(adminUser).where(eq(adminUser.email, normalized)).get();
  if (!user) {
    console.error(`No admin user found with email: ${normalized}`);
    process.exit(1);
  }

  await db
    .update(adminUser)
    .set({
      passwordHash: await hashPassword(password),
      resetToken: null,
      resetTokenExpiresAt: null,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(adminUser.id, user.id))
    .run();

  console.log(`✓ Password updated for ${normalized}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Error:", e?.message);
    process.exit(1);
  });
