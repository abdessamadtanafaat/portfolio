"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Sparkles } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getIconComponent } from "@/components/admin/editors/IconPicker";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

interface SoftSkillItem {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  orderIndex: number;
  [key: string]: unknown;
}

export function SoftSkillsListClient({ data, locale }: { data: SoftSkillItem[]; locale: string }) {
  const router = useRouter();
  const handleReorder = async (reordered: SoftSkillItem[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/soft-skills", {
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
      title="Soft Skills & Hobbies"
      onReorder={handleReorder}
      subtitle="Manage the soft skills and hobbies section."
      newHref="/admin/soft-skills/new"
      newLabel="New Soft Skill"
      data={data}
      keyField="id"
      headerAction={<LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />}
      emptyIcon={<Sparkles className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No soft skills yet."
      emptyCta="Add your first soft skill"
      columns={[
        {
          key: "name",
          header: "Name",
          render: (item) => <span className="font-medium text-slate-900 dark:text-white">{String(item.name)}</span>,
        },
        {
          key: "category",
          header: "Category",
          render: (item) => (
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              item.category === "hobby"
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                : "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
            }`}>
              {item.category === "hobby" ? "Hobby" : "Soft Skill"}
            </span>
          ),
        },
        {
          key: "icon",
          header: "Icon",
          render: (item) => {
            const IconComp = item.icon ? getIconComponent(String(item.icon)) : Sparkles;
            return (
              <div className="flex items-center gap-2">
                <IconComp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 text-sm">{String(item.icon)}</span>
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
              <Link href={`/admin/soft-skills/${item.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(item.id)} apiEndpoint="/api/soft-skills" />
            </div>
          ),
        },
      ]}
    />
  );
}
