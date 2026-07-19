"use client";

import Link from "next/link";
import { Pencil, Heart } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";

function tsToDate(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

interface VolunteeringItem {
  id: number;
  role: string;
  organization: string;
  startDate: number;
  endDate: number | null;
  orderIndex: number;
  [key: string]: unknown;
}

export function VolunteeringListClient({ data }: { data: VolunteeringItem[] }) {
  const handleReorder = async (reordered: VolunteeringItem[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/volunteering", {
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
      title="Volunteering"
      onReorder={handleReorder}
      subtitle="Manage the volunteering & engagement section."
      newHref="/admin/volunteering/new"
      newLabel="New Entry"
      data={data}
      keyField="id"
      emptyIcon={<Heart className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No volunteering entries yet."
      emptyCta="Add your first entry"
      columns={[
        {
          key: "role",
          header: "Role",
          render: (item) => <span className="font-medium text-slate-900 dark:text-white">{String(item.role)}</span>,
        },
        {
          key: "organization",
          header: "Organization",
          render: (item) => <span className="text-slate-600 dark:text-slate-400 text-sm">{String(item.organization)}</span>,
        },
        {
          key: "startDate",
          header: "Start Date",
          searchable: false,
          render: (item) => <span className="text-slate-600 dark:text-slate-400 text-sm tabular-nums">{tsToDate(Number(item.startDate))}</span>,
        },
        {
          key: "endDate",
          header: "End Date",
          searchable: false,
          render: (item) => (
            <span className="text-slate-600 dark:text-slate-400 text-sm tabular-nums">
              {item.endDate ? tsToDate(Number(item.endDate)) : (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Présent
                </span>
              )}
            </span>
          ),
        },
        {
          key: "orderIndex",
          header: "Order",
          searchable: false,
          render: (item) => <span className="text-slate-600 dark:text-slate-400 tabular-nums">{String(item.orderIndex)}</span>,
        },
        {
          key: "actions",
          header: "Actions",
          searchable: false,
          render: (item) => (
            <div className="flex items-center gap-1">
              <Link href={`/admin/volunteering/${item.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(item.id)} apiEndpoint="/api/volunteering" />
            </div>
          ),
        },
      ]}
    />
  );
}
