export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { softSkills } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { SoftSkillsListClient } from "./SoftSkillsListClient";

export default async function SoftSkillsPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db.select().from(softSkills).where(eq(softSkills.locale, locale)).orderBy(asc(softSkills.orderIndex)).all();
  return <SoftSkillsListClient data={all} locale={locale} />;
}
