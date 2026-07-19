"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconPicker } from "@/components/admin/editors/IconPicker";

interface SoftSkillData {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  color: string | null;
  orderIndex: number;
}

const categoryOptions = [
  { value: "soft_skill", label: "Soft Skill" },
  { value: "hobby", label: "Hobby" },
] as const;

const colorOptions = [
  { value: "brand", label: "Brand" },
  { value: "emerald", label: "Emerald" },
  { value: "violet", label: "Violet" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
  { value: "blue", label: "Blue" },
  { value: "slate", label: "Slate" },
] as const;

export function SoftSkillForm({ data }: { data: SoftSkillData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(data?.name ?? "");
  const [category, setCategory] = useState(data?.category ?? "soft_skill");
  const [icon, setIcon] = useState(data?.icon ?? "Sparkles");
  const [color, setColor] = useState(data?.color ?? "brand");
  const [orderIndex, setOrderIndex] = useState(data?.orderIndex ?? 0);

  const isEditing = !!data;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/soft-skills/${data.id}`
        : "/api/soft-skills";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          icon,
          color,
          orderIndex: Number(orderIndex),
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      router.push("/admin/soft-skills");
    } catch (err) {
      console.error(err);
      alert("Failed to save soft skill.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? "Edit Soft Skill" : "New Soft Skill"}
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {isEditing ? "Update the soft skill details." : "Add a new soft skill or hobby."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field w-full"
            placeholder="e.g. Communication"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-full"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Icon
          </label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Color
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="input-field w-full"
            >
              {colorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Order Index
            </label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              className="input-field w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <Link
            href="/admin/soft-skills"
            className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
