export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certificates } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const results = await db
    .select()
    .from(certificates)
    .orderBy(asc(certificates.orderIndex))
    .all();

  return NextResponse.json(results);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const now = Math.floor(Date.now() / 1000);

  const result = await db
    .insert(certificates)
    .values({
      ...body,
      createdAt: now,
    })
    .returning()
    .get();

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { items } = body as { items: { id: number; orderIndex: number }[] };

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items array is required" }, { status: 400 });
  }

  for (const item of items) {
    await db
      .update(certificates)
      .set({ orderIndex: item.orderIndex })
      .where(eq(certificates.id, item.id))
      .run();
  }

  const updated = await db.select().from(certificates).orderBy(asc(certificates.orderIndex));
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  db.delete(certificates).where(eq(certificates.id, Number(id))).run();

  return NextResponse.json({ ok: true });
}
