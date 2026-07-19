export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customSections, customSectionItems } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const sections = await db.select().from(customSections).orderBy(asc(customSections.orderIndex)).all();
  const items = await db.select().from(customSectionItems).all();
  const result = sections.map((s) => ({
    ...s,
    items: items.filter((i) => i.sectionId === s.id).sort((a, b) => a.orderIndex - b.orderIndex),
  }));
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const now = Math.floor(Date.now() / 1000);

  const result = await db
    .insert(customSections)
    .values({ ...body, createdAt: now, updatedAt: now })
    .returning()
    .get();

  return NextResponse.json(result);
}
