"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LanguageData {
  id: number;
  name: string;
  level: string;
  proficiency: number;
  orderIndex: number;
}

const levelOptions = [
  { value: "Courant", label: "Courant" },
  { value: "Notionnel", label: "Notionnel" },
  { value: "Intermédiaire", label: "Intermédiaire" },
  { value: "Avancé", label: "Avancé" },
  { value: "Natif", label: "Natif" },
] as const;

export function LanguageForm({ data }: { data: LanguageData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(data?.name ?? "");
  const [level, setLevel] = useState(data?.level ?? "Courant");
  const [proficiency, setProficiency] = useState(data?.proficiency ?? 80);
  const [orderIndex, setOrderIndex] = useState(data?.orderIndex ?? 0);

  const isEditing = !!data;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/languages/${data.id}`
        : "/api/languages";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          level,
          proficiency: Number(proficiency),
          orderIndex: Number(orderIndex),
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      router.push("/admin/languages");
    } catch (err) {
      console.error(err);
      alert("Failed to save language.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? "Edit Language" : "New Language"}
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {isEditing ? "Update the language details." : "Add a new language."}
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
            placeholder="e.g. Français"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Level *
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="input-field w-full"
          >
            {levelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Proficiency ({proficiency}%)
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={proficiency}
            onChange={(e) => setProficiency(Number(e.target.value))}
            className="w-full accent-white"
          />
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

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <Link
            href="/admin/languages"
            className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
