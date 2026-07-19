"use client";

import { usePathname } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import en from "../../messages/admin/en.json";
import fr from "../../messages/admin/fr.json";
import ar from "../../messages/admin/ar.json";

const adminMessages: Record<Locale, Record<string, string>> = { en, fr, ar };

export function useAdminTranslations() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const locale: Locale =
    segments[1] && locales.includes(segments[1] as Locale)
      ? (segments[1] as Locale)
      : defaultLocale;

  const messages = adminMessages[locale] || adminMessages.en;

  const t = (key: string): string => {
    return messages[key] || key;
  };

  return { t, locale };
}
