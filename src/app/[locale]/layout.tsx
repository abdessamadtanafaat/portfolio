import { LayoutShell } from "@/components/admin/LayoutShell";
import { getPortfolioData } from "@/lib/queries/portfolio";
import { MaintenancePage } from "@/components/public/MaintenancePage";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { UpdateHtmlLocale } from "@/components/providers/UpdateHtmlLocale";
import { type Locale, locales } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : "en";

  let data;
  try {
    data = await getPortfolioData(locale);
  } catch {
    data = { personal: null, projects: [], skills: [], experiences: [], education: [], certificates: [], socialLinks: [], homepage: null, differentiators: [], siteSettings: null, technologies: [], navItems: [], formFields: [], formSettings: null, customSections: [], languages: [], volunteeringEntries: [], softSkills: [] };
  }

  const isMaintenance = data?.siteSettings?.maintenanceMode ?? false;

  if (isMaintenance) {
    return <MaintenancePage message={data?.siteSettings?.maintenanceMessage ?? undefined} />;
  }

  return (
    <LocaleProvider locale={locale}>
      <UpdateHtmlLocale locale={locale} />
      <LayoutShell
        personal={data?.personal ?? null}
        navItems={data?.navItems ?? []}
        socialLinks={data?.socialLinks ?? []}
        technologies={data?.technologies ?? []}
        homepage={data?.homepage ?? null}
      >
        {children}
      </LayoutShell>
    </LocaleProvider>
  );
}
