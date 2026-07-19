export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { education } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { EducationListClient } from "./EducationListClient";

export default async function EducationListPage() {
  const all = await db.select().from(education).orderBy(desc(education.startDate)).all();
  return <EducationListClient data={all} />;
}
