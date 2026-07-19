export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { personalInfo } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const result = await db.select().from(personalInfo).where(eq(personalInfo.locale, locale)).get();

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const locale = body.locale || "en";
  const now = Math.floor(Date.now() / 1000);

  const existing = await db.select().from(personalInfo).where(eq(personalInfo.locale, locale)).get();

  let result;
  if (existing) {
    result = await db
      .update(personalInfo)
      .set({ ...body, updatedAt: now })
      .where(eq(personalInfo.id, existing.id))
      .returning()
      .get();
  } else {
    result = await db
      .insert(personalInfo)
      .values({ ...body, locale, createdAt: now, updatedAt: now })
      .returning()
      .get();
  }

  return NextResponse.json(result);
}
