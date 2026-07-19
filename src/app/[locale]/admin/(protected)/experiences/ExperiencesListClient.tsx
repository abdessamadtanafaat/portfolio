"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Building2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

interface Experience {
  id: number;
  role: string;
  company: string;
  startDate: number;
  endDate: number | null;
  current: number | boolean;
  [key: string]: unknown;
}

export function ExperiencesListClient({ data, locale }: { data: Experience[]; locale: string }) {
  const router = useRouter();
  const handleReorder = async (reordered: Experience[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/experiences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  };

  return (
    <DataTable
      title="Experiences"
      onReorder={handleReorder}
      newHref="/admin/experiences/new"
      newLabel="New Experience"
      data={data}
      keyField="id"
      headerAction={<LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />}
      emptyIcon={<Building2 className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No experiences yet. Add your work history."
      emptyCta="Add Experience"
      columns={[
        {
          key: "role",
          header: "Role",
          render: (e) => <span className="font-medium text-slate-900 dark:text-white">{String(e.role)}</span>,
        },
        {
          key: "company",
          header: "Company",
          render: (e) => <span className="text-slate-600 dark:text-slate-300">{String(e.company)}</span>,
        },
        {
          key: "startDate",
          header: "Period",
          render: (e) => (
            <span className="text-slate-600 dark:text-slate-300">
              {formatDate(e.startDate as number)} — {e.endDate ? formatDate(e.endDate as number) : "Present"}
            </span>
          ),
        },
        {
          key: "current",
          header: "Current",
          render: (e) =>
            e.current ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> Current
              </span>
            ) : (
              <span className="text-slate-400">&mdash;</span>
            ),
        },
        {
          key: "actions",
          header: "Actions",
          searchable: false,
          render: (e) => (
            <div className="flex items-center gap-1">
              <Link href={`/admin/experiences/${e.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(e.id)} apiEndpoint="/api/experiences" />
            </div>
          ),
        },
      ]}
    />
  );
}
