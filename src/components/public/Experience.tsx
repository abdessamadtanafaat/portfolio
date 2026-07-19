"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { Linkedin } from "@/components/icons";
import Link from "next/link";
import { formatExperienceDate, parseJsonArray } from "@/lib/queries/portfolio";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import type { Experience, HomepageContent, SocialLink } from "@/lib/queries/portfolio";
import { useTranslations } from "@/i18n/useTranslations";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionHeader } from "@/components/public/SectionHeader";

interface ExperienceProps {
  experiences: Experience[];
  homepage: HomepageContent | null;
  socialLinks: SocialLink[];
}

export function Experience({ experiences, homepage, socialLinks }: ExperienceProps) {
  const { t } = useTranslations();
  const linkedin = socialLinks.find((l) => l.platform === "linkedin");

  return (
    <SectionShell id="experience" variant="muted" className="section-divider">
      <SectionHeader
        eyebrow={homepage?.experienceBadge || t("experience.badge")}
        title={homepage?.experienceTitle || t("experience.title")}
        subtitle={homepage?.experienceDescription || t("experience.description")}
      />

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-brand-400/40 to-transparent" />
        <div className="space-y-10">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>

        {linkedin && (
          <ScrollReveal delay={0.3} className="mt-14 text-center">
            <Link
              href={linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary gap-2.5"
            >
              <Linkedin className="h-4 w-4" />
              {t("experience.viewLinkedin")}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </ScrollReveal>
        )}
    </SectionShell>
  );
}

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const { t, locale } = useTranslations();
  const highlights = parseJsonArray(exp.highlights);
  const technologies = parseJsonArray(exp.technologies);

  return (
    <ScrollReveal delay={index * 0.1} direction="left">
      <div className="relative pl-20 group">
        <div className="absolute left-[6px] top-3 w-4 h-4 rounded-full bg-brand-500 border-[3px] border-white dark:border-slate-950 shadow-sm shadow-brand-500/30 transition-transform duration-300 group-hover:scale-125" />
        <div className="glass-card p-6 sm:p-7 group-hover:border-brand-300/70 dark:group-hover:border-brand-700/60 group-hover:shadow-brand-500/10 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                {formatExperienceDate(exp.startDate, exp.endDate, exp.current, locale)} &bull; {exp.location}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
              <p className="text-brand-600 dark:text-brand-400 font-medium text-sm">{exp.company}</p>
            </div>
            {exp.current && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium whitespace-nowrap border border-emerald-200/50 dark:border-emerald-800/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                {t("experience.current")}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{exp.description}</p>
          {highlights.length > 0 && (
            <ul className="space-y-2 mb-4">
              {highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300 text-sm">
                  <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-brand-500 shadow-sm shadow-brand-500/30" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 8).map((tech) => (
                <span key={tech} className="chip">{tech}</span>
              ))}
              {technologies.length > 8 && (
                <span className="chip text-slate-400">+{technologies.length - 8}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
