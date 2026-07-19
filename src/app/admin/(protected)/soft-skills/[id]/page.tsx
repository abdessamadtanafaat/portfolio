export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { softSkills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SoftSkillForm } from "./SoftSkillForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSoftSkillPage({ params }: Props) {
  const { id } = await params;
  const skill = await db.select().from(softSkills).where(eq(softSkills.id, Number(id))).get();
  if (!skill) notFound();
  return <SoftSkillForm data={skill} />;
}
