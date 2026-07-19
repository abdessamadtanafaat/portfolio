import type { Metadata } from "next";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Experience } from "@/components/public/Experience";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { Skills } from "@/components/public/Skills";
import { Education } from "@/components/public/Education";
import { Certificates } from "@/components/public/Certificates";
import { Languages } from "@/components/public/Languages";
import { Volunteering } from "@/components/public/Volunteering";
import { SoftSkills } from "@/components/public/SoftSkills";
import { Contact } from "@/components/public/Contact";
import { CustomSectionBlock } from "@/components/public/CustomSection";
import { getPortfolioData, getSeoForPage } from "@/lib/queries/portfolio";
import { locales } from "@/i18n/config";
import { PageTransition } from "@/components/public/PageTransition";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoForPage("/", locale);

  const title = seo?.title || "Abdessamad Tanafaat | Full-Stack Engineer";
  const description = seo?.description || "Full-Stack Engineer specialized in PHP 8, Drupal 10/11, Laravel 12, Symfony 8 and React — Casablanca, Morocco.";

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `/${loc}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getPortfolioData(locale);

  return (
    <PageTransition>
      <Hero
        name={data.personal?.name ?? ""}
        title={data.personal?.title ?? ""}
        tagline={data.personal?.tagline ?? null}
        socialLinks={data.socialLinks.map((sl) => ({
          platform: sl.platform,
          url: sl.url,
          label: sl.label,
        }))}
        homepage={data.homepage}
      />
      <About homepage={data.homepage} differentiators={data.differentiators} />
      <Experience experiences={data.experiences} homepage={data.homepage} socialLinks={data.socialLinks} />
      <ProjectsSection projects={data.projects} homepage={data.homepage} />
      <Skills skills={data.skills} homepage={data.homepage} technologies={data.technologies} />
      <Education education={data.education} certificates={data.certificates} homepage={data.homepage} />
      <Certificates certificates={data.certificates} homepage={data.homepage} />
      <Languages languages={data.languages} homepage={data.homepage} />
      <Volunteering entries={data.volunteeringEntries} homepage={data.homepage} />
      <SoftSkills skills={data.softSkills} homepage={data.homepage} />
      {data.customSections.map((section) => (
        <CustomSectionBlock key={section.id} section={section} items={section.items} />
      ))}
      <Contact personal={data.personal} socialLinks={data.socialLinks} homepage={data.homepage} formFields={data.formFields} formSettings={data.formSettings} />
    </PageTransition>
  );
}
