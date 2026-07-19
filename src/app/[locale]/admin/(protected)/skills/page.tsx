export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { categoryColors } from "@/lib/constants";
import { SkillsListClient } from "./SkillsListClient";

export default async function SkillsListPage() {
  const all = await db.select().from(skills).orderBy(asc(skills.category), asc(skills.orderIndex)).all();

  return <SkillsListClient skills={all} categoryColors={categoryColors} />;
}
