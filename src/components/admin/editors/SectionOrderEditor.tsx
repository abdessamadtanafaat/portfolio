"use client";

import React, { useState } from "react";
import { GripVertical, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";

interface SectionItem {
  id: string;
  label: string;
  visible: boolean;
}

interface SectionOrderEditorProps {
  sections: SectionItem[];
  onChange: (sections: SectionItem[]) => void;
}

export function SectionOrderEditor({ sections: initial, onChange }: SectionOrderEditorProps) {
  const [sections, setSections] = useState(initial);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...sections];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setSections(next);
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const next = [...sections];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setSections(next);
    onChange(next);
  };

  const toggleVisible = (index: number) => {
    const next = sections.map((s, i) => i === index ? { ...s, visible: !s.visible } : s);
    setSections(next);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
            section.visible
              ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-60"
          }`}
        >
          <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs text-slate-400 dark:text-slate-500 w-5 text-center">{index + 1}</span>
            <span className={`text-sm font-medium ${section.visible ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
              {section.label}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Move up"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => moveDown(index)}
              disabled={index === sections.length - 1}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Move down"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => toggleVisible(index)}
              className={`p-1 rounded transition-colors ${
                section.visible
                  ? "text-brand-500 hover:text-brand-600"
                  : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
              }`}
              aria-label={section.visible ? "Hide section" : "Show section"}
            >
              {section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
