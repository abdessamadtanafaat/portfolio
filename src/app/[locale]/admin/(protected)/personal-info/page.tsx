export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { personalInfo } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PersonalInfoForm } from "./PersonalInfoForm";

export default async function PersonalInfoPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const info = await db.select().from(personalInfo).where(eq(personalInfo.locale, locale)).get();
  return <PersonalInfoForm data={info ?? null} locale={locale} />;
}
