export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { customSections, customSectionItems } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { CustomSectionsListClient } from "./CustomSectionsListClient";

export default async function CustomSectionsPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const sections = await db.select().from(customSections).where(eq(customSections.locale, locale)).orderBy(asc(customSections.orderIndex)).all();
  const items = await db.select().from(customSectionItems).all();
  const sectionsWithItems = sections.map((s) => ({
    ...s,
    items: items.filter((i) => i.sectionId === s.id).sort((a, b) => a.orderIndex - b.orderIndex),
  }));
  return <CustomSectionsListClient sections={sectionsWithItems} locale={locale} />;
}
