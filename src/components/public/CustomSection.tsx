"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Award, Briefcase, GraduationCap, Shield, Rocket, Users, Lightbulb, Target, Heart, Zap, Star, ArrowRight } from "lucide-react";
import type { CustomSection, CustomSectionItem } from "@/lib/queries/portfolio";
import { parseJsonArray, parseJsonObject } from "@/lib/queries/portfolio";

interface CustomSectionProps {
  section: CustomSection;
  items: CustomSectionItem[];
}

const iconMap: Record<string, React.ElementType> = {
  Code, Award, Briefcase, GraduationCap, Shield, Rocket, Users, Lightbulb, Target, Heart, Zap, Star,
};

const colorMap: Record<string, { icon: string; bg: string; border: string }> = {
  brand: { icon: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30", border: "border-brand-200 dark:border-brand-800/40" },
  emerald: { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800/40" },
  violet: { icon: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30", border: "border-violet-200 dark:border-violet-800/40" },
  amber: { icon: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800/40" },
  blue: { icon: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800/40" },
  rose: { icon: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30", border: "border-rose-200 dark:border-rose-800/40" },
  slate: { icon: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700" },
};

function CardsLayout({ items }: { items: CustomSectionItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const IconComp = item.icon ? iconMap[item.icon] || Code : null;
        const colors = colorMap[item.color || "brand"] || colorMap.brand;
        const tags = parseJsonArray(item.tags);
        const meta = parseJsonObject<Record<string, string>>(item.metadata);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass-card card-hover p-6 flex flex-col"
          >
            {item.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-xl">
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
            )}
            {IconComp && (
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.icon} mb-4`}>
                <IconComp className="h-6 w-6" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
            {item.subtitle && <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-2">{item.subtitle}</p>}
            {item.description && <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{item.description}</p>}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {tags.map((tag: string) => (
                  <span key={tag} className="chip text-xs px-2 py-0.5">{tag}</span>
                ))}
              </div>
            )}
            {item.linkUrl && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                  {item.linkLabel || "En savoir plus"}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                </a>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function GridLayout({ items }: { items: CustomSectionItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const IconComp = item.icon ? iconMap[item.icon] || Code : null;
        const colors = colorMap[item.color || "brand"] || colorMap.brand;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass-card card-hover p-5 text-center"
          >
            {IconComp && (
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.icon} mb-3`}>
                <IconComp className="h-5 w-5" />
              </div>
            )}
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
            {item.description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>}
          </motion.div>
        );
      })}
    </div>
  );
}

function ListLayout({ items }: { items: CustomSectionItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const IconComp = item.icon ? iconMap[item.icon] || Code : null;
        const colors = colorMap[item.color || "brand"] || colorMap.brand;
        const tags = parseJsonArray(item.tags);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass-card card-hover p-5 flex items-start gap-4"
          >
            {IconComp && (
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.icon} flex-shrink-0`}>
                <IconComp className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h4>
              {item.subtitle && <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">{item.subtitle}</p>}
              {item.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((tag: string) => (
                    <span key={tag} className="chip text-xs px-2 py-0.5">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            {item.linkUrl && (
              <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex-shrink-0">
                {item.linkLabel || "Voir"}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </a>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function TimelineLayout({ items }: { items: CustomSectionItem[] }) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-brand-400/40 to-transparent" />
      <div className="space-y-8">
        {items.map((item, index) => {
          const IconComp = item.icon ? iconMap[item.icon] || Code : null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative pl-20"
            >
              <div className="absolute left-[6px] top-3 w-4 h-4 rounded-full bg-brand-500 border-[3px] border-white dark:border-slate-950 shadow-sm" />
              <div className="glass-card p-5">
                <div className="flex items-start gap-3">
                  {IconComp && <IconComp className="h-5 w-5 text-brand-600 dark:text-brand-400 mt-0.5 flex-shrink-0" />}
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                    {item.subtitle && <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.description}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function CustomSectionBlock({ section, items }: CustomSectionProps) {
  const visibleItems = items
    .filter((item) => item.visible)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  if (visibleItems.length === 0) return null;

  const Layout = {
    cards: CardsLayout,
    grid: GridLayout,
    list: ListLayout,
    timeline: TimelineLayout,
  }[section.layout] || CardsLayout;

  return (
    <section id={section.slug} className="section-padding relative">
      <div className="mx-auto max-w-6xl container-px">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-12"
        >
          {section.badge && (
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4">
              {section.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {section.description}
            </p>
          )}
        </motion.div>

        <Layout items={visibleItems} />
      </div>
    </section>
  );
}
