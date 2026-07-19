export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { experiences } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { ExperiencesListClient } from "./ExperiencesListClient";

export default async function ExperiencesListPage() {
  const all = await db.select().from(experiences).orderBy(desc(experiences.startDate)).all();
  return <ExperiencesListClient data={all} />;
}
