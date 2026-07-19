"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical, Pencil, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

interface SectionItem {
  id: number;
  sectionId: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  icon: string | null;
  color: string | null;
  tags: string | null;
  metadata: string | null;
  visible: boolean;
  orderIndex: number;
  createdAt: number;
}

interface Section {
  id: number;
  slug: string;
  badge: string | null;
  title: string;
  description: string | null;
  layout: string;
  visible: boolean;
  orderIndex: number;
  createdAt: number;
  updatedAt: number;
  items: SectionItem[];
}

interface Props {
  sections: Section[];
  locale: string;
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

const layoutOptions = [
  { value: "cards", label: "Cards" },
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
  { value: "timeline", label: "Timeline" },
];

const colorOptions = ["brand", "emerald", "violet", "amber", "blue", "rose", "slate"];
const iconOptions = ["Code", "Award", "Briefcase", "GraduationCap", "Shield", "Rocket", "Users", "Lightbulb", "Target", "Heart", "Zap", "Star"];

export function CustomSectionsListClient({ sections: initial, locale }: Props) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(initial);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const [showNewSection, setShowNewSection] = useState(false);
  const [showNewItem, setShowNewItem] = useState<number | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const flash = (type: "success" | "error", msg: string) => {
    setStatus(type);
    setMessage(msg);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleDeleteSection = async (id: number) => {
    if (!window.confirm("Supprimer cette section et tous ses éléments ?")) return;
    try {
      await fetch(`/api/custom-sections/${id}`, { method: "DELETE" });
      setSections((prev) => prev.filter((s) => s.id !== id));
      flash("success", "Section supprimée.");
    } catch {
      flash("error", "Erreur lors de la suppression.");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm("Supprimer cet élément ?")) return;
    try {
      await fetch(`/api/custom-section-items/${id}`, { method: "DELETE" });
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.filter((i) => i.id !== id),
        }))
      );
      flash("success", "Élément supprimé.");
    } catch {
      flash("error", "Erreur lors de la suppression.");
    }
  };

  const handleSaveSection = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      if (editingSection) {
        const res = await fetch(`/api/custom-sections/${editingSection.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const updated = await res.json();
        setSections((prev) => prev.map((s) => (s.id === editingSection.id ? { ...s, ...updated } : s)));
        setEditingSection(null);
        flash("success", "Section mise à jour.");
      } else {
        const res = await fetch("/api/custom-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const created = await res.json();
        setSections((prev) => [...prev, { ...created, items: [] }]);
        setShowNewSection(false);
        flash("success", "Section créée.");
      }
    } catch {
      flash("error", "Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (sectionId: number, data: Record<string, unknown>) => {
    setLoading(true);
    try {
      if (editingItem) {
        const res = await fetch(`/api/custom-section-items?id=${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const updated = await res.json();
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId
              ? { ...s, items: s.items.map((i) => (i.id === editingItem.id ? { ...i, ...updated } : i)) }
              : s
          )
        );
        setEditingItem(null);
        flash("success", "Élément mis à jour.");
      } else {
        const res = await fetch("/api/custom-section-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, sectionId }),
        });
        const created = await res.json();
        setSections((prev) =>
          prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, created] } : s))
        );
        setShowNewItem(null);
        flash("success", "Élément créé.");
      }
    } catch {
      flash("error", "Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Custom Sections</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create dynamic sections with cards, grids, lists, or timelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />
          <button onClick={() => { setShowNewSection(true); setEditingSection(null); }} className="btn-primary gap-2">
            <Plus className="h-4 w-4" /> New Section
          </button>
        </div>
      </div>

      {status && (
        <div className={`flex items-center gap-3 rounded-2xl p-4 ${status === "success" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
          {status === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {(showNewSection || editingSection) && (
        <SectionForm
          data={editingSection}
          onSave={handleSaveSection}
          onCancel={() => { setShowNewSection(false); setEditingSection(null); }}
          loading={loading}
        />
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{section.title}</h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500">/{section.slug}</span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{section.layout}</span>
                  {!section.visible && <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Hidden</span>}
                </div>
                {section.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{section.description}</p>}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => { setEditingSection(section); setShowNewSection(false); setEditingItem(null); setShowNewItem(null); }} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors" aria-label="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/10 transition-colors" aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{section.items.length} item{section.items.length !== 1 ? "s" : ""}</span>
                <button onClick={() => { setShowNewItem(section.id); setEditingItem(null); setEditingSection(null); setShowNewSection(false); }} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                  <Plus className="h-3 w-3" /> Add item
                </button>
              </div>

              {showNewItem === section.id && !editingItem && (
                <ItemForm sectionId={section.id} onSave={handleSaveItem} onCancel={() => setShowNewItem(null)} loading={loading} />
              )}
              {editingItem && editingItem.sectionId === section.id && (
                <ItemForm sectionId={section.id} data={editingItem} onSave={handleSaveItem} onCancel={() => setEditingItem(null)} loading={loading} />
              )}

              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                      {item.subtitle && <p className="text-xs text-brand-600 dark:text-brand-400">{item.subtitle}</p>}
                    </div>
                    {!item.visible && <span className="text-[10px] text-red-500">Hidden</span>}
                    <button onClick={() => { setEditingItem(item); setShowNewItem(null); setEditingSection(null); }} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label="Edit">
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Delete">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionForm({ data, onSave, onCancel, loading }: { data: Section | null; onSave: (d: Record<string, unknown>) => void; onCancel: () => void; loading: boolean }) {
  const [form, setForm] = useState({
    slug: data?.slug ?? "",
    badge: data?.badge ?? "",
    title: data?.title ?? "",
    description: data?.description ?? "",
    layout: data?.layout ?? "cards",
    visible: data?.visible ?? true,
    orderIndex: data?.orderIndex ?? 0,
  });
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{data ? "Edit Section" : "New Section"}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={labelClass}>Title *</label><input type="text" value={form.title} onChange={set("title")} className={inputClass} required /></div>
        <div><label className={labelClass}>Slug *</label><input type="text" value={form.slug} onChange={set("slug")} className={inputClass} placeholder="services" required /></div>
      </div>
      <div><label className={labelClass}>Badge</label><input type="text" value={form.badge} onChange={set("badge")} className={inputClass} placeholder="Nos services" /></div>
      <div><label className={labelClass}>Description</label><textarea value={form.description} onChange={set("description")} rows={2} className={`${inputClass} resize-none`} /></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Layout</label>
          <select value={form.layout} onChange={set("layout")} className={inputClass}>
            {layoutOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div><label className={labelClass}>Order</label><input type="number" value={form.orderIndex} onChange={set("orderIndex")} className={inputClass} /></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.visible} onChange={set("visible")} className="rounded border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Visible</span></label></div>
      </div>
      <button onClick={() => onSave(form)} disabled={loading || !form.title || !form.slug} className="btn-primary">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} {data ? "Update" : "Create"}
      </button>
    </div>
  );
}

function ItemForm({ sectionId, data, onSave, onCancel, loading }: { sectionId: number; data?: SectionItem | null; onSave: (s: number, d: Record<string, unknown>) => void; onCancel: () => void; loading: boolean }) {
  const [form, setForm] = useState({
    title: data?.title ?? "",
    subtitle: data?.subtitle ?? "",
    description: data?.description ?? "",
    imageUrl: data?.imageUrl ?? "",
    linkUrl: data?.linkUrl ?? "",
    linkLabel: data?.linkLabel ?? "",
    icon: data?.icon ?? "",
    color: data?.color ?? "brand",
    tags: data?.tags ?? "[]",
    visible: data?.visible ?? true,
    orderIndex: data?.orderIndex ?? 0,
  });
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-900/10 p-4 mb-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{data ? "Edit Item" : "New Item"}</h4>
        <button onClick={onCancel} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><label className={labelClass}>Title *</label><input type="text" value={form.title} onChange={set("title")} className={inputClass} required /></div>
        <div><label className={labelClass}>Subtitle</label><input type="text" value={form.subtitle} onChange={set("subtitle")} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Description</label><textarea value={form.description} onChange={set("description")} rows={2} className={`${inputClass} resize-none`} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><label className={labelClass}>Image URL</label><input type="text" value={form.imageUrl} onChange={set("imageUrl")} className={inputClass} /></div>
        <div><label className={labelClass}>Link URL</label><input type="text" value={form.linkUrl} onChange={set("linkUrl")} className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={labelClass}>Link Label</label><input type="text" value={form.linkLabel} onChange={set("linkLabel")} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Icon</label>
          <select value={form.icon} onChange={set("icon")} className={inputClass}>
            <option value="">None</option>
            {iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <select value={form.color} onChange={set("color")} className={inputClass}>
            {colorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div><label className={labelClass}>Tags (JSON array)</label><input type="text" value={form.tags} onChange={set("tags")} className={inputClass} placeholder='["React","Laravel"]' /></div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.visible} onChange={set("visible")} className="rounded border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Visible</span></label>
        <div className="flex-1"><label className={labelClass}>Order</label><input type="number" value={form.orderIndex} onChange={set("orderIndex")} className={inputClass} /></div>
      </div>
      <button onClick={() => onSave(sectionId, form)} disabled={loading || !form.title} className="btn-primary text-sm">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} {data ? "Update" : "Create"}
      </button>
    </div>
  );
}
