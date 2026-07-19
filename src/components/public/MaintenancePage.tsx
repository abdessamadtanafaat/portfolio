"use client";

import { Wrench } from "lucide-react";
import { useTranslations } from "@/i18n/useTranslations";

interface MaintenancePageProps {
  message?: string;
}

export function MaintenancePage({ message }: MaintenancePageProps) {
  const { t } = useTranslations();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <Wrench className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{t("maintenance.title")}</h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          {message || t("maintenance.message")}
        </p>
      </div>
    </div>
  );
}
