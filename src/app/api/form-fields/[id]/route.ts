export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formFields } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const field = await db.select().from(formFields).where(eq(formFields.id, Number(id))).get();
  if (!field) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(field);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { createdAt: _, ...rest } = body;

  const updated = await db
    .update(formFields)
    .set({ ...rest })
    .where(eq(formFields.id, Number(id)))
    .returning()
    .get();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
