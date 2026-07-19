export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { languages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { LanguageForm } from "./LanguageForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLanguagePage({ params }: Props) {
  const { id } = await params;
  const language = await db.select().from(languages).where(eq(languages.id, Number(id))).get();
  if (!language) notFound();
  return <LanguageForm data={language} />;
}
