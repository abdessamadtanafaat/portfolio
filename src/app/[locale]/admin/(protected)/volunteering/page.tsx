export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { volunteering } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { VolunteeringListClient } from "./VolunteeringListClient";

export default async function VolunteeringPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db.select().from(volunteering).where(eq(volunteering.locale, locale)).orderBy(asc(volunteering.orderIndex)).all();
  return <VolunteeringListClient data={all} locale={locale} />;
}
