export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/queries/portfolio";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Github } from "@/components/icons";
import { Metadata } from "next";
import { locales } from "@/i18n/config";
import en from "../../../../../messages/en.json";
import fr from "../../../../../messages/fr.json";
import ar from "../../../../../messages/ar.json";

const messages: Record<string, typeof en> = { en, fr, ar };

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);
  if (!project) return { title: "Project Not Found" };

  const title = `${project.title} | Portfolio`;
  const description = project.shortDescription ?? project.title;

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `/${loc}/projects/${slug}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      images: project.coverImageUrl ? [project.coverImageUrl] : undefined,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);
  const t = (key: string): string => {
    const msgs = messages[locale] || messages.en;
    const keys = key.split(".");
    let val: unknown = msgs;
    for (const k of keys) {
      if (val && typeof val === "object") val = (val as Record<string, unknown>)[k];
      else return key;
    }
    return typeof val === "string" ? val : key;
  };

  if (!project) notFound();

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
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("projectDetail.backToProjects")}
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
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t("projectDetail.details")}</h2>
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

        {project.technologies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{t("projectDetail.technologies")}</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
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
              {t("projectDetail.liveDemo")}
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
              {t("projectDetail.sourceCode")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
