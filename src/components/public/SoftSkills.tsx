"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getIconComponent } from "@/components/admin/editors/IconPicker";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { GradientOrbs } from "@/components/effects/GradientOrbs";
import { HeroOrbs } from "@/components/effects/FloatingOrbs";
import type { SoftSkill, HomepageContent } from "@/lib/queries/portfolio";
import { useTranslations } from "@/i18n/useTranslations";

interface SoftSkillsProps {
  skills: SoftSkill[];
  homepage: HomepageContent | null;
}

export function SoftSkills({ skills, homepage }: SoftSkillsProps) {
  const { t } = useTranslations();
  if (skills.length === 0) return null;

  const softSkills = skills
    .filter((s) => s.category === "soft_skill")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const hobbies = skills
    .filter((s) => s.category === "hobby")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="softskills" className="section-padding relative mesh-gradient">
      <HeroOrbs />
      <GradientOrbs />
      <div className="mx-auto max-w-6xl container-px">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-800/30">
              {homepage?.softSkillsBadge || t("softSkills.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {homepage?.softSkillsTitle || t("softSkills.title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {homepage?.softSkillsDescription || t("softSkills.description")}
            </p>
          </div>
        </ScrollReveal>

        {softSkills.length > 0 && (
          <ScrollReveal delay={0.1}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 text-center">
              {t("softSkills.softSkillsTitle")}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {softSkills.map((skill, index) => {
                const IconComp = skill.icon ? getIconComponent(skill.icon) : Sparkles;
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.04, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="glass-card inline-flex items-center gap-2 px-4 py-2.5 rounded-full"
                  >
                    <IconComp className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>
        )}

        {hobbies.length > 0 && (
          <ScrollReveal delay={0.2}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 text-center">
              {t("softSkills.hobbiesTitle")}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {hobbies.map((skill, index) => {
                const IconComp = skill.icon ? getIconComponent(skill.icon) : Sparkles;
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.04, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="glass-card inline-flex items-center gap-2 px-4 py-2.5 rounded-full"
                  >
                    <IconComp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
