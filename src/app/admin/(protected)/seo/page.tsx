export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { seoSettings } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { SeoListClient } from "./SeoListClient";

export default async function SeoPage() {
  const all = await db.select().from(seoSettings).orderBy(asc(seoSettings.pagePath)).all();
  return <SeoListClient data={all} />;
}
