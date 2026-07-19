export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, skills, experiences, education, certificates } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";
import { Briefcase, Code, Building2, GraduationCap, Award, Plus, Clock, ArrowUpRight } from "lucide-react";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import en from "../../../../../messages/admin/en.json";
import fr from "../../../../../messages/admin/fr.json";
import ar from "../../../../../messages/admin/ar.json";
import { locales, type Locale } from "@/i18n/config";

const messages: Record<string, Record<string, string>> = { en, fr, ar };

async function getCount(table: SQLiteTable) {
  const result = await db.select({ count: sql<number>`count(*)` }).from(table).get();
  return Number(result?.count ?? 0);
}

async function getRecentActivity(baseHref: string) {
  const recentProjects = db
    .select({ title: projects.title, type: sql<string>`'Project'`, href: sql.raw(`'${baseHref}/projects'`), timestamp: projects.updatedAt })
    .from(projects)
    .orderBy(desc(projects.updatedAt))
    .limit(1);

  const recentExperiences = db
    .select({ title: experiences.role, type: sql<string>`'Experience'`, href: sql.raw(`'${baseHref}/experiences'`), timestamp: experiences.updatedAt })
    .from(experiences)
    .orderBy(desc(experiences.updatedAt))
    .limit(1);

  const recentSkills = db
    .select({ title: skills.name, type: sql<string>`'Skill'`, href: sql.raw(`'${baseHref}/skills'`), timestamp: skills.createdAt })
    .from(skills)
    .orderBy(desc(skills.createdAt))
    .limit(1);

  const recentEducation = db
    .select({ title: education.degree, type: sql<string>`'Education'`, href: sql.raw(`'${baseHref}/education'`), timestamp: education.createdAt })
    .from(education)
    .orderBy(desc(education.createdAt))
    .limit(1);

  const recentCerts = db
    .select({ title: certificates.name, type: sql<string>`'Certificate'`, href: sql.raw(`'${baseHref}/certificates'`), timestamp: certificates.createdAt })
    .from(certificates)
    .orderBy(desc(certificates.createdAt))
    .limit(1);

  const [projects_, experiences_, skills_, education_, certs_] = await Promise.all([
    recentProjects.all(),
    recentExperiences.all(),
    recentSkills.all(),
    recentEducation.all(),
    recentCerts.all(),
  ]);

  const all = [...projects_, ...experiences_, ...skills_, ...education_, ...certs_]
    .filter((r) => r.timestamp > 0)
    .sort((a, b) => b.timestamp - a.timestamp);

  return all[0] ?? null;
}

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : "en";
  const t = (key: string): string => (messages[locale] || messages.en)[key] || key;
  const base = `/${locale}/admin`;

  const session = await auth();
  const [projectCount, skillCount, experienceCount, educationCount, certCount] = await Promise.all([
    getCount(projects),
    getCount(skills),
    getCount(experiences),
    getCount(education),
    getCount(certificates),
  ]);

  const recentActivity = await getRecentActivity(base);
  const userName = session?.user?.name || "Admin";
  const totalItems = projectCount + skillCount + experienceCount + educationCount + certCount;

  const cards = [
    { label: t("dashboard.totalProjects"), count: projectCount, icon: Briefcase, href: `${base}/projects`, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/50" },
    { label: t("dashboard.totalSkills"), count: skillCount, icon: Code, href: `${base}/skills`, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50" },
    { label: t("dashboard.totalExperiences"), count: experienceCount, icon: Building2, href: `${base}/experiences`, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/50" },
    { label: t("dashboard.totalEducation"), count: educationCount, icon: GraduationCap, href: `${base}/education`, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50" },
    { label: t("dashboard.totalCertificates"), count: certCount, icon: Award, href: `${base}/certificates`, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/50" },
  ];

  const quickActions = [
    { label: t("dashboard.newProject"), href: `${base}/projects/new` },
    { label: t("dashboard.newSkill"), href: `${base}/skills/new` },
    { label: t("dashboard.editHomepage"), href: `${base}/homepage` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("dashboard.welcome")}, {userName}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("dashboard.manageContent")} {totalItems} {t("common.items")}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-slate-300 dark:hover:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color} transition-transform duration-200 group-hover:scale-110`}>
                <card.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 dark:text-slate-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {card.count}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            {t("dashboard.quickActions")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 transition-all duration-150 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
              >
                <Plus className="h-3 w-3" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            {t("dashboard.recentActivity")}
          </h2>
          {recentActivity ? (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {recentActivity.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {recentActivity.type} &middot;{" "}
                  {new Date(recentActivity.timestamp * 1000).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("dashboard.noActivity")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
