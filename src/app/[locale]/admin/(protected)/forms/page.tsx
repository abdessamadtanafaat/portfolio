export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { formFields, formSettings } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { FormsListClient } from "./FormsListClient";

export default async function FormsPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const fields = await db.select().from(formFields).where(eq(formFields.locale, locale)).orderBy(asc(formFields.orderIndex)).all();
  const settings = await db.select().from(formSettings).where(eq(formSettings.locale, locale)).get();
  return <FormsListClient fields={fields} settings={settings ?? null} locale={locale} />;
}
