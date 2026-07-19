"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Code, Search, GripVertical } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  orderIndex: number;
}

interface Props {
  skills: Skill[];
  categoryColors: Record<string, string>;
}

export function SkillsListClient({ skills, categoryColors }: Props) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Skill[]>(skills);
  const [dragIndex, setDragIndex] = useState<{ category: string; index: number } | null>(null);
  const [overIndex, setOverIndex] = useState<{ category: string; index: number } | null>(null);
  const dragItem = useRef<{ category: string; index: number } | null>(null);

  useEffect(() => {
    setItems(skills);
  }, [skills]);

  const grouped = useMemo(() => {
    const filtered = search.trim()
      ? items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      : items;

    return filtered.reduce<Record<string, Skill[]>>((acc, skill) => {
      (acc[skill.category] ??= []).push(skill);
      return acc;
    }, {});
  }, [items, search]);

  const totalFiltered = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

  const handleDragStart = useCallback((e: React.DragEvent, category: string, index: number) => {
    dragItem.current = { category, index };
    setDragIndex({ category, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${category}:${index}`);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, category: string, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex({ category, index });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, category: string, dropIndex: number) => {
      e.preventDefault();
      const from = dragItem.current;
      if (!from || from.category !== category || from.index === dropIndex) {
        setDragIndex(null);
        setOverIndex(null);
        return;
      }

      const categoryItems = grouped[category];
      const fromItem = categoryItems[from.index];
      const toItem = categoryItems[dropIndex];

      const reordered = [...items];
      const fromFullIndex = reordered.indexOf(fromItem);
      const toFullIndex = reordered.indexOf(toItem);

      const [moved] = reordered.splice(fromFullIndex, 1);
      reordered.splice(toFullIndex, 0, moved);

      const updated = reordered.map((item, i) => ({ ...item, orderIndex: i }));
      setItems(updated);
      setDragIndex(null);
      setOverIndex(null);

      saveOrder(updated);
    },
    [items, grouped]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const saveOrder = async (orderedItems: Skill[]) => {
    try {
      const payload = orderedItems.map((item) => ({ id: item.id, orderIndex: item.orderIndex }));
      await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  };

  const isDragging = (category: string, index: number) =>
    dragIndex?.category === category && dragIndex.index === index;

  const isOver = (category: string, index: number) =>
    overIndex?.category === category && overIndex.index === index && dragIndex !== null && !isDragging(category, index);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Skills</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{skills.length} skills across {Object.keys(grouped).length} categories</p>
        </div>
        <Link
          href="/admin/skills/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white"
        >
          <Plus className="h-4 w-4" />
          New Skill
        </Link>
      </div>

      {skills.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            aria-label="Search skills"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150"
          />
        </div>
      )}

      {skills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-16 text-center">
          <Code className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">No skills yet.</p>
          <Link
            href="/admin/skills/new"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" /> Add Skill
          </Link>
        </div>
      ) : totalFiltered === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center text-sm text-slate-500 dark:text-slate-400">
          No results for &ldquo;{search}&rdquo;
        </div>
      ) : (
        Object.entries(grouped).map(([category, catItems]) => (
          <div key={category} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${categoryColors[category] ?? ""}`}>
                {category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{catItems.length} skills</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th scope="col" className="w-10"></th>
                    <th className="text-left px-5 py-2.5 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-2.5 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Proficiency</th>
                    <th className="text-right px-5 py-2.5 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {catItems.map((skill, index) => (
                    <tr
                      key={skill.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, category, index)}
                      onDragOver={(e) => handleDragOver(e, category, index)}
                      onDrop={(e) => handleDrop(e, category, index)}
                      onDragEnd={handleDragEnd}
                      className={`group transition-all cursor-grab active:cursor-grabbing ${
                        isDragging(category, index)
                          ? "opacity-50 bg-brand-50 dark:bg-brand-900/20"
                          : isOver(category, index)
                            ? "border-t-2 border-t-brand-500 bg-brand-50/50 dark:bg-brand-900/10"
                            : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                      }`}
                    >
                      <td className="px-2 py-3.5">
                        <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">{skill.name}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500" style={{ width: `${skill.proficiency}%` }} />
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums w-8">{skill.proficiency}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                          <Link
                            href={`/admin/skills/${skill.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </Link>
                          <DeleteButton id={skill.id} apiEndpoint="/api/skills" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
