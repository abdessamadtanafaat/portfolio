"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface NavItem {
  id: number;
  label: string;
  href: string;
  type: string;
  target: string;
  visible: boolean;
  orderIndex: number;
}

export function HeaderForm({ data }: { data: NavItem | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [label, setLabel] = useState(data?.label ?? "");
  const [href, setHref] = useState(data?.href ?? "");
  const [type, setType] = useState(data?.type ?? "internal");
  const [target, setTarget] = useState(data?.target ?? "_self");
  const [visible, setVisible] = useState(data?.visible ?? true);
  const [orderIndex, setOrderIndex] = useState(data?.orderIndex ?? 0);

  const isEditing = !!data;

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const url = isEditing ? `/api/nav-items/${data.id}` : "/api/nav-items";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, href, type, target, visible, orderIndex }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ type: "success", text: isEditing ? "Link updated successfully" : "Link created successfully" });
      setTimeout(() => router.push("/admin/header"), 800);
    } catch {
      setMessage({ type: "error", text: "Failed to save link." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isEditing ? "Edit Navigation Link" : "New Navigation Link"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isEditing ? "Update the navigation link details." : "Add a new navigation link to your header and footer."}
        </p>
      </div>

      {message && (
        <div className={`flex items-center gap-3 rounded-2xl p-4 ${message.type === "success" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
          {message.type === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Label <span className="text-red-500">*</span></label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} required placeholder="Accueil" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Href <span className="text-red-500">*</span></label>
            <input type="text" value={href} onChange={(e) => setHref(e.target.value)} required placeholder="/" className={`${inputClass} font-mono`} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              <option value="internal">Internal</option>
              <option value="anchor">Anchor</option>
              <option value="external">External</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target</label>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className={inputClass}>
              <option value="_self">Same Tab</option>
              <option value="_blank">New Tab</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Order Index</label>
            <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} className={inputClass} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10 dark:border-slate-600 dark:bg-slate-700" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visible</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? "Update Link" : "Create Link"}
          </button>
          <Link href="/admin/header" className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
