"use client";

import Link from "next/link";
import { Pencil, Sparkles } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface Differentiator {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string | null;
  visible: boolean;
  orderIndex: number;
  [key: string]: unknown;
}

export function DifferentiatorsListClient({ data }: { data: Differentiator[] }) {
  const handleReorder = async (reordered: Differentiator[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/differentiators", {
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
      title="Differentiators"
      onReorder={handleReorder}
      subtitle="Manage the 'Ce qui me distingue' section cards."
      newHref="/admin/differentiators/new"
      newLabel="New Differentiator"
      data={data}
      keyField="id"
      emptyIcon={<Sparkles className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No differentiators yet."
      emptyCta="Add your first differentiator"
      columns={[
        {
          key: "title",
          header: "Title",
          render: (item) => <span className="font-medium text-slate-900 dark:text-white">{String(item.title)}</span>,
        },
        {
          key: "description",
          header: "Description",
          render: (item) => <span className="text-slate-600 dark:text-slate-400 text-sm max-w-xs truncate block">{String(item.description)}</span>,
        },
        {
          key: "icon",
          header: "Icon",
          render: (item) => <span className="text-slate-600 dark:text-slate-400">{String(item.icon)}</span>,
        },
        {
          key: "color",
          header: "Color",
          render: (item) => (
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {String(item.color)}
            </span>
          ),
        },
        {
          key: "visible",
          header: "Visible",
          searchable: false,
          render: (item) =>
            item.visible ? (
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Visible</span>
            ) : (
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Hidden</span>
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
              <Link href={`/admin/differentiators/${item.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(item.id)} apiEndpoint="/api/differentiators" />
            </div>
          ),
        },
      ]}
    />
  );
}
