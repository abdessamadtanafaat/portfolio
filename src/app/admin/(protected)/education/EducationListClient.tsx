"use client";

import Link from "next/link";
import { Pencil, GraduationCap } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  field: string;
  startDate: number;
  endDate: number | null;
  [key: string]: unknown;
}

export function EducationListClient({ data }: { data: Education[] }) {
  const handleReorder = async (reordered: Education[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/education", {
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
      title="Education"
      onReorder={handleReorder}
      newHref="/admin/education/new"
      newLabel="New Education"
      data={data}
      keyField="id"
      emptyIcon={<GraduationCap className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No education entries yet."
      emptyCta="Add Education"
      columns={[
        {
          key: "degree",
          header: "Degree",
          render: (e) => <span className="font-medium text-slate-900 dark:text-white">{String(e.degree)}</span>,
        },
        {
          key: "institution",
          header: "Institution",
          render: (e) => <span className="text-slate-600 dark:text-slate-300">{String(e.institution)}</span>,
        },
        {
          key: "field",
          header: "Field",
          render: (e) => <span className="text-slate-600 dark:text-slate-300">{String(e.field)}</span>,
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
          key: "actions",
          header: "Actions",
          searchable: false,
          render: (e) => (
            <div className="flex items-center gap-1">
              <Link href={`/admin/education/${e.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(e.id)} apiEndpoint="/api/education" />
            </div>
          ),
        },
      ]}
    />
  );
}
