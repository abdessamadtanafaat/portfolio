export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { softSkills } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { SoftSkillsListClient } from "./SoftSkillsListClient";

export default async function SoftSkillsPage() {
  const all = await db.select().from(softSkills).orderBy(asc(softSkills.orderIndex)).all();

  return <SoftSkillsListClient data={all} />;
}
