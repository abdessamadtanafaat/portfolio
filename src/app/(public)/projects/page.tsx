import type { Metadata } from "next";
import { ProjectsPageContent } from "./ProjectsPageContent";
import { getProjectsForPage } from "@/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Projets | Abdessamad Tanafaat",
  description:
    "Découvrez mes projets en production : sites institutionnels, back-office multi-tenant, applications RH et plus encore.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjectsForPage();
  return <ProjectsPageContent projects={projects} />;
}
