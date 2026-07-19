export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const results = await db
    .select()
    .from(skills)
    .orderBy(asc(skills.orderIndex))
    .all();

  const grouped = results.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof results>);

  return NextResponse.json(grouped);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const now = Math.floor(Date.now() / 1000);

  const result = await db
    .insert(skills)
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
      .update(skills)
      .set({ orderIndex: item.orderIndex })
      .where(eq(skills.id, item.id))
      .run();
  }

  const updated = await db.select().from(skills).orderBy(asc(skills.orderIndex));
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

  db.delete(skills).where(eq(skills.id, Number(id))).run();

  return NextResponse.json({ ok: true });
}
