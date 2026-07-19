"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Database, Server, Terminal, Layers } from "lucide-react";
import { Tool } from "@/components/icons";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { TiltCard } from "@/components/effects/TiltCard";
import type { Skill, HomepageContent, Technology } from "@/lib/queries/portfolio";
import { useTranslations } from "@/i18n/useTranslations";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionHeader } from "@/components/public/SectionHeader";

interface SkillsProps {
  skills: Skill[];
  homepage: HomepageContent | null;
  technologies: Technology[];
}

const categoryOrder = ["frontend", "backend", "cms", "devops", "database", "tools", "testing"];

function proficiencyToPercent(level: number): number {
  const map: Record<number, number> = { 5: 90, 4: 85, 3: 80, 2: 75, 1: 70 };
  return map[level] ?? 80;
}

export function Skills({ skills, homepage, technologies }: SkillsProps) {
  const { t } = useTranslations();

  const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    frontend: { label: t("skills.categories.frontend"), icon: Code, color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
    backend: { label: t("skills.categories.backend"), icon: Server, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    cms: { label: t("skills.categories.cms"), icon: Layers, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
    devops: { label: t("skills.categories.devops"), icon: Terminal, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
    database: { label: t("skills.categories.database"), icon: Database, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
    tools: { label: t("skills.categories.tools"), icon: Tool, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
    testing: { label: t("skills.categories.testing"), icon: Code, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30" },
  };

  const skillCategories = categoryOrder
    .filter((key) => skills.some((s) => s.category === key))
    .map((key) => ({
      key,
      ...categoryConfig[key],
      skills: skills.filter((s) => s.category === key).sort((a, b) => a.orderIndex - b.orderIndex),
    }));

  const primaryTechs = technologies.filter((t) => t.primary);

  return (
    <SectionShell id="skills" variant="muted" className="section-divider">
      <SectionHeader
        eyebrow={homepage?.skillsBadge || t("skills.badge")}
        title={homepage?.skillsTitle || t("skills.title")}
        subtitle={homepage?.skillsDescription || t("skills.description")}
      />

      <ScrollReveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <ScrollReveal key={category.key} as="div">
              <TiltCard tiltAmount={4} glareEnabled={false} className="h-full">
              <div className="glass-card p-6 h-full group hover:border-brand-300/70 dark:hover:border-brand-700/60 hover:shadow-brand-500/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${category.bg}`}>
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{category.label}</h3>
              </div>
              <div className="space-y-3.5">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.05 + skillIndex * 0.03, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">{proficiencyToPercent(skill.proficiency)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${proficiencyToPercent(skill.proficiency)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 + skillIndex * 0.03, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-400 dark:to-brand-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>
              </TiltCard>
            </ScrollReveal>
          ))}
      </ScrollReveal>

        {primaryTechs.length > 0 && (
          <ScrollReveal delay={0.4} className="mt-14">
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-6">
              {t("skills.mainTechs")}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {primaryTechs.map((tech) => (
                <span key={tech.name} className="chip px-3 py-1.5">{tech.name}</span>
              ))}
            </div>
          </ScrollReveal>
        )}
    </SectionShell>
  );
}
