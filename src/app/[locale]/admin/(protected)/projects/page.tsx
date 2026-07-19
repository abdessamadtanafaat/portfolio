export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { ProjectsListClient } from "./ProjectsListClient";

export default async function ProjectsListPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const allProjects = await db.select().from(projects).where(eq(projects.locale, locale)).orderBy(asc(projects.orderIndex)).all();
  return <ProjectsListClient data={allProjects} locale={locale} />;
}
