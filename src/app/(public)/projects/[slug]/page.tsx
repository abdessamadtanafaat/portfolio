export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { projects, technologies, projectTechnologies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Github } from "@/components/icons";
import { Metadata } from "next";

function parseJsonArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  const project = rows[0];
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Portfolio`,
    description: project.shortDescription ?? project.title,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  const project = rows[0];

  if (!project) notFound();

  const techLinks = await db
    .select({ technologyId: projectTechnologies.technologyId })
    .from(projectTechnologies)
    .where(eq(projectTechnologies.projectId, project.id));

  const techIds = techLinks.map((l) => l.technologyId);
  const techs = techIds.length
    ? await db.select().from(technologies).where(
        techIds.length === 1
          ? eq(technologies.id, techIds[0])
          : undefined
      )
    : [];

  const highlights = parseJsonArray(project.description);

  const statusColors: Record<string, string> = {
    production: "bg-emerald-500",
    staging: "bg-amber-500",
    prototype: "bg-blue-500",
    archived: "bg-slate-500",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-20">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {project.coverImageUrl && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-100 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 capitalize">
            {project.category}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 capitalize">
            <span className={`h-1.5 w-1.5 rounded-full ${statusColors[project.status] ?? "bg-slate-400"}`} />
            {project.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {project.title}
        </h1>

        {project.subtitle && (
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
            {project.subtitle}
          </p>
        )}

        {project.shortDescription && (
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
            {project.shortDescription}
          </p>
        )}

        {highlights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Details</h2>
            <ul className="space-y-3">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {techs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {techs.map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Github className="h-4 w-4" />
              Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
