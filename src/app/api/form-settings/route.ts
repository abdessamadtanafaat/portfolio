export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formSettings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const [settings] = await db.select().from(formSettings).where(eq(formSettings.locale, locale));
  return NextResponse.json(settings ?? null);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const locale = body.locale || "en";
  const now = Math.floor(Date.now() / 1000);

  const [existing] = await db.select().from(formSettings).where(and(eq(formSettings.locale, locale), eq(formSettings.formType, body.formType || "contact")));

  if (existing) {
    const [updated] = await db
      .update(formSettings)
      .set({ ...body, updatedAt: now })
      .where(eq(formSettings.id, existing.id))
      .returning();
    return NextResponse.json(updated);
  }

  const [inserted] = await db
    .insert(formSettings)
    .values({ ...body, locale, createdAt: now, updatedAt: now })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
