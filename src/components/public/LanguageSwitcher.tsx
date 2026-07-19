"use client";

import React from "react";
import { Globe, Check } from "lucide-react";
import { useLocaleContext } from "@/components/providers/LocaleProvider";
import { locales, localeNames } from "@/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale, isPending } = useLocaleContext();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="p-2.5 rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700/80 transition-all duration-200"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xl dark:border-slate-700/80 dark:bg-slate-900/95 z-50 overflow-hidden">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                locale === loc
                  ? "text-brand-700 bg-brand-50 dark:text-brand-400 dark:bg-brand-900/30"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="flex-1 text-left">{localeNames[loc]}</span>
              {locale === loc && <Check className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
