export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { personalInfo } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const result = await db.select().from(personalInfo).get();

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
  const now = Math.floor(Date.now() / 1000);

  const existing = await db.select().from(personalInfo).get();

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
      .values({ ...body, id: 1, createdAt: now, updatedAt: now })
      .returning()
      .get();
  }

  return NextResponse.json(result);
}
