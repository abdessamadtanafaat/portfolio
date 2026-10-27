const monthNames: Record<string, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fr: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};

const presentLabel: Record<string, string> = {
  en: "Present",
  fr: "Présent",
  ar: "الحالي",
};

export function tsToYear(ts: number | null): string {
  if (!ts) return "";
  return new Date(ts * 1000).getFullYear().toString();
}

function tsToMonthYear(ts: number | null, locale: string = "en"): string {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  const months = monthNames[locale] || monthNames.en;
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatExperienceDate(
  startTs: number | null,
  endTs: number | null,
  current: boolean,
  locale: string = "en",
): string {
  const start = tsToMonthYear(startTs, locale);
  const end = current ? (presentLabel[locale] || presentLabel.en) : tsToMonthYear(endTs, locale);
  return end ? `${start} – ${end}` : start;
}

export function formatEducationDate(
  startTs: number | null,
  endTs: number | null,
  locale: string = "en",
): string {
  return `${tsToYear(startTs)} – ${tsToYear(endTs) || (presentLabel[locale] || presentLabel.en)}`;
}

export function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseJsonObject<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
