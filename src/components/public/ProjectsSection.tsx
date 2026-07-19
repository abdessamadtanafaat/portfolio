"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";
import { Github } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TiltCard } from "@/components/effects/TiltCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { GradientOrbs } from "@/components/effects/GradientOrbs";
import { HeroOrbs } from "@/components/effects/FloatingOrbs";
import type { ProjectWithTech, HomepageContent } from "@/lib/queries/portfolio";
import { useTranslations } from "@/i18n/useTranslations";
import { locales, defaultLocale } from "@/i18n/config";

interface ProjectsSectionProps {
  projects: ProjectWithTech[];
  homepage: HomepageContent | null;
}

const categoryLabels: Record<string, string> = {
  fullstack: "Full Stack",
  frontend: "Frontend",
  backend: "Backend",
  cms: "CMS / Drupal",
  devops: "DevOps",
  mobile: "Mobile",
};

const categoryColors: Record<string, string> = {
  fullstack: "from-violet-500 to-purple-500",
  frontend: "from-blue-500 to-cyan-500",
  backend: "from-emerald-500 to-teal-500",
  cms: "from-orange-500 to-amber-500",
  devops: "from-rose-500 to-pink-500",
  mobile: "from-indigo-500 to-blue-500",
};

const statusColors: Record<string, string> = {
  production: "bg-emerald-500 shadow-emerald-500/50",
  staging: "bg-amber-500 shadow-amber-500/50",
  prototype: "bg-blue-500 shadow-blue-500/50",
  archived: "bg-slate-400 shadow-slate-400/50",
};

export function ProjectsSection({ projects, homepage }: ProjectsSectionProps) {
  const { t } = useTranslations();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const locale = segments[1] && locales.includes(segments[1] as typeof locales[number]) ? segments[1] : defaultLocale;
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <HeroOrbs />
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="noise-overlay" />
      <GradientOrbs />

      <div className="relative mx-auto max-w-6xl container-px">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4">
              {homepage?.projectsBadge || t("projects.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {homepage?.projectsTitle || t("projects.title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {homepage?.projectsDescription || t("projects.description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <TiltCard key={project.slug} className="flex h-full">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="glass-card card-hover relative flex h-full flex-col p-6"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${categoryColors[project.category] || "from-slate-400 to-slate-500"}`} />

                <div className="flex items-center justify-between mb-4">
                  <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    {categoryLabels[project.category] || project.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full shadow-lg ${statusColors[project.status] || "bg-slate-400"}`} />
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 capitalize">{project.status}</span>
                  </div>
                </div>

                <header className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">{project.subtitle}</p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">{project.title}</h3>
                  </div>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/40 dark:to-brand-800/40 text-brand-600 dark:text-brand-400 shadow-sm">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </header>

                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3 flex-1 mb-4">{project.shortDescription}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech.name} className="chip text-xs px-2 py-0.5">{tech.name}</span>
                  ))}
                  {project.technologies.length > 4 && <span className="chip text-xs px-2 py-0.5 text-slate-400">+{project.technologies.length - 4}</span>}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <Link href={`/${locale}/projects/${project.slug}`} className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                    {t("projects.viewProject")}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label={t("projects.viewOnGithub")}>
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            </TiltCard>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link href={`/${locale}/projects`} className="group/btn inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all duration-200">
              {homepage?.projectsCtaText || t("projects.viewAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
