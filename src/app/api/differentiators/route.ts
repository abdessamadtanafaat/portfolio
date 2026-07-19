export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { differentiators } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const allDifferentiators = await db.select().from(differentiators).orderBy(asc(differentiators.orderIndex));
  return NextResponse.json(allDifferentiators);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const now = Math.floor(Date.now() / 1000);

  const [inserted] = await db
    .insert(differentiators)
    .values({ ...body, createdAt: now })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
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
      .update(differentiators)
      .set({ orderIndex: item.orderIndex })
      .where(eq(differentiators.id, item.id))
      .run();
  }

  const updated = await db.select().from(differentiators).orderBy(asc(differentiators.orderIndex));
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await db.delete(differentiators).where(eq(differentiators.id, Number(id)));

  return NextResponse.json({ success: true });
}
