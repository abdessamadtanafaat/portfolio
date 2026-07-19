"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, MapPin, Calendar } from "lucide-react";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import type { Education, Certificate, HomepageContent } from "@/lib/queries/portfolio";
import { formatEducationDate, tsToYear } from "@/lib/queries/portfolio";

interface EducationProps {
  education: Education[];
  certificates: Certificate[];
  homepage: HomepageContent | null;
}

export function Education({ education, certificates, homepage }: EducationProps) {
  return (
    <section id="education" className="relative py-24 md:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      <div className="noise-overlay" />

      <div className="relative mx-auto max-w-6xl container-px">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4">
              {homepage?.educationBadge || "Formation & Certifications"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {homepage?.educationTitle || "Formation & Certifications"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {homepage?.educationDescription || "Un parcours académique solide complété par des certifications reconnues."}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Diplomas */}
          <ScrollReveal delay={0.1} direction="left">
            <div className="glass-card p-6 sm:p-7 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/25">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Diplômes</h3>
              </div>
              <div className="space-y-5">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 + index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="relative pl-5 border-l-2 border-gradient-to-b from-violet-500 to-purple-500"
                  >
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-violet-500 to-purple-500 rounded-full" />
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>{formatEducationDate(edu.startDate, edu.endDate)}</span>
                      {edu.location && (
                        <>
                          <span className="mx-1">&bull;</span>
                          <MapPin className="h-3 w-3" />
                          <span>{edu.location}</span>
                        </>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">{edu.degree}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{edu.field}</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{edu.institution}</p>
                    {edu.honors && (
                      <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                        <Award className="h-3 w-3" /><span>{edu.honors}</span>
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Certifications */}
          <ScrollReveal delay={0.2} direction="right">
            <div className="glass-card p-6 sm:p-7 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Certifications</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="group glass-card card-hover p-4 relative overflow-hidden"
                  >
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{cert.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cert.issuer}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                          <span>{tsToYear(cert.issueDate)}</span>
                          {cert.expiryDate && <><span>&bull;</span><span>Exp. {tsToYear(cert.expiryDate)}</span></>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
