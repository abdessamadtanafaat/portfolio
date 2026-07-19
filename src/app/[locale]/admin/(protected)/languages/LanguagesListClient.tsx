"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Globe } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

interface LanguageItem {
  id: number;
  name: string;
  level: string;
  proficiency: number;
  orderIndex: number;
  [key: string]: unknown;
}

export function LanguagesListClient({ data, locale }: { data: LanguageItem[]; locale: string }) {
  const router = useRouter();
  const handleReorder = async (reordered: LanguageItem[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/languages", {
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
      title="Languages"
      onReorder={handleReorder}
      subtitle="Manage the languages section."
      newHref="/admin/languages/new"
      newLabel="New Language"
      data={data}
      keyField="id"
      headerAction={<LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />}
      emptyIcon={<Globe className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No languages yet."
      emptyCta="Add your first language"
      columns={[
        {
          key: "name",
          header: "Name",
          render: (item) => <span className="font-medium text-slate-900 dark:text-white">{String(item.name)}</span>,
        },
        {
          key: "level",
          header: "Level",
          render: (item) => (
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {String(item.level)}
            </span>
          ),
        },
        {
          key: "proficiency",
          header: "Proficiency",
          searchable: false,
          render: (item) => {
            const val = Number(item.proficiency);
            return (
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500" style={{ width: `${val}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums w-8">{val}%</span>
              </div>
            );
          },
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
              <Link href={`/admin/languages/${item.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(item.id)} apiEndpoint="/api/languages" />
            </div>
          ),
        },
      ]}
    />
  );
}
