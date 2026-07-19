export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const settings = await db.select().from(siteSettings).where(eq(siteSettings.locale, locale)).get();
  return <SettingsForm data={settings ?? null} locale={locale} />;
}
