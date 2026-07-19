"use client";

import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

interface CertificatesInProgressEditorProps {
  value: string;
  onChange: (json: string) => void;
}

function parseItems(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CertificatesInProgressEditor({ value, onChange }: CertificatesInProgressEditorProps) {
  const [items, setItems] = useState<string[]>(() => parseItems(value));
  const [newItem, setNewItem] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const emit = (next: string[]) => {
    setItems(next);
    onChange(JSON.stringify(next));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    emit([...items, newItem.trim()]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    emit(items.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditing(index);
    setEditValue(items[index]);
  };

  const saveEdit = () => {
    if (editing === null) return;
    const next = items.map((item, i) => i === editing ? editValue.trim() : item).filter(Boolean);
    emit(next);
    setEditing(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 border border-brand-200/50 dark:border-brand-800/30">
            {editing === index ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                className="bg-transparent text-sm text-brand-700 dark:text-brand-300 outline-none w-32"
                autoFocus
              />
            ) : (
              <span
                className="text-sm text-brand-700 dark:text-brand-300 cursor-pointer hover:underline"
                onClick={() => startEdit(index)}
              >
                {item}
              </span>
            )}
            <button type="button" onClick={() => removeItem(index)} className="text-brand-400 hover:text-red-500 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
          placeholder="Add certificate name..."
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 transition-all"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!newItem.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}
