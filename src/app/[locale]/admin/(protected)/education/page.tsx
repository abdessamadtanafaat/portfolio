export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { education } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { EducationListClient } from "./EducationListClient";

export default async function EducationListPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db.select().from(education).where(eq(education.locale, locale)).orderBy(desc(education.startDate)).all();
  return <EducationListClient data={all} locale={locale} />;
}
