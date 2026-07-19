import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formFields } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FormFieldForm } from "./FormFieldForm";

export default async function EditFormFieldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const field = await db.select().from(formFields).where(eq(formFields.id, Number(id))).get();
  if (!field) notFound();
  return <FormFieldForm data={field} />;
}
