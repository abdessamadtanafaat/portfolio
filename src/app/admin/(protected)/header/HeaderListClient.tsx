"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { GripVertical, Pencil, Navigation } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface NavItem {
  id: number;
  label: string;
  href: string;
  type: string;
  target: string;
  visible: boolean;
  orderIndex: number;
  [key: string]: unknown;
}

export function HeaderListClient({ data }: { data: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(data);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const dragItem = useRef<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    dragItem.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const fromIndex = dragItem.current;
    if (fromIndex === null || fromIndex === dropIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    const updated = reordered.map((item, i) => ({ ...item, orderIndex: i }));
    setItems(updated);
    setDragIndex(null);
    setOverIndex(null);

    saveOrder(updated);
  }, [items]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const saveOrder = async (orderedItems: NavItem[]) => {
    setSaving(true);
    try {
      const payload = orderedItems.map((item) => ({ id: item.id, orderIndex: item.orderIndex }));
      const res = await fetch("/api/nav-items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to save order:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Header Navigation</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage the navigation items displayed in the header and footer.
            {saving && <span className="ml-2 text-brand-500">Saving...</span>}
          </p>
        </div>
        <Link
          href="/admin/header/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white"
        >
          <span className="h-4 w-4">+</span>
          New Link
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-16 text-center">
          <Navigation className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">No navigation items yet.</p>
          <Link
            href="/admin/header/new"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <span className="h-4 w-4">+</span>
            Add your first link
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th scope="col" className="w-10"></th>
                  <th scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Order</th>
                  <th scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Label</th>
                  <th scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Href</th>
                  <th scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Type</th>
                  <th scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Target</th>
                  <th scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Visible</th>
                  <th scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`group transition-all cursor-grab active:cursor-grabbing ${
                      dragIndex === index
                        ? "opacity-50 bg-brand-50 dark:bg-brand-900/20"
                        : overIndex === index && dragIndex !== null && dragIndex !== index
                          ? "border-t-2 border-t-brand-500 bg-brand-50/50 dark:bg-brand-900/10"
                          : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-2 py-3.5">
                      <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">{index + 1}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-slate-600 dark:text-slate-400 font-mono text-xs">{item.href}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-slate-600 dark:text-slate-400">{item.target === "_blank" ? "New Tab" : "Same Tab"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {item.visible ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Visible</span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Hidden</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/header/${item.id}`} className="btn-ghost text-xs">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <DeleteButton id={item.id} apiEndpoint="/api/nav-items" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
