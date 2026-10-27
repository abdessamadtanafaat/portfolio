"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/effects/TiltCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import type { Certificate, HomepageContent } from "@/lib/queries/portfolio";
import { tsToYear, parseJsonArray } from "@/lib/portfolio-format";
import { useTranslations } from "@/i18n/useTranslations";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionHeader } from "@/components/public/SectionHeader";

interface CertificatesProps {
  certificates: Certificate[];
  homepage: HomepageContent | null;
}

export function Certificates({ certificates, homepage }: CertificatesProps) {
  const { t } = useTranslations();
  const inProgress = parseJsonArray(homepage?.certificatesInProgress ?? null);

  return (
    <SectionShell id="certificates" variant="muted" className="section-divider">
      <SectionHeader
        eyebrow={homepage?.certificatesBadge || t("certificates.badge")}
        title={homepage?.certificatesTitle || t("certificates.title")}
        subtitle={homepage?.certificatesDescription || t("certificates.description")}
      />

      <ScrollReveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <ScrollReveal key={cert.name} as="div" className="flex h-full">
              <TiltCard className="flex h-full w-full">
                <motion.article
                  whileHover={{ scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="group glass-card card-hover relative flex flex-col h-full w-full p-6 overflow-hidden"
                >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 rounded-full dark:bg-amber-900/30 dark:text-amber-400">{t("certificates.certification")}</span>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{cert.name}</h3>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{tsToYear(cert.issueDate)}</span>
                  {cert.expiryDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Exp. {tsToYear(cert.expiryDate)}</span>}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{cert.issuer}</span>
                  {cert.credentialUrl && (
                    <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{t("certificates.verify")}</span>
                      <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  )}
                </div>
                </motion.article>
              </TiltCard>
            </ScrollReveal>
          ))}
      </ScrollReveal>

        {inProgress.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("certificates.keepLearning")}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {inProgress.map((cert) => (
                  <motion.span
                    key={cert}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/30 text-brand-600 dark:text-brand-400 text-sm font-medium border border-brand-200/50 dark:border-brand-800/40"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                    {cert}
                  </motion.span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
    </SectionShell>
  );
}
