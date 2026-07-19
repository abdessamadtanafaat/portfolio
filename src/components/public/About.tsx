"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Award, Briefcase, GraduationCap, Shield, Rocket, Users, Lightbulb, Target, Zap } from "lucide-react";
import { TiltCard } from "@/components/effects/TiltCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { GradientOrbs } from "@/components/effects/GradientOrbs";
import { HeroOrbs } from "@/components/effects/FloatingOrbs";
import type { HomepageContent, Differentiator } from "@/lib/queries/portfolio";
import { parseJsonObject } from "@/lib/queries/portfolio";
import { useTranslations, type TranslationKey } from "@/i18n/useTranslations";

const iconMap: Record<string, React.ElementType> = {
  Code, Award, Briefcase, GraduationCap, Shield, Rocket, Users, Lightbulb, Target, Zap,
};

interface AboutProps {
  name?: string;
  homepage: HomepageContent | null;
  differentiators: Differentiator[];
}

interface AboutCard {
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

function getDefaultCards(t: (key: TranslationKey) => string): AboutCard[] {
  return [
    { icon: "Code", title: t("about.cards.fullstack.title"), description: t("about.cards.fullstack.description"), color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
    { icon: "Briefcase", title: t("about.cards.cms.title"), description: t("about.cards.cms.description"), color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { icon: "GraduationCap", title: t("about.cards.cloud.title"), description: t("about.cards.cloud.description"), color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
  ];
}

const colorMap: Record<string, { icon: string; bg: string; glow: string }> = {
  brand: { icon: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30", glow: "shadow-brand-500/20 dark:shadow-brand-400/20" },
  emerald: { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", glow: "shadow-emerald-500/20 dark:shadow-emerald-400/20" },
  violet: { icon: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30", glow: "shadow-violet-500/20 dark:shadow-violet-400/20" },
  amber: { icon: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30", glow: "shadow-amber-500/20 dark:shadow-amber-400/20" },
};

export function About({ homepage, differentiators }: AboutProps) {
  const { t } = useTranslations();
  const defaultCards = getDefaultCards(t);
  const aboutCards = parseJsonObject<AboutCard[]>(homepage?.aboutCards ?? null) || defaultCards;

  return (
    <section id="about" className="section-padding relative">
      <HeroOrbs />
      <GradientOrbs />
      <div className="mx-auto max-w-6xl container-px">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-800/30">
              {homepage?.aboutBadge || t("about.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {homepage?.aboutTitle || t("about.title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {homepage?.aboutDescription || t("about.description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {aboutCards.map((card, index) => {
            const IconComp = iconMap[card.icon] || Code;
            const cardColor = card.color || "text-brand-600 dark:text-brand-400";
            const cardBg = card.bg || "bg-brand-50 dark:bg-brand-900/30";
            const colorKey = cardColor.includes("brand") ? "brand" : cardColor.includes("emerald") ? "emerald" : "violet";
            return (
              <ScrollReveal key={card.title} delay={index * 0.1}>
                <TiltCard tiltAmount={6}>
                  <div className="glass-card p-6 sm:p-8 text-center h-full">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${cardBg} ${cardColor} mb-5 shadow-lg ${colorMap[colorKey]?.glow || ""}`}
                    >
                      <IconComp className="h-7 w-7" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{card.description}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>

        {differentiators.length > 0 && (
          <div className="mt-16">
            <ScrollReveal>
              <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
                {homepage?.differentiatorsTitle || t("about.differentiatorsTitle")}
              </h3>
            </ScrollReveal>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {differentiators.map((diff, index) => {
                const IconComp = iconMap[diff.icon] || Award;
                const colors = colorMap[diff.color || "brand"] || colorMap.brand;
                return (
                  <ScrollReveal key={diff.id} delay={index * 0.08}>
                    <TiltCard tiltAmount={4} glareEnabled={false}>
                      <div className="glass-card p-5 h-full">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.icon} mb-3 shadow-md ${colors.glow}`}
                        >
                          <IconComp className="h-5 w-5" />
                        </motion.div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{diff.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{diff.description}</p>
                      </div>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
