export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formSettings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const [settings] = await db.select().from(formSettings).where(eq(formSettings.id, 1));
  return NextResponse.json(settings ?? null);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const now = Math.floor(Date.now() / 1000);

  const [existing] = await db.select().from(formSettings).where(eq(formSettings.id, 1));

  if (existing) {
    const [updated] = await db
      .update(formSettings)
      .set({ ...body, updatedAt: now })
      .where(eq(formSettings.id, 1))
      .returning();
    return NextResponse.json(updated);
  }

  const [inserted] = await db
    .insert(formSettings)
    .values({ id: 1, ...body, createdAt: now, updatedAt: now })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
