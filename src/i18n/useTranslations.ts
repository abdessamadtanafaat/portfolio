"use client";

import { useLocaleContext } from "@/components/providers/LocaleProvider";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import ar from "../../messages/ar.json";

const messages: Record<string, typeof en> = { en, fr, ar };

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T & string]: K | `${K}.${NestedKeyOf<T[K]>}` }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof en>;

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function useTranslations() {
  const { locale } = useLocaleContext();

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    const msgs = messages[locale] || messages.en;
    let value = getNestedValue(msgs as Record<string, unknown>, key);
    if (value === undefined) {
      value = getNestedValue(en as Record<string, unknown>, key);
    }
    if (value === undefined) return key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value!.replace(new RegExp(`\\{${k}\\}`, "g"), v);
      });
    }
    return value;
  };

  return { t, locale };
}
