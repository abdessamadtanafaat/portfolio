"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";
import { useTranslations } from "@/i18n/useTranslations";
import { locales, defaultLocale } from "@/i18n/config";
import type { PersonalInfo, SocialLink, Technology, HomepageContent, NavItem } from "@/lib/queries/portfolio";

interface FooterProps {
  personal: PersonalInfo | null;
  socialLinks: SocialLink[];
  technologies: Technology[];
  homepage: HomepageContent | null;
  navItems?: NavItem[];
}

export function Footer({ personal, socialLinks: dbSocialLinks, technologies, homepage, navItems = [] }: FooterProps) {
  const { t } = useTranslations();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const locale = segments[1] && locales.includes(segments[1] as typeof locales[number]) ? segments[1] : defaultLocale;
  const github = dbSocialLinks.find((l) => l.platform === "github");
  const linkedin = dbSocialLinks.find((l) => l.platform === "linkedin");
  const email = personal?.email ?? "";
  const primaryTechs = technologies.filter((t) => t.primary).slice(0, 6);

  const socialItems = [
    ...(github ? [{ platform: "github", url: github.url, icon: Github, label: "GitHub" }] : []),
    ...(linkedin ? [{ platform: "linkedin", url: linkedin.url, icon: Linkedin, label: "LinkedIn" }] : []),
    ...(email ? [{ platform: "email", url: `mailto:${email}`, icon: Mail, label: "Email" }] : []),
  ];

  const footerDesc = homepage?.footerDescription || personal?.tagline || t("footer.description");
  const navTitle = homepage?.footerNavTitle || t("footer.navigation");
  const contactTitle = homepage?.footerContactTitle || t("footer.contact");
  const techTitle = homepage?.footerTechTitle || t("footer.technologies");

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0a0a0f]">
      <div className="relative mx-auto max-w-6xl container-px py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-1"
          >
            <Link href={`/${locale}`} className="group inline-flex items-center gap-3" aria-label={t("nav.home")}>
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/20">AT</span>
              <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">{personal?.name || "Abdessamad Tanafaat"}</span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              {footerDesc}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialItems.map((item) => (
                <a key={item.platform} href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200/80 bg-white text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 hover:shadow-glow-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-brand-700 dark:hover:text-brand-400 dark:hover:bg-brand-900/20 dark:hover:shadow-glow-brand transition-all duration-300" aria-label={item.label}>
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            aria-label={navTitle}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">{navTitle}</h3>
            <ul className="space-y-2.5">
              {navItems.filter((item) => item.visible && item.href !== "/").map((item) => (
                <li key={item.id}>
                  <Link href={item.href} target={item.target} className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors duration-200">{item.label}</Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.address
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="not-italic"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">{contactTitle}</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                  <a href={`mailto:${email}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{email}</a>
                </li>
              )}
              {personal?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                  <span>{personal.phone}</span>
                </li>
              )}
              {personal?.location && (
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                  <span>{personal.location}</span>
                </li>
              )}
            </ul>
          </motion.address>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">{techTitle}</h3>
            <div className="flex flex-wrap gap-1.5">
              {primaryTechs.map((tech) => (
                <span key={tech.name} className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg dark:bg-slate-800 dark:text-slate-400">{tech.name}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="mx-auto max-w-6xl container-px py-6">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} {personal?.name || "Abdessamad Tanafaat"}. {homepage?.footerCopyright || t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
