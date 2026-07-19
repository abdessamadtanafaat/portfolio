"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { TiltCard } from "@/components/effects/TiltCard";
import type { Language, HomepageContent } from "@/lib/queries/portfolio";

interface LanguagesProps {
  languages: Language[];
  homepage: HomepageContent | null;
}

export function Languages({ languages, homepage }: LanguagesProps) {
  if (languages.length === 0) return null;

  return (
    <section id="languages" className="section-padding relative mesh-gradient">
      <div className="mx-auto max-w-6xl container-px">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-800/30">
              {homepage?.languagesBadge || "Langues"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {homepage?.languagesTitle || "Compétences linguistiques"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {homepage?.languagesDescription || "Maîtrise des langues et capacités de communication multilingue."}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang, index) => (
            <ScrollReveal key={lang.id} delay={index * 0.06}>
              <TiltCard tiltAmount={4} glareEnabled={false}>
                <div className="glass-card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30">
                      <Globe className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {lang.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {lang.level}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 dark:text-slate-500">Maîtrise</span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                        {lang.proficiency}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 + index * 0.05, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-400 dark:to-brand-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
