export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { socialLinks } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { SocialLinksListClient } from "./SocialLinksListClient";

export default async function SocialLinksPage() {
  const all = await db.select().from(socialLinks).orderBy(asc(socialLinks.orderIndex)).all();
  return <SocialLinksListClient data={all} />;
}
