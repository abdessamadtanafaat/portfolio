export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { navItems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { HeaderListClient } from "./HeaderListClient";

export default async function HeaderPage() {
  const all = await db.select().from(navItems).orderBy(asc(navItems.orderIndex)).all();
  return <HeaderListClient data={all} />;
}
