export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { ProjectsListClient } from "./ProjectsListClient";

export default async function ProjectsListPage() {
  const allProjects = await db.select().from(projects).orderBy(asc(projects.orderIndex)).all();
  return <ProjectsListClient data={allProjects} />;
}
