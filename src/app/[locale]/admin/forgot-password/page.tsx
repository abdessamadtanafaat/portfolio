"use client";

import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { requestPasswordResetAction } from "../actions";
import { useAdminTranslations } from "@/i18n/useAdminTranslations";

export default function ForgotPasswordPage() {
  const { t } = useAdminTranslations();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; devToken?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await requestPasswordResetAction(email);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-lg dark:bg-white dark:text-slate-900 mb-4">
            AT
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t("forgot.title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{t("forgot.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
          {result?.success && result.message ? (
            <div className="text-center">
              <MailCheck className="h-10 w-10 mx-auto text-emerald-500 mb-4" />
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{result.message}</p>
              {result.devToken && (
                <pre className="mt-4 rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-left text-xs break-all text-slate-700 dark:text-slate-300 select-all">
                  {result.devToken}
                </pre>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {result && !result.success && (
                <div className="rounded-xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400" role="alert">
                  {result.message}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t("login.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("forgot.submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
