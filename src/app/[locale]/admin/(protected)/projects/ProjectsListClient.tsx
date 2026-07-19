"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Briefcase } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

const statusColors: Record<string, string> = {
  production: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  staging: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  prototype: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  archived: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

interface Project {
  id: number;
  title: string;
  subtitle: string | null;
  category: string;
  status: string;
  featured: number | boolean;
  [key: string]: unknown;
}

export function ProjectsListClient({ data, locale }: { data: Project[]; locale: string }) {
  const router = useRouter();
  const handleReorder = async (reordered: Project[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/projects", {
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
      title="Projects"
      onReorder={handleReorder}
      newHref="/admin/projects/new"
      newLabel="New Project"
      data={data}
      keyField="id"
      headerAction={<LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />}
      emptyIcon={<Briefcase className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No projects yet. Create your first one!"
      emptyCta="Create Project"
      columns={[
        {
          key: "title",
          header: "Title",
          render: (p) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {String(p.title)}
              {p.subtitle && <span className="block text-xs text-slate-500 dark:text-slate-400">{String(p.subtitle)}</span>}
            </span>
          ),
        },
        {
          key: "category",
          header: "Category",
          render: (p) => <span className="text-slate-600 dark:text-slate-300 capitalize">{String(p.category)}</span>,
        },
        {
          key: "status",
          header: "Status",
          render: (p) => (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[String(p.status)] ?? ""}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {String(p.status)}
            </span>
          ),
        },
        {
          key: "featured",
          header: "Featured",
          render: (p) => (
            p.featured
              ? <span className="text-amber-500">&#9733;</span>
              : <span className="text-slate-300 dark:text-slate-600">&#9734;</span>
          ),
        },
        {
          key: "actions",
          header: "Actions",
          searchable: false,
          render: (p) => (
            <div className="flex items-center gap-1">
              <Link href={`/admin/projects/${p.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(p.id)} apiEndpoint="/api/projects" />
            </div>
          ),
        },
      ]}
    />
  );
}
