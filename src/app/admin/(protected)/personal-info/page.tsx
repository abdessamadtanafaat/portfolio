export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { personalInfo } from "@/lib/db/schema";
import { PersonalInfoForm } from "./PersonalInfoForm";

export default async function PersonalInfoPage() {
  const info = await db.select().from(personalInfo).get();
  return <PersonalInfoForm data={info ?? null} />;
}
