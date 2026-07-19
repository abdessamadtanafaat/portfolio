"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

interface SeoEntry {
  id: number;
  pagePath: string;
  title: string;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
}

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";

export function SeoListClient({ data, locale }: { data: SeoEntry[]; locale: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SeoEntry | "new" | null>(null);
  const [form, setForm] = useState({
    pagePath: "",
    title: "",
    description: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showBanner = (type: "success" | "error", message: string) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 3000);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (e) => e.pagePath.toLowerCase().includes(q) || e.title.toLowerCase().includes(q)
    );
  }, [data, search]);

  const startEdit = (entry?: SeoEntry) => {
    if (entry) {
      setEditing(entry);
      setForm({
        pagePath: entry.pagePath,
        title: entry.title,
        description: entry.description ?? "",
        ogTitle: entry.ogTitle ?? "",
        ogDescription: entry.ogDescription ?? "",
        ogImageUrl: entry.ogImageUrl ?? "",
      });
    } else {
      setEditing("new");
      setForm({ pagePath: "", title: "", description: "", ogTitle: "", ogDescription: "", ogImageUrl: "" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing === "new" ? { ...form, locale } : { id: (editing as SeoEntry).id, ...form, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      showBanner("success", "SEO entry saved");
      setEditing(null);
      router.refresh();
    } catch {
      showBanner("error", "Failed to save SEO entry");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this SEO entry? This action cannot be undone.")) return;
    try {
      await fetch(`/api/seo?id=${id}`, { method: "DELETE" });
      showBanner("success", "SEO entry deleted");
      router.refresh();
    } catch {
      showBanner("error", "Failed to delete SEO entry");
    }
  };

  if (editing !== null) {
    return (
      <div className="max-w-2xl space-y-6">
        {banner && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              banner.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {banner.message}
          </div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditing(null)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all duration-150"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {editing === "new" ? "New SEO Entry" : "Edit SEO Entry"}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {editing === "new" ? "Add SEO metadata for a page" : `Editing ${editing.pagePath}`}
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Page Path <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.pagePath}
              onChange={(e) => setForm({ ...form, pagePath: e.target.value })}
              required
              placeholder="/projects"
              className={INPUT}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={INPUT}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={INPUT}
            />
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Open Graph
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">OG Title</label>
                <input
                  type="text"
                  value={form.ogTitle}
                  onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  OG Description
                </label>
                <input
                  type="text"
                  value={form.ogDescription}
                  onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  OG Image URL
                </label>
                <input
                  type="text"
                  value={form.ogImageUrl}
                  onChange={(e) => setForm({ ...form, ogImageUrl: e.target.value })}
                  placeholder="https://..."
                  className={INPUT}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
            <button type="button" className="btn-ghost text-xs" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {banner && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            banner.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SEO Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage meta tags and Open Graph data</p>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />
          <button onClick={() => startEdit()} className="btn-primary">
            <Plus className="h-4 w-4" />
            New Entry
          </button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            aria-label="Search SEO entries"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150"
          />
        </div>
      )}

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-16 text-center">
          <FileText className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">No SEO entries yet.</p>
          <button onClick={() => startEdit()} className="btn-primary">
            <Plus className="h-4 w-4" />
            Add SEO Entry
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  Path
                </th>
                <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  Title
                </th>
                <th className="text-right px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                    No results for &ldquo;{search}&rdquo;
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5 font-mono text-sm text-slate-900 dark:text-white">
                      {entry.pagePath}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{entry.title}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(entry)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          aria-label="Delete entry"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
