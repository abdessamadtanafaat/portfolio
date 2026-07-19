export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoSettings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const all = await db.select().from(seoSettings).where(eq(seoSettings.locale, locale)).all();
  return NextResponse.json(all);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const locale = body.locale || "en";
  const now = Math.floor(Date.now() / 1000);

  if (body.id) {
    const result = await db.update(seoSettings).set({ ...body, updatedAt: now }).where(eq(seoSettings.id, body.id)).returning().get();
    return NextResponse.json(result);
  }

  const existing = await db.select().from(seoSettings).where(and(eq(seoSettings.pagePath, body.pagePath), eq(seoSettings.locale, locale))).get();
  if (existing) {
    const result = await db.update(seoSettings).set({ ...body, updatedAt: now }).where(eq(seoSettings.id, existing.id)).returning().get();
    return NextResponse.json(result);
  }

  const result = await db.insert(seoSettings).values({ ...body, locale, createdAt: now, updatedAt: now }).returning().get();
  return NextResponse.json(result, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.delete(seoSettings).where(eq(seoSettings.id, id)).run();
  return NextResponse.json({ ok: true });
}
