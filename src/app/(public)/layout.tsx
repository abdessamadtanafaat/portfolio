import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { getPortfolioData } from "@/lib/queries/portfolio";
import { MaintenancePage } from "@/components/public/MaintenancePage";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let data;
  try {
    data = await getPortfolioData();
  } catch {
    data = { personal: null, projects: [], skills: [], experiences: [], education: [], certificates: [], socialLinks: [], homepage: null, differentiators: [], siteSettings: null, technologies: [], navItems: [], formFields: [], formSettings: null };
  }

  const isMaintenance = data?.siteSettings?.maintenanceMode ?? false;

  if (isMaintenance) {
    return <MaintenancePage message={data?.siteSettings?.maintenanceMessage ?? undefined} />;
  }

  return (
    <>
      <Navbar name={data?.personal?.name} navItems={data?.navItems ?? []} />
      <main className="flex-1">{children}</main>
      <Footer personal={data?.personal ?? null} socialLinks={data?.socialLinks ?? []} technologies={data?.technologies ?? []} homepage={data?.homepage ?? null} navItems={data?.navItems ?? []} />
    </>
  );
}
