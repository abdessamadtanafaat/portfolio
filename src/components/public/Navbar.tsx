"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { NavItem } from "@/lib/queries/portfolio";

interface NavbarProps {
  name?: string;
  navItems?: NavItem[];
}

export function Navbar({ name, navItems = [] }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          href="/"
          onClick={() => handleNavClick("/")}
          className="group flex items-center gap-3"
          aria-label="Accueil"
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
            const isActive = pathname === item.href || (item.href !== "/" && item.href.startsWith("/") && pathname.startsWith(item.href));
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  target={item.target}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-brand-900/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80 transition-all duration-200"
            aria-label={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80 transition-all duration-200"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className={`md:hidden border-t border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90 transition-all duration-300 ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
        <ul className="container-px py-3 space-y-0.5">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && item.href.startsWith("/") && pathname.startsWith(item.href));
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  target={item.target}
                  onClick={() => handleNavClick(item.href)}
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
