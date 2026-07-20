"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslations } from "@/i18n/useTranslations";
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher";
import { locales, defaultLocale } from "@/i18n/config";
import type { NavItem } from "@/lib/queries/portfolio";

interface NavbarProps {
  name?: string;
  navItems?: NavItem[];
}

export function Navbar({ name, navItems = [] }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const segments = pathname.split("/");
  const locale = segments[1] && locales.includes(segments[1] as typeof locales[number]) ? segments[1] : defaultLocale;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route (or locale) changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  const visibleNavItems = navItems.filter((item) => item.visible);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl saturate-180 border-b border-slate-900/[0.04] dark:border-white/[0.06] shadow-glass"
          : "bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between container-px py-3.5">
        <Link
          href={`/${locale}`}
          onClick={() => handleNavClick(`/${locale}`)}
          className="group flex items-center gap-3"
          aria-label={t("nav.home")}
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all group-hover:shadow-brand-500/30 group-hover:scale-105">
            AT
          </span>
          <span className="hidden sm:block text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            {name || "Abdessamad Tanafaat"}
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-0.5">
          {visibleNavItems.map((item) => {
            const itemHref = item.href.startsWith("/") ? `/${locale}${item.href}` : item.href;
            const isActive = pathname === itemHref || (itemHref !== "/" && itemHref.startsWith("/") && pathname.startsWith(itemHref));
            return (
               <li key={item.id}>
                <Link
                  href={itemHref}
                  target={item.target}
                  onClick={() => handleNavClick(itemHref)}
                  className={`relative px-3 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-brand-900/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg ring-1 ring-brand-500/30 dark:ring-brand-400/30"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80 transition-all duration-200"
            aria-label={theme === "light" ? t("nav.toggleDark") : t("nav.toggleLight")}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80 transition-all duration-200"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`absolute top-full inset-x-0 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/95 transition-all duration-300 md:hidden ${
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="container-px py-3 space-y-0.5">
          {visibleNavItems.map((item) => {
            const itemHref = item.href.startsWith("/") ? `/${locale}${item.href}` : item.href;
            const isActive = pathname === itemHref || (itemHref !== "/" && itemHref.startsWith("/") && pathname.startsWith(itemHref));
            return (
              <li key={item.id}>
                <Link
                  href={itemHref}
                  target={item.target}
                  onClick={() => handleNavClick(itemHref)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
