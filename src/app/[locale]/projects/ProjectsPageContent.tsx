"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ArrowRight, Filter } from "lucide-react";
import { Github } from "@/components/icons";
import Link from "next/link";
import { useTranslations } from "@/i18n/useTranslations";
import type { ProjectWithTech } from "@/lib/queries/portfolio";

interface ProjectsPageContentProps {
  projects: ProjectWithTech[];
}

const statusColors: Record<string, string> = {
  production: "bg-emerald-500",
  staging: "bg-amber-500",
  prototype: "bg-blue-500",
  archived: "bg-slate-400",
};

const filterCategories = ["all", "fullstack", "cms", "frontend", "backend", "devops", "mobile"];

export function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  const { t, locale } = useTranslations();
  const [activeFilter, setActiveFilter] = useState("all");

  const categoryLabels: Record<string, string> = {
    all: t("projects.all"),
    fullstack: "Full Stack",
    frontend: "Frontend",
    backend: "Backend",
    cms: "CMS / Drupal",
    devops: "DevOps",
    mobile: "Mobile",
  };

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section className="section-padding relative min-h-screen">
      <div className="mx-auto max-w-6xl container-px">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4">
            {t("projectsPage.badge")}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t("projectsPage.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t("projectsPage.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-1 hidden sm:block" />
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeFilter === cat
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.article
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group glass-card card-hover relative flex h-full flex-col gap-4 p-6 overflow-hidden"
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    {categoryLabels[project.category] || project.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusColors[project.status] || "bg-slate-400"}`} />
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 capitalize">
                    {project.status}
                  </span>
                </div>

                <header className="flex items-start justify-between gap-3 pt-8">
                  <div>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                      {project.subtitle}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                </header>

                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">
                  {project.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech.name} className="chip text-xs px-2 py-0.5">
                      {tech.name}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="chip text-xs px-2 py-0.5 text-slate-400">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {project.featured && (
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <span>&#9733;</span> Featured
                  </div>
                )}

                <div className="mt-auto flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                  >
                    {t("projects.viewProject")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                  <a
                    href={project.repoUrl || `https://github.com/abdessamad-tanafaat/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={t("projects.viewOnGithub")}
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-400 dark:text-slate-500 py-20"
          >
            {t("projectsPage.noProjects")}
          </motion.p>
        )}
      </div>
    </section>
  );
}
