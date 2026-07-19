"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface VolunteeringData {
  id: number;
  role: string;
  organization: string;
  startDate: number;
  endDate: number | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  orderIndex: number;
}

function tsToInputDate(ts: number | null): string {
  if (!ts) return "";
  return new Date(ts * 1000).toISOString().split("T")[0];
}

function inputDateToTs(dateStr: string): number | null {
  if (!dateStr) return null;
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

const colorOptions = [
  { value: "brand", label: "Brand" },
  { value: "emerald", label: "Emerald" },
  { value: "violet", label: "Violet" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
  { value: "blue", label: "Blue" },
  { value: "slate", label: "Slate" },
] as const;

export function VolunteeringForm({ data }: { data: VolunteeringData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(data?.role ?? "");
  const [organization, setOrganization] = useState(data?.organization ?? "");
  const [startDate, setStartDate] = useState(tsToInputDate(data?.startDate ?? null));
  const [endDate, setEndDate] = useState(tsToInputDate(data?.endDate ?? null));
  const [description, setDescription] = useState(data?.description ?? "");
  const [icon, setIcon] = useState(data?.icon ?? "Users");
  const [color, setColor] = useState(data?.color ?? "brand");
  const [orderIndex, setOrderIndex] = useState(data?.orderIndex ?? 0);

  const isEditing = !!data;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/volunteering/${data.id}`
        : "/api/volunteering";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          organization,
          startDate: inputDateToTs(startDate),
          endDate: inputDateToTs(endDate),
          description: description || null,
          icon,
          color,
          orderIndex: Number(orderIndex),
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      router.push("/admin/volunteering");
    } catch (err) {
      console.error(err);
      alert("Failed to save entry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? "Edit Entry" : "New Entry"}
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {isEditing ? "Update the volunteering entry." : "Add a new volunteering entry."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Role *
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="input-field w-full"
            placeholder="e.g. Mentor technique"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Organization *
          </label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            className="input-field w-full"
            placeholder="e.g. Code for France"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-field w-full resize-none"
            placeholder="Describe your role and contributions..."
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Icon
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="input-field w-full"
              placeholder="e.g. Users"
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
            href="/admin/volunteering"
            className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
