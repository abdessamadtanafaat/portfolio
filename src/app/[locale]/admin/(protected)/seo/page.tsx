export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { seoSettings } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { SeoListClient } from "./SeoListClient";

export default async function SeoPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const all = await db.select().from(seoSettings).where(eq(seoSettings.locale, locale)).orderBy(asc(seoSettings.pagePath)).all();
  return <SeoListClient data={all} locale={locale} />;
}
