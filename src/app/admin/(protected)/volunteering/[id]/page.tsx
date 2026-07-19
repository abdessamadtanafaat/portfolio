export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { volunteering } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { VolunteeringForm } from "./VolunteeringForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditVolunteeringPage({ params }: Props) {
  const { id } = await params;
  const entry = await db.select().from(volunteering).where(eq(volunteering.id, Number(id))).get();
  if (!entry) notFound();
  return <VolunteeringForm data={entry} />;
}
