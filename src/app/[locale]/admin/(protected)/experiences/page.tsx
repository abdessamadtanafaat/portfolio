export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { experiences } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { ExperiencesListClient } from "./ExperiencesListClient";

export default async function ExperiencesListPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db.select().from(experiences).where(eq(experiences.locale, locale)).orderBy(desc(experiences.startDate)).all();
  return <ExperiencesListClient data={all} locale={locale} />;
}
