export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteering } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const results = await db
    .select()
    .from(volunteering)
    .where(eq(volunteering.locale, locale))
    .orderBy(asc(volunteering.orderIndex))
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
    .insert(volunteering)
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
      .update(volunteering)
      .set({ orderIndex: item.orderIndex })
      .where(eq(volunteering.id, item.id))
      .run();
  }

  const updated = await db.select().from(volunteering).orderBy(asc(volunteering.orderIndex));
  return NextResponse.json(updated);
}
