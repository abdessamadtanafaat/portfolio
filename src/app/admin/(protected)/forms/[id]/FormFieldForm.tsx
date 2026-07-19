"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface FormFieldData {
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

interface Props {
  data: FormFieldData | null;
}

const typeOptions = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Textarea", value: "textarea" },
  { label: "Phone", value: "phone" },
  { label: "URL", value: "url" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Radio", value: "radio" },
  { label: "Select", value: "select" },
];

export function FormFieldForm({ data }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formType, setFormType] = useState(data?.formType ?? "contact");
  const [label, setLabel] = useState(data?.label ?? "");
  const [name, setName] = useState(data?.name ?? "");
  const [type, setType] = useState(data?.type ?? "text");
  const [placeholder, setPlaceholder] = useState(data?.placeholder ?? "");
  const [helperText, setHelperText] = useState(data?.helperText ?? "");
  const [required, setRequired] = useState(data?.required ?? true);
  const [visible, setVisible] = useState(data?.visible ?? true);
  const [orderIndex, setOrderIndex] = useState(data?.orderIndex ?? 0);
  const [options, setOptions] = useState(data?.options ?? "");
  const [validation, setValidation] = useState(data?.validation ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const body = {
        formType,
        label,
        name,
        type,
        placeholder: placeholder || null,
        helperText: helperText || null,
        required,
        visible,
        orderIndex,
        options: options || null,
        validation: validation || null,
      };

      const url = data ? `/api/form-fields/${data.id}` : "/api/form-fields";
      const method = data ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Failed to save");
      }

      router.push("/admin/forms");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/forms"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {data ? "Edit Field" : "New Field"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {data ? "Update form field configuration" : "Add a new form field"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Form Type</label>
            <input type="text" value={formType} onChange={(e) => setFormType(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Type <span className="text-red-500">*</span></label>
            <select value={type} onChange={(e) => setType(e.target.value)} required className={inputClass}>
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Label <span className="text-red-500">*</span></label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} required className={inputClass} placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={`${inputClass} font-mono`} placeholder="name" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Placeholder</label>
            <input type="text" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Helper Text</label>
            <input type="text" value={helperText} onChange={(e) => setHelperText(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Validation Pattern</label>
            <input type="text" value={validation} onChange={(e) => setValidation(e.target.value)} className={inputClass} placeholder="e.g. ^[a-zA-Z]+$" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Order Index</label>
            <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} className={inputClass} />
          </div>
        </div>

        {(type === "select" || type === "radio" || type === "checkbox") && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Options (JSON array)</label>
            <textarea
              rows={4}
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className={`${inputClass} font-mono resize-none`}
              placeholder='[{"value": "opt1", "label": "Option 1"}, {"value": "opt2", "label": "Option 2"}]'
            />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Enter a valid JSON array of objects with &quot;value&quot; and &quot;label&quot; keys.</p>
          </div>
        )}

        <div className="flex items-center gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10 dark:border-slate-600 dark:bg-slate-800"
            />
            Required
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10 dark:border-slate-600 dark:bg-slate-800"
            />
            Visible
          </label>
        </div>

        {error && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition-all duration-150 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {data ? "Update Field" : "Create Field"}
          </button>
          <Link
            href="/admin/forms"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
