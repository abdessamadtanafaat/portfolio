
import * as dns from "node:dns";
import * as net from "node:net";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Workaround for intermittent IPv4/IPv6 connection failures to Turso.
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamily(false);

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDbInstance() {
  if (!dbInstance && process.env.TURSO_DATABASE_URL) {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    dbInstance = drizzle(client, { schema });
  }

  if (!dbInstance) {
    throw new Error(
      "Database not initialized. Check TURSO_DATABASE_URL environment variable."
    );
  }

  return dbInstance;
}

// Export a proxy that lazily initializes the database.
const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop) {
    const instance = getDbInstance();
    return Reflect.get(instance, prop);
  },
});

export { db };
export type DB = ReturnType<typeof drizzle<typeof schema>>;
