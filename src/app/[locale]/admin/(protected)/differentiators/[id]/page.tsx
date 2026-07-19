export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { differentiators } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DifferentiatorForm } from "./DifferentiatorForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDifferentiatorPage({ params }: Props) {
  const { id } = await params;
  const differentiator = await db.select().from(differentiators).where(eq(differentiators.id, Number(id))).get();
  if (!differentiator) notFound();
  return <DifferentiatorForm data={differentiator} />;
}
