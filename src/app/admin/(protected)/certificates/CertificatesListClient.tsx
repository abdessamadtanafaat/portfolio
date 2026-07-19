"use client";

import Link from "next/link";
import { Pencil, Award } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: number;
  expiryDate: number | null;
  credentialUrl: string | null;
  [key: string]: unknown;
}

export function CertificatesListClient({ data }: { data: Certificate[] }) {
  const handleReorder = async (reordered: Certificate[]) => {
    try {
      const payload = reordered.map((item) => ({ id: Number(item.id), orderIndex: item.orderIndex as number }));
      await fetch("/api/certificates", {
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
      title="Certificates"
      onReorder={handleReorder}
      newHref="/admin/certificates/new"
      newLabel="New Certificate"
      data={data}
      keyField="id"
      emptyIcon={<Award className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
      emptyMessage="No certificates yet."
      emptyCta="Add Certificate"
      columns={[
        {
          key: "name",
          header: "Name",
          render: (c) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {String(c.name)}
              {c.credentialUrl && (
                <a href={String(c.credentialUrl)} target="_blank" rel="noopener noreferrer" className="block text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  View credential
                </a>
              )}
            </span>
          ),
        },
        {
          key: "issuer",
          header: "Issuer",
          render: (c) => <span className="text-slate-600 dark:text-slate-300">{String(c.issuer)}</span>,
        },
        {
          key: "issueDate",
          header: "Issued",
          render: (c) => <span className="text-slate-600 dark:text-slate-300">{formatDate(c.issueDate as number)}</span>,
        },
        {
          key: "expiryDate",
          header: "Expires",
          render: (c) => <span className="text-slate-600 dark:text-slate-300">{c.expiryDate ? formatDate(c.expiryDate as number) : "No expiry"}</span>,
        },
        {
          key: "actions",
          header: "Actions",
          searchable: false,
          render: (c) => (
            <div className="flex items-center gap-1">
              <Link href={`/admin/certificates/${c.id}`} className="btn-ghost text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton id={Number(c.id)} apiEndpoint="/api/certificates" />
            </div>
          ),
        },
      ]}
    />
  );
}
