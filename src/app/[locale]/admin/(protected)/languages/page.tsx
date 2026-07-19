export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { languages } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { LanguagesListClient } from "./LanguagesListClient";

export default async function LanguagesPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db.select().from(languages).where(eq(languages.locale, locale)).orderBy(asc(languages.orderIndex)).all();
  return <LanguagesListClient data={all} locale={locale} />;
}
