"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Loader2 } from "lucide-react";

export type FieldOption = { label: string; value: string };

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "checkbox" | "date" | "image";
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  rows?: number;
  min?: number;
  max?: number;
  helpText?: string;
  span?: 1 | 2;
};

interface EntityFormProps {
  title: string;
  entityName: string;
  fields: FieldConfig[];
  apiEndpoint: string;
  id?: string;
  backHref: string;
  onTransformSubmit?: (data: Record<string, unknown>) => Record<string, unknown>;
  onTransformLoad?: (data: Record<string, unknown>) => Record<string, unknown>;
}

export function EntityForm({
  title,
  entityName,
  fields,
  apiEndpoint,
  id,
  backHref,
  onTransformSubmit,
  onTransformLoad,
}: EntityFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const getDefaults = () => {
    const defaults: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") defaults[f.name] = false;
      else if (f.type === "number") defaults[f.name] = 0;
      else defaults[f.name] = "";
    });
    return defaults;
  };

  const [form, setForm] = useState<Record<string, unknown>>(getDefaults);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`${apiEndpoint}/${id}`)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        const loaded = onTransformLoad ? onTransformLoad(data) : data;
        const populated: Record<string, unknown> = {};
        fields.forEach((f) => {
          if (f.type === "checkbox") populated[f.name] = !!loaded[f.name];
          else if (f.type === "number") populated[f.name] = Number(loaded[f.name] ?? 0);
          else populated[f.name] = loaded[f.name] ?? "";
        });
        setForm(populated);
        setLoading(false);
      })
      .catch(() => { setError(`Failed to load ${entityName}`); setLoading(false); });
  }, [id, isEdit, apiEndpoint, entityName, fields, onTransformLoad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = onTransformSubmit ? onTransformSubmit(form) : form;
      const res = await fetch(isEdit ? `${apiEndpoint}/${id}` : apiEndpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast("success", `${entityName} ${isEdit ? "saved" : "created"} successfully`);
      router.push(backHref);
      router.refresh();
    } catch {
      setError(`Failed to ${isEdit ? "save" : "create"} ${entityName}. Please try again.`);
      toast("error", `Failed to ${isEdit ? "save" : "create"} ${entityName}`);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("success", `${entityName} deleted`);
      router.push(backHref);
      router.refresh();
    } catch {
      toast("error", `Failed to delete ${entityName}`);
      setShowDelete(false);
    }
  };

  const updateField = (name: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const renderField = (field: FieldConfig) => {
    const value = form[field.name];
    const colSpan = field.span === 2 ? "sm:col-span-2" : "";

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.name} className={colSpan}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
            <Textarea
              rows={field.rows ?? 4}
              value={String(value)}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
            {field.helpText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{field.helpText}</p>}
          </div>
        );
      case "select":
        return (
          <div key={field.name} className={colSpan}>
            <Select
              label={field.label}
              value={String(value)}
              onChange={(e) => updateField(field.name, e.target.value)}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
            {field.helpText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{field.helpText}</p>}
          </div>
        );
      case "checkbox":
        return (
          <div key={field.name} className={colSpan}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => updateField(field.name, e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 transition-all duration-150 peer-checked:border-slate-900 peer-checked:bg-slate-900 dark:peer-checked:border-white dark:peer-checked:bg-white group-hover:border-slate-400 dark:group-hover:border-slate-500" />
                {!!value && (
                  <svg className="absolute inset-0 h-5 w-5 p-0.5 text-white dark:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</span>
            </label>
          </div>
        );
      case "image":
        return (
          <div key={field.name} className={colSpan}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
            <Input
              value={String(value ?? "")}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder="https://..."
            />
            {field.helpText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{field.helpText}</p>}
            {!!value && <ImagePreview url={String(value)} alt={`${field.label} preview`} className="mt-3 h-32" />}
          </div>
        );
      case "number":
        return (
          <div key={field.name} className={colSpan}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
            <Input
              type="number"
              value={String(value)}
              onChange={(e) => updateField(field.name, Number(e.target.value))}
              min={field.min}
              max={field.max}
            />
            {field.helpText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{field.helpText}</p>}
          </div>
        );
      case "date":
        return (
          <div key={field.name} className={colSpan}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
            <Input
              type="date"
              value={String(value)}
              onChange={(e) => updateField(field.name, e.target.value)}
            />
          </div>
        );
      default:
        return (
          <div key={field.name} className={colSpan}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <Input
              value={String(value)}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.helpText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{field.helpText}</p>}
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(backHref)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all duration-150"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {isEdit ? `Editing ${entityName.toLowerCase()}` : `Create a new ${entityName.toLowerCase()}`}
            </p>
          </div>
        </div>
        {isEdit && (
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
            Delete
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map(renderField)}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </span>
            ) : (
              isEdit ? "Save Changes" : `Create ${entityName}`
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(backHref)}>
            Cancel
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={showDelete}
        title={`Delete ${entityName}`}
        message={`Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
