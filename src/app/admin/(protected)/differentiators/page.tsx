export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { differentiators } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { DifferentiatorsListClient } from "./DifferentiatorsListClient";

export default async function DifferentiatorsPage() {
  const all = await db
    .select()
    .from(differentiators)
    .orderBy(asc(differentiators.orderIndex))
    .all();
  return <DifferentiatorsListClient data={all} />;
}
