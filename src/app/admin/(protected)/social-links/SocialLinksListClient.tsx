"use client";

import Link from "next/link";
import { Pencil, Link as LinkIcon } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  label: string | null;
  [key: string]: unknown;
}

export function SocialLinksListClient({ data }: { data: SocialLink[] }) {
  const handleReorder = async (reordered: SocialLink[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/social-links", {
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
      title="Social Links"
      onReorder={handleReorder}
      newHref="/admin/social-links/new"
      newLabel="New Link"
      data={data}
      keyField="id"
      emptyIcon={<LinkIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No social links yet."
      emptyCta="Add your first link"
      columns={[
        {
          key: "platform",
          header: "Platform",
          render: (l) => <span className="font-medium text-slate-900 dark:text-white capitalize">{String(l.platform)}</span>,
        },
        {
          key: "url",
          header: "URL",
          render: (l) => <span className="text-slate-600 dark:text-slate-400 max-w-xs truncate block">{String(l.url)}</span>,
        },
        {
          key: "label",
          header: "Label",
          render: (l) => <span className="text-slate-600 dark:text-slate-400">{String(l.label)}</span>,
        },
        {
          key: "actions",
          header: "Actions",
          searchable: false,
          render: (l) => (
            <div className="flex items-center gap-1">
              <Link href={`/admin/social-links/${l.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(l.id)} apiEndpoint="/api/social-links" />
            </div>
          ),
        },
      ]}
    />
  );
}
