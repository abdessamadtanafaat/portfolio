export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const result = await db.select().from(siteSettings).get();
  return NextResponse.json(result || null);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const now = Math.floor(Date.now() / 1000);
  const existing = await db.select().from(siteSettings).get();

  let result;
  if (existing) {
    result = await db.update(siteSettings).set({ ...body, updatedAt: now }).where(eq(siteSettings.id, existing.id)).returning().get();
  } else {
    result = await db.insert(siteSettings).values({ ...body, id: 1, createdAt: now, updatedAt: now }).returning().get();
  }

  return NextResponse.json(result);
}
