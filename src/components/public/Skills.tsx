"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Database, Server, Terminal, Layers } from "lucide-react";
import { Tool } from "@/components/icons";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { TiltCard } from "@/components/effects/TiltCard";
import type { Skill, HomepageContent, Technology } from "@/lib/queries/portfolio";

interface SkillsProps {
  skills: Skill[];
  homepage: HomepageContent | null;
  technologies: Technology[];
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  frontend: { label: "Frontend", icon: Code, color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
  backend: { label: "Backend", icon: Server, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  cms: { label: "CMS / Drupal", icon: Layers, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
  devops: { label: "DevOps / Cloud", icon: Terminal, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  database: { label: "Bases de données", icon: Database, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  tools: { label: "Outils & Méthodes", icon: Tool, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
  testing: { label: "Testing", icon: Code, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30" },
};

const categoryOrder = ["frontend", "backend", "cms", "devops", "database", "tools", "testing"];

function proficiencyToPercent(level: number): number {
  const map: Record<number, number> = { 5: 90, 4: 85, 3: 80, 2: 75, 1: 70 };
  return map[level] ?? 80;
}

export function Skills({ skills, homepage, technologies }: SkillsProps) {
  const skillCategories = categoryOrder
    .filter((key) => skills.some((s) => s.category === key))
    .map((key) => ({
      key,
      ...categoryConfig[key],
      skills: skills.filter((s) => s.category === key).sort((a, b) => a.orderIndex - b.orderIndex),
    }));

  const primaryTechs = technologies.filter((t) => t.primary);

  return (
    <section id="skills" className="section-padding relative mesh-gradient">
      <div className="mx-auto max-w-6xl container-px">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-800/30">
              {homepage?.skillsBadge || "Compétences"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {homepage?.skillsTitle || "Stack technique & Expertise"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {homepage?.skillsDescription || "Une expertise transversale couvrant tout le cycle de vie du développement logiciel."}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <ScrollReveal key={category.key} delay={index * 0.06}>
              <TiltCard tiltAmount={4} glareEnabled={false}>
              <div className="glass-card p-6 h-full">
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
        </div>

        {primaryTechs.length > 0 && (
          <ScrollReveal delay={0.4} className="mt-14">
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-6">
              Technologies principales
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {primaryTechs.map((tech) => (
                <span key={tech.name} className="chip px-3 py-1.5">{tech.name}</span>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
