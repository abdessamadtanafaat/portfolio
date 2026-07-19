export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { formFields, formSettings } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { FormsListClient } from "./FormsListClient";

export default async function FormsPage() {
  const fields = await db.select().from(formFields).orderBy(asc(formFields.orderIndex)).all();
  const settings = await db.select().from(formSettings).get();
  return <FormsListClient fields={fields} settings={settings ?? null} />;
}
