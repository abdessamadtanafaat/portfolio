"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DifferentiatorData {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string | null;
  visible: boolean;
  orderIndex: number;
}

const colorOptions = [
  { value: "brand", label: "Brand" },
  { value: "emerald", label: "Emerald" },
  { value: "violet", label: "Violet" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
] as const;

export function DifferentiatorForm({ data }: { data: DifferentiatorData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(data?.title ?? "");
  const [description, setDescription] = useState(data?.description ?? "");
  const [icon, setIcon] = useState(data?.icon ?? "Code");
  const [color, setColor] = useState(data?.color ?? "brand");
  const [visible, setVisible] = useState(data?.visible ?? true);
  const [orderIndex, setOrderIndex] = useState(data?.orderIndex ?? 0);

  const isEditing = !!data;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/differentiators/${data.id}`
        : "/api/differentiators";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          icon,
          color,
          visible,
          orderIndex: Number(orderIndex),
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      router.push("/admin/differentiators");
    } catch (err) {
      console.error(err);
      alert("Failed to save differentiator.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? "Edit Differentiator" : "New Differentiator"}
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {isEditing
            ? "Update the differentiator card details."
            : "Create a new differentiator card."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field w-full"
            placeholder="e.g. React & Next.js"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="input-field w-full resize-none"
            placeholder="Describe what makes you stand out..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Icon *
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              required
              className="input-field w-full"
              placeholder="e.g. Code"
            />
          </div>

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
        </div>

        <div className="grid grid-cols-2 gap-6">
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

          <div className="flex items-end pb-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-white/70">Visible</span>
            </label>
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
            href="/admin/differentiators"
            className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
