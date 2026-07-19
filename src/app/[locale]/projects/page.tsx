import type { Metadata } from "next";
import { ProjectsPageContent } from "./ProjectsPageContent";
import { getProjectsForPage, getSeoForPage } from "@/lib/queries/portfolio";
import { locales } from "@/i18n/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoForPage("/projects", locale);

  const title = seo?.title || "Projects | Abdessamad Tanafaat";
  const description = seo?.description || "Discover my production projects: institutional sites, multi-tenant back-office, HR applications and more.";

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `/${loc}/projects`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: alternates,
    },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: seo?.ogImageUrl ? [seo.ogImageUrl] : undefined,
      locale,
      type: "website",
    },
    twitter: {
      card: (seo?.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await getProjectsForPage(locale);
  return <ProjectsPageContent projects={projects} />;
}
