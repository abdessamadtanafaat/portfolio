"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, FileText, Loader2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LocaleSelector } from "@/components/admin/LocaleSelector";

interface FormField {
  id: number;
  formType: string;
  label: string;
  name: string;
  type: string;
  placeholder: string | null;
  helperText: string | null;
  required: boolean;
  visible: boolean;
  options: string | null;
  validation: string | null;
  orderIndex: number;
  createdAt: number;
}

interface FormSettings {
  id: number;
  formType: string;
  submitButtonText: string;
  loadingButtonText: string;
  successMessage: string;
  errorMessage: string;
  createdAt: number;
  updatedAt: number;
}

interface Props {
  fields: FormField[];
  settings: FormSettings | null;
  locale: string;
}

const typeColors: Record<string, string> = {
  text: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  email: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  textarea: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  phone: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  url: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  number: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  date: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  checkbox: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  radio: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  select: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export function FormsListClient({ fields, settings, locale }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [submitButtonText, setSubmitButtonText] = useState(settings?.submitButtonText ?? "Envoyer le message");
  const [loadingButtonText, setLoadingButtonText] = useState(settings?.loadingButtonText ?? "Envoi en cours...");
  const [successMessage, setSuccessMessage] = useState(settings?.successMessage ?? "");
  const [errorMessage, setErrorMessage] = useState(settings?.errorMessage ?? "");

  async function handleSettingsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/form-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submitButtonText, loadingButtonText, successMessage, errorMessage, locale }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: "Settings saved." });
    } catch {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <DataTable
        title="Form Builder"
        subtitle="Manage form fields and settings for the contact form."
        newHref="/admin/forms/new"
        newLabel="New Field"
        data={fields as unknown as Record<string, unknown>[]}
        keyField="id"
        headerAction={<LocaleSelector value={locale} onChange={(l) => router.push(`?locale=${l}`)} />}
        emptyIcon={<FileText className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />}
        emptyMessage="No form fields yet."
        emptyCta="Add your first field"
        columns={[
          {
            key: "label",
            header: "Label",
            render: (f) => <span className="font-medium text-slate-900 dark:text-white">{String(f.label)}</span>,
          },
          {
            key: "name",
            header: "Name",
            render: (f) => <span className="text-slate-600 dark:text-slate-400 font-mono text-xs">{String(f.name)}</span>,
          },
          {
            key: "type",
            header: "Type",
            render: (f) => (
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${typeColors[String(f.type)] ?? ""}`}>
                {String(f.type)}
              </span>
            ),
          },
          {
            key: "formType",
            header: "Form",
            render: (f) => <span className="text-slate-600 dark:text-slate-400 capitalize">{String(f.formType)}</span>,
          },
          {
            key: "required",
            header: "Required",
            searchable: false,
            render: (f) =>
              f.required ? (
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Yes</span>
              ) : (
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">No</span>
              ),
          },
          {
            key: "orderIndex",
            header: "Order",
            searchable: false,
            render: (f) => <span className="text-slate-600 dark:text-slate-400 tabular-nums">{String(f.orderIndex)}</span>,
          },
          {
            key: "actions",
            header: "Actions",
            searchable: false,
            render: (f) => (
              <div className="flex items-center gap-1">
                <Link href={`/admin/forms/${f.id}`} className="btn-ghost text-xs">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <DeleteButton id={Number(f.id)} apiEndpoint="/api/form-fields" />
              </div>
            ),
          },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Form Settings</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Configure button text and messages for the contact form.</p>
        </div>
        <form onSubmit={handleSettingsSubmit} className="p-5 space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Submit Button Text</label>
              <input
                type="text"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Loading Button Text</label>
              <input
                type="text"
                value={loadingButtonText}
                onChange={(e) => setLoadingButtonText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Success Message</label>
            <textarea
              rows={2}
              value={successMessage}
              onChange={(e) => setSuccessMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Error Message</label>
            <textarea
              rows={2}
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150 resize-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition-all duration-150 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Settings
            </button>
            {message && (
              <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {message.text}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
