export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { homepageContent } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { HomepageContentForm } from "./HomepageContentForm";

export default async function HomepageContentPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const hp = await db.select().from(homepageContent).where(eq(homepageContent.locale, locale)).get();
  return <HomepageContentForm data={hp ?? null} locale={locale} />;
}
