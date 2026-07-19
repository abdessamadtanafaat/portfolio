export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { volunteering } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { VolunteeringListClient } from "./VolunteeringListClient";

export default async function VolunteeringPage() {
  const all = await db.select().from(volunteering).orderBy(asc(volunteering.orderIndex)).all();

  return <VolunteeringListClient data={all} />;
}
