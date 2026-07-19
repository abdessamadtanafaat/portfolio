"use client";

import React from "react";
import { Globe } from "lucide-react";

const locales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

interface LocaleSelectorProps {
  value: string;
  onChange: (locale: string) => void;
}

export function LocaleSelector({ value, onChange }: LocaleSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-slate-400" />
      <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {locales.map((loc) => (
          <button
            key={loc.code}
            onClick={() => onChange(loc.code)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              value === loc.code
                ? "bg-brand-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
