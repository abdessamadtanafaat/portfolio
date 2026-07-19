export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { navItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { HeaderForm } from "./HeaderForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHeaderPage({ params }: PageProps) {
  const { id } = await params;
  const item = await db.select().from(navItems).where(eq(navItems.id, Number(id))).get();
  if (!item) notFound();
  return <HeaderForm data={item} />;
}
