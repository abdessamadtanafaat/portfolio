"use client";

import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { IconPicker } from "./IconPicker";

interface AboutCard {
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

interface AboutCardsEditorProps {
  value: string;
  onChange: (json: string) => void;
}

const colorOptions = [
  { value: "brand", label: "Brand", classes: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400" },
  { value: "emerald", label: "Emerald", classes: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { value: "violet", label: "Violet", classes: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  { value: "amber", label: "Amber", classes: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { value: "blue", label: "Blue", classes: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "rose", label: "Rose", classes: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

function parseCards(json: string): AboutCard[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AboutCardsEditor({ value, onChange }: AboutCardsEditorProps) {
  const [cards, setCards] = useState<AboutCard[]>(() => parseCards(value));
  const [editing, setEditing] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);

  const emit = (next: AboutCard[]) => {
    setCards(next);
    onChange(JSON.stringify(next));
  };

  const addCard = (card: AboutCard) => {
    const next = [...cards, card];
    emit(next);
    setShowNew(false);
  };

  const updateCard = (index: number, card: AboutCard) => {
    const next = cards.map((c, i) => i === index ? card : c);
    emit(next);
    setEditing(null);
  };

  const removeCard = (index: number) => {
    if (!window.confirm("Remove this card?")) return;
    emit(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div key={index}>
          {editing === index ? (
            <CardForm
              data={card}
              onSave={(c) => updateCard(index, c)}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{card.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{card.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setEditing(index)} className="text-xs text-brand-600 dark:text-brand-400 hover:underline px-2 py-1">Edit</button>
                <button type="button" onClick={() => removeCard(index)} className="p-1 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          )}
        </div>
      ))}

      {showNew ? (
        <CardForm onSave={addCard} onCancel={() => setShowNew(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Add card
        </button>
      )}
    </div>
  );
}

function CardForm({ data, onSave, onCancel }: { data?: AboutCard; onSave: (c: AboutCard) => void; onCancel: () => void }) {
  const defaultColor = colorOptions[0];
  const [form, setForm] = useState({
    icon: data?.icon || "Code",
    title: data?.title || "",
    description: data?.description || "",
    color: data?.color || defaultColor.classes,
    bg: data?.bg || defaultColor.classes.split(" ").filter(c => c.startsWith("bg-")).join(" "),
  });

  const selectedColor = colorOptions.find((c) => c.classes === form.color) || defaultColor;

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";

  return (
    <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-900/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{data ? "Edit Card" : "New Card"}</h4>
        <button type="button" onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="flex items-center gap-3">
        <IconPicker value={form.icon} onChange={(v) => setForm((p) => ({ ...p, icon: v }))} />
        <div className="flex-1">
          <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} placeholder="Card title" />
        </div>
      </div>
      <textarea
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        rows={2}
        className={`${inputClass} resize-none`}
        placeholder="Card description"
      />
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Color</label>
        <div className="flex gap-2">
          {colorOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((p) => ({ ...p, color: opt.classes, bg: opt.classes.split(" ").filter(c => c.startsWith("bg-")).join(" ") }))}
              className={`w-8 h-8 rounded-lg ${opt.classes.split(" ").filter(c => c.startsWith("bg-")).join(" ")} border-2 transition-all ${selectedColor.value === opt.value ? "border-slate-900 dark:border-white scale-110" : "border-transparent hover:scale-105"}`}
              title={opt.label}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSave(form)}
        disabled={!form.title}
        className="btn-primary text-sm"
      >
        {data ? "Update" : "Add"}
      </button>
    </div>
  );
}
