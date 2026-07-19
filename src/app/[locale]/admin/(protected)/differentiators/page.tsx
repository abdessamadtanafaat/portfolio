export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { differentiators } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { DifferentiatorsListClient } from "./DifferentiatorsListClient";

export default async function DifferentiatorsPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db
    .select()
    .from(differentiators)
    .where(eq(differentiators.locale, locale))
    .orderBy(asc(differentiators.orderIndex))
    .all();
  return <DifferentiatorsListClient data={all} locale={locale} />;
}
