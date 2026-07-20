import { defineConfig } from "drizzle-kit";

// Use Turso (libSQL) when env vars are present (production / remote),
// otherwise fall back to the local SQLite file used in development.
// Note: drizzle-kit does not auto-load .env.local — pass TURSO_* inline
// (or via a .env) when pushing to a remote database, e.g.:
//   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npx drizzle-kit push
const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url,
    ...(authToken ? { authToken } : {}),
  },
  verbose: true,
  strict: true,
});
