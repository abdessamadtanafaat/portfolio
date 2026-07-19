export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formFields } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const allFormFields = await db.select().from(formFields).where(eq(formFields.locale, locale)).orderBy(asc(formFields.orderIndex));
  return NextResponse.json(allFormFields);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const now = Math.floor(Date.now() / 1000);

  const [inserted] = await db
    .insert(formFields)
    .values({ ...body, createdAt: now })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await db.delete(formFields).where(eq(formFields.id, Number(id)));

  return NextResponse.json({ success: true });
}
