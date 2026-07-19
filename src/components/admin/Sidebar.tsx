"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code,
  Briefcase as ExperienceIcon,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  Navigation,
  FileText,
  Sparkles,
  Globe,
  Heart,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Homepage Content", icon: LayoutDashboard },
  { href: "/admin/personal-info", label: "Personal Info", icon: User },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/experiences", label: "Experience", icon: ExperienceIcon },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/social-links", label: "Social Links", icon: LinkIcon },
  { href: "/admin/header", label: "Header", icon: Navigation },
  { href: "/admin/footer", label: "Footer", icon: Settings },
  { href: "/admin/differentiators", label: "Differentiators", icon: Sparkles },
  { href: "/admin/custom-sections", label: "Custom Sections", icon: FileText },
  { href: "/admin/languages", label: "Languages", icon: Globe },
  { href: "/admin/volunteering", label: "Volunteering", icon: Heart },
  { href: "/admin/soft-skills", label: "Soft Skills", icon: Sparkles },
  { href: "/admin/forms", label: "Form Builder", icon: FileText },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all duration-150"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transform transition-all duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-slate-100 dark:border-slate-800 px-5">
            <Link href="/admin" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900 transition-transform duration-200 group-hover:scale-105">
                AT
              </span>
              <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                Admin
              </span>
            </Link>
            <button
              className="lg:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 dark:border-slate-800 p-3">
            <form action={async () => { await signOut({ callbackUrl: "/admin/login" }); }} className="w-full">
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/10 rounded-xl transition-all duration-150"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
