"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Power, PowerOff } from "lucide-react";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

interface Props {
  data: {
    siteName: string;
    faviconUrl: string | null;
    defaultOgImageUrl: string | null;
    analyticsId: string | null;
    contactFormEndpoint: string | null;
    maintenanceMode: boolean;
    maintenanceMessage: string | null;
  } | null;
  locale: string;
}

export function SettingsForm({ data, locale }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    siteName: data?.siteName ?? "",
    faviconUrl: data?.faviconUrl ?? "",
    defaultOgImageUrl: data?.defaultOgImageUrl ?? "",
    analyticsId: data?.analyticsId ?? "",
    contactFormEndpoint: data?.contactFormEndpoint ?? "",
  });

  const [maintenanceMode, setMaintenanceMode] = useState(data?.maintenanceMode ?? false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(data?.maintenanceMessage ?? "Notre site est actuellement en maintenance. Nous serons de retour très bientôt. Merci pour votre patience.");

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setMessage({ type: "success", text: "Settings saved successfully!" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenance = async () => {
    setMaintenanceLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenanceMode: !maintenanceMode, maintenanceMessage, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setMaintenanceMode(!maintenanceMode);
      setMessage({ type: "success", text: !maintenanceMode ? "Maintenance mode ACTIVATED. Public site is now offline." : "Maintenance mode DEACTIVATED. Public site is back online." });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to toggle maintenance mode." });
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const saveMaintenanceMessage = async () => {
    setMaintenanceLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenanceMessage, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setMessage({ type: "success", text: "Maintenance message saved." });
    } catch {
      setMessage({ type: "error", text: "Failed to save maintenance message." });
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all duration-150" aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Site Settings</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Configure your portfolio site</p>
        </div>
        <LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />
      </div>

      {message && (
        <div className={`flex items-center gap-3 rounded-2xl p-4 ${message.type === "success" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
          {message.type === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Site Name <span className="text-red-500">*</span></label>
          <input value={form.siteName} onChange={(e) => update("siteName", e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Favicon URL</label>
          <input value={form.faviconUrl} onChange={(e) => update("faviconUrl", e.target.value)} placeholder="https://..." className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Default OG Image URL</label>
          <input value={form.defaultOgImageUrl} onChange={(e) => update("defaultOgImageUrl", e.target.value)} placeholder="https://..." className={inputClass} />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Used when sharing your site on social media</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Analytics ID</label>
          <input value={form.analyticsId} onChange={(e) => update("analyticsId", e.target.value)} placeholder="G-XXXXXXXXXX" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contact Form Endpoint</label>
          <input value={form.contactFormEndpoint} onChange={(e) => update("contactFormEndpoint", e.target.value)} placeholder="https://formspree.io/..." className={inputClass} />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">External service to handle contact form submissions</p>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              {maintenanceMode ? <PowerOff className="h-5 w-5 text-red-500" /> : <Power className="h-5 w-5 text-emerald-500" />}
              Maintenance Mode
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {maintenanceMode ? "Public site is currently offline." : "Public site is currently online."}
            </p>
          </div>
          <button onClick={toggleMaintenance} disabled={maintenanceLoading} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white ${maintenanceMode ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600"}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {maintenanceMode && (
          <div className={`rounded-xl p-4 text-sm font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800`}>
            Public site is in maintenance mode. Only admins can access the site.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Maintenance Message</label>
          <textarea value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Message shown to visitors during maintenance..." />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveMaintenanceMessage} disabled={maintenanceLoading} className="btn-primary">
            {maintenanceLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Message
          </button>
        </div>
      </div>
    </div>
  );
}
