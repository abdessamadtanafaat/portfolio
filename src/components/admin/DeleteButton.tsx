"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  id: number;
  apiEndpoint: string;
  label?: string;
  confirmMessage?: string;
}

export function DeleteButton({ id, apiEndpoint, label = "Delete", confirmMessage }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const message = confirmMessage || `Are you sure you want to delete this item? This action cannot be undone.`;
    if (!window.confirm(message)) return;

    setDeleting(true);
    try {
      const res = await fetch(`${apiEndpoint}?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-lg transition-colors disabled:opacity-50"
      aria-label={label}
    >
      {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
    </button>
  );
}
