"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface HomepageContent {
  id: number;
  footerCopyright: string | null;
  footerDescription: string | null;
  footerNavTitle: string | null;
  footerContactTitle: string | null;
  footerTechTitle: string | null;
  heroHeadline: string | null;
  heroSubtext: string | null;
  [key: string]: unknown;
}

interface FooterFormProps {
  data: HomepageContent | null;
}

export function FooterForm({ data }: FooterFormProps) {
  const [form, setForm] = useState({
    footerCopyright: data?.footerCopyright ?? "Tous droits réservés.",
    footerDescription: data?.footerDescription ?? "",
    footerNavTitle: data?.footerNavTitle ?? "Navigation",
    footerContactTitle: data?.footerContactTitle ?? "Contact",
    footerTechTitle: data?.footerTechTitle ?? "Technologies",
    heroHeadline: data?.heroHeadline ?? "",
    heroSubtext: data?.heroSubtext ?? "",
  });
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/homepage-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setMessage("Footer settings updated successfully!");
    } catch {
      setStatus("error");
      setMessage("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Footer Management</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure footer description, column titles, copyright, and quick-access homepage fields.</p>
      </div>

      {status && (
        <div className={`flex items-center gap-3 rounded-2xl p-4 ${status === "success" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
          {status === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Footer Content</h2>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.footerDescription} onChange={set("footerDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Leave empty to use tagline from Personal Info" />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Shown below the logo. Falls back to personal tagline if empty.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Navigation Column Title</label>
              <input type="text" value={form.footerNavTitle} onChange={set("footerNavTitle")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Column Title</label>
              <input type="text" value={form.footerContactTitle} onChange={set("footerContactTitle")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Technologies Column Title</label>
              <input type="text" value={form.footerTechTitle} onChange={set("footerTechTitle")} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Copyright Text</label>
            <input type="text" value={form.footerCopyright} onChange={set("footerCopyright")} className={inputClass} placeholder="Tous droits réservés." />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hero Quick Access</h2>
          <div>
            <label className={labelClass}>Hero Headline</label>
            <input type="text" value={form.heroHeadline} onChange={set("heroHeadline")} className={inputClass} placeholder="Name" />
          </div>
          <div>
            <label className={labelClass}>Hero Subtext</label>
            <textarea value={form.heroSubtext} onChange={set("heroSubtext")} rows={3} className={`${inputClass} resize-none`} placeholder="Tagline" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
