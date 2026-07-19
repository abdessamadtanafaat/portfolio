export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { navItems } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { HeaderListClient } from "./HeaderListClient";

export default async function HeaderPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db.select().from(navItems).where(eq(navItems.locale, locale)).orderBy(asc(navItems.orderIndex)).all();
  return <HeaderListClient data={all} locale={locale} />;
}
