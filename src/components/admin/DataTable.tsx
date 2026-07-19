"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Inbox, GripVertical } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  searchable?: boolean;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  newHref: string;
  newLabel: string;
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  emptyCta?: string;
  onReorder?: (reorderedItems: T[]) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  subtitle,
  newHref,
  newLabel,
  columns,
  data,
  keyField = "id",
  emptyIcon,
  emptyMessage = "No items yet.",
  emptyCta,
  onReorder,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<T[]>(data);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) =>
      columns.some((col) => {
        if (col.searchable === false) return false;
        const val = item[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [items, search, columns]);

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

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      const fromIndex = dragItem.current;
      if (fromIndex === null || fromIndex === dropIndex) {
        setDragIndex(null);
        setOverIndex(null);
        return;
      }

      const fromItem = filteredData[fromIndex];
      const toItem = filteredData[dropIndex];

      const reordered = [...items];
      const fromItemsIndex = reordered.indexOf(fromItem);
      const toItemsIndex = reordered.indexOf(toItem);

      const [moved] = reordered.splice(fromItemsIndex, 1);
      reordered.splice(toItemsIndex, 0, moved);

      const updated = reordered.map((item, i) => ({ ...item, orderIndex: i }));
      setItems(updated);
      setDragIndex(null);
      setOverIndex(null);

      onReorder?.(updated);
    },
    [items, filteredData, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const totalCols = columns.length + (onReorder ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <Link
          href={newHref}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white"
        >
          <Plus className="h-4 w-4" />
          {newLabel}
        </Link>
      </div>

      {data.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            aria-label={`Search ${title.toLowerCase()}`}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150"
          />
        </div>
      )}

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-16 text-center">
          {emptyIcon ?? <Inbox className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
          <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">{emptyMessage}</p>
          <Link
            href={newHref}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            {emptyCta ?? newLabel}
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {onReorder && <th scope="col" className="w-10"></th>}
                  {columns.map((col) => (
                    <th key={col.key} scope="col" className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={totalCols} className="px-5 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                      No results for &ldquo;{search}&rdquo;
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, i) => (
                    <tr
                      key={String(item[keyField] ?? i)}
                      draggable={!!onReorder}
                      onDragStart={onReorder ? (e) => handleDragStart(e, i) : undefined}
                      onDragOver={onReorder ? (e) => handleDragOver(e, i) : undefined}
                      onDrop={onReorder ? (e) => handleDrop(e, i) : undefined}
                      onDragEnd={onReorder ? handleDragEnd : undefined}
                      className={`group ${
                        onReorder
                          ? `transition-all cursor-grab active:cursor-grabbing ${
                              dragIndex === i
                                ? "opacity-50 bg-brand-50 dark:bg-brand-900/20"
                                : overIndex === i && dragIndex !== null && dragIndex !== i
                                  ? "border-t-2 border-t-brand-500 bg-brand-50/50 dark:bg-brand-900/10"
                                  : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                            }`
                          : "transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                      }`}
                    >
                      {onReorder && (
                        <td className="px-2 py-3.5">
                          <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-5 py-3.5">
                          {col.render(item)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
