"use client";

import React, { createContext, useContext, useCallback, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type Locale, locales, defaultLocale } from "@/i18n/config";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  isPending: false,
});

export function LocaleProvider({
  locale: initialLocale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!locales.includes(newLocale)) return;
      startTransition(() => {
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;samesite=lax`;
        setLocaleState(newLocale);
        const segments = pathname.split("/");
        const currentLocale = segments[1];
        if (locales.includes(currentLocale as Locale)) {
          segments[1] = newLocale;
        } else {
          segments.splice(1, 0, newLocale);
        }
        router.push(segments.join("/") || `/${newLocale}`);
      });
    },
    [pathname, router]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}
