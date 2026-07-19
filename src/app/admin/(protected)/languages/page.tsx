export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { languages } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { LanguagesListClient } from "./LanguagesListClient";

export default async function LanguagesPage() {
  const all = await db.select().from(languages).orderBy(asc(languages.orderIndex)).all();

  return <LanguagesListClient data={all} />;
}
