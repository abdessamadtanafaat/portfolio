"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail, Phone } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";
import Link from "next/link";
import { HeroOrbs } from "@/components/effects/FloatingOrbs";
import { ParticleField } from "@/components/effects/ParticleField";
import { GradientOrbs } from "@/components/effects/GradientOrbs";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { useTranslations } from "@/i18n/useTranslations";
import { locales } from "@/i18n/config";
import type { HomepageContent } from "@/lib/queries/portfolio";

function withLocale(locale: string, url: string | null | undefined): string | undefined {
  if (!url || url.startsWith("#") || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:")) return url ?? undefined;
  if (/\.\w{2,4}$/.test(url)) return url;
  if (url.startsWith("/") && !locales.some((l) => url.startsWith(`/${l}/`) || url === `/${l}`)) {
    return `/${locale}${url}`;
  }
  return url;
}

interface HeroProps {
  name: string;
  title: string;
  tagline: string | null;
  socialLinks: { platform: string; url: string; label: string | null }[];
  homepage: HomepageContent | null;
}

export function Hero({ name, title, tagline, socialLinks, homepage }: HeroProps) {
  const { t, locale } = useTranslations();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroOrbs />
      <GradientOrbs />
      <AuroraBackground />
      <ParticleField />

      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 mx-auto max-w-4xl container-px py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-100/80 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 mb-8 text-xs font-semibold uppercase tracking-wider border border-brand-200/50 dark:border-brand-800/30 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            {homepage?.heroBadgeText || title}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mb-6 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="text-slate-900 dark:text-white">{name.split(" ").slice(0, -1).join(" ")} </span>
            <span className="gradient-text">{name.split(" ").slice(-1)}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-12"
          >
            {tagline || homepage?.heroSubtext || t("hero.defaultTagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href={withLocale(locale, homepage?.heroCtaUrl) || "#contact"}
              className="btn-primary px-8 py-3.5 text-base glow-brand"
            >
              {homepage?.heroCtaText || t("hero.ctaContact")}
            </Link>
            <Link
              href={withLocale(locale, homepage?.heroCta2Url) || `/${locale}/projects`}
              className="btn-secondary px-8 py-3.5 text-base"
            >
              {homepage?.heroCta2Text || t("hero.ctaProjects")}
            </Link>
            <a
              href={withLocale(locale, homepage?.heroCta3Url) || `/cv.pdf`}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-300 dark:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              {homepage?.heroCta3Text || t("hero.ctaCv")}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {socialLinks.map((link, i) => {
              const Icon =
                link.platform === "linkedin" ? Linkedin
                  : link.platform === "github" ? Github
                    : link.platform === "email" ? Mail
                      : link.platform === "phone" ? Phone
                        : null;
              return (
                <motion.a
                  key={link.platform}
                  href={
                    link.platform === "email"
                      ? `mailto:${link.url}`
                      : link.platform === "phone"
                        ? `tel:${link.url}`
                        : link.url
                  }
                  target={
                    link.platform === "email" || link.platform === "phone"
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    link.platform === "email" || link.platform === "phone"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 hover:shadow-glow-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-brand-700 dark:hover:text-brand-400 dark:hover:bg-brand-900/20 dark:hover:shadow-glow-brand transition-all duration-300"
                  aria-label={link.label || link.platform}
                >
                  {Icon ? <Icon className="h-4.5 w-4.5" /> : (
                    <span className="text-sm font-medium">{link.platform[0].toUpperCase()}</span>
                  )}
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#about"
          className="inline-flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          aria-label={t("hero.scrollDown")}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
