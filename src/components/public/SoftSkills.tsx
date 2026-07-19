"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getIconComponent } from "@/components/admin/editors/IconPicker";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import type { SoftSkill, HomepageContent } from "@/lib/queries/portfolio";
import { useTranslations } from "@/i18n/useTranslations";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionHeader } from "@/components/public/SectionHeader";

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
    <SectionShell id="softskills" variant="default" className="section-divider">
      <SectionHeader
        eyebrow={homepage?.softSkillsBadge || t("softSkills.badge")}
        title={homepage?.softSkillsTitle || t("softSkills.title")}
        subtitle={homepage?.softSkillsDescription || t("softSkills.description")}
      />

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
                    whileHover={{ scale: 1.06, y: -2 }}
                    transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card inline-flex items-center gap-2 px-4 py-2.5 rounded-full hover:border-brand-300/70 dark:hover:border-brand-700/60 hover:shadow-brand-500/10"
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
                    whileHover={{ scale: 1.06, y: -2 }}
                    transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card inline-flex items-center gap-2 px-4 py-2.5 rounded-full hover:border-violet-300/70 dark:hover:border-violet-700/60 hover:shadow-violet-500/10"
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
    </SectionShell>
  );
}
