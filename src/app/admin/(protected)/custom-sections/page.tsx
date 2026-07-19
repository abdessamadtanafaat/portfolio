export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { customSections, customSectionItems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { CustomSectionsListClient } from "./CustomSectionsListClient";

export default async function CustomSectionsPage() {
  const sections = await db.select().from(customSections).orderBy(asc(customSections.orderIndex)).all();
  const items = await db.select().from(customSectionItems).all();
  const sectionsWithItems = sections.map((s) => ({
    ...s,
    items: items.filter((i) => i.sectionId === s.id).sort((a, b) => a.orderIndex - b.orderIndex),
  }));
  return <CustomSectionsListClient sections={sectionsWithItems} />;
}
