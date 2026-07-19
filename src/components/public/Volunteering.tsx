"use client";

import React from "react";
import { Users } from "lucide-react";
import { getIconComponent } from "@/components/admin/editors/IconPicker";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { TiltCard } from "@/components/effects/TiltCard";
import { formatExperienceDate } from "@/lib/queries/portfolio";
import type { VolunteeringEntry, HomepageContent } from "@/lib/queries/portfolio";
import { useTranslations } from "@/i18n/useTranslations";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionHeader } from "@/components/public/SectionHeader";

interface VolunteeringProps {
  entries: VolunteeringEntry[];
  homepage: HomepageContent | null;
}

const colorMap: Record<string, { icon: string; bg: string }> = {
  brand: { icon: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
  emerald: { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  violet: { icon: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
  amber: { icon: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  rose: { icon: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30" },
  blue: { icon: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  slate: { icon: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
};

export function Volunteering({ entries, homepage }: VolunteeringProps) {
  const { t, locale } = useTranslations();
  if (entries.length === 0) return null;

  return (
    <SectionShell id="volunteering" variant="muted" className="section-divider">
      <SectionHeader
        eyebrow={homepage?.volunteeringBadge || t("volunteering.badge")}
        title={homepage?.volunteeringTitle || t("volunteering.title")}
        subtitle={homepage?.volunteeringDescription || t("volunteering.description")}
      />

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-brand-400/40 to-transparent" />
        <div className="space-y-10">
            {entries.map((entry, index) => {
              const IconComp = entry.icon ? getIconComponent(entry.icon) : Users;
              const colors = colorMap[entry.color || "brand"] || colorMap.brand;
              const dateStr = formatExperienceDate(entry.startDate, entry.endDate, !entry.endDate, locale);

              return (
                <ScrollReveal key={entry.id} delay={index * 0.1} direction="left">
                  <div className="relative pl-20 group">
                    <div className="absolute left-[6px] top-3 w-4 h-4 rounded-full bg-brand-500 border-[3px] border-white dark:border-slate-950 shadow-sm shadow-brand-500/30 transition-transform duration-300 group-hover:scale-125" />
                    <TiltCard tiltAmount={4} glareEnabled={false} className="h-full">
                      <div className="glass-card p-6 sm:p-7 group hover:border-brand-300/70 dark:hover:border-brand-700/60 hover:shadow-brand-500/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} flex-shrink-0`}>
                            <IconComp className={`h-5 w-5 ${colors.icon}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                  {entry.role}
                                </h3>
                                <p className="text-brand-600 dark:text-brand-400 font-medium text-sm">
                                  {entry.organization}
                                </p>
                              </div>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                {dateStr}
                              </span>
                            </div>
                            {entry.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                                {entry.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
    </SectionShell>
  );
}
