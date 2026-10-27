import { db } from "@/lib/db";
import {
  personalInfo,
  projects,
  skills,
  experiences,
  education,
  certificates,
  socialLinks,
  projectTechnologies,
  technologies,
  homepageContent,
  differentiators,
  siteSettings,
  seoSettings,
  navItems,
  formFields,
  formSettings,
  customSections,
  customSectionItems,
  languages,
  volunteering,
  softSkills,
} from "@/lib/db/schema";
import { eq, asc, and, or, ilike } from "drizzle-orm";

export type PersonalInfo = typeof personalInfo.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;
export type Technology = typeof technologies.$inferSelect;
export type HomepageContent = typeof homepageContent.$inferSelect;
export type Differentiator = typeof differentiators.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type SeoSetting = typeof seoSettings.$inferSelect;
export type NavItem = typeof navItems.$inferSelect;
export type FormField = typeof formFields.$inferSelect;
export type FormSettings = typeof formSettings.$inferSelect;
export type CustomSection = typeof customSections.$inferSelect;
export type CustomSectionItem = typeof customSectionItems.$inferSelect;
export type Language = typeof languages.$inferSelect;
export type VolunteeringEntry = typeof volunteering.$inferSelect;
export type SoftSkill = typeof softSkills.$inferSelect;

export interface ProjectWithTech extends Project {
  technologies: Technology[];
}

export interface PortfolioData {
  personal: PersonalInfo | null;
  projects: ProjectWithTech[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
  socialLinks: SocialLink[];
  homepage: HomepageContent | null;
  differentiators: Differentiator[];
  siteSettings: SiteSettings | null;
  technologies: Technology[];
  navItems: NavItem[];
  formFields: FormField[];
  formSettings: FormSettings | null;
  customSections: (CustomSection & { items: CustomSectionItem[] })[];
  languages: Language[];
  volunteeringEntries: VolunteeringEntry[];
  softSkills: SoftSkill[];
}

export {
  tsToYear,
  formatExperienceDate,
  formatEducationDate,
  parseJsonArray,
  parseJsonObject,
} from "@/lib/portfolio-format";

export async function getSeoForPage(pagePath: string, locale: string = "en"): Promise<SeoSetting | null> {
  const result = await db
    .select()
    .from(seoSettings)
    .where(and(eq(seoSettings.pagePath, pagePath), eq(seoSettings.locale, locale)))
    .get() ?? null;
  if (result) return result;
  if (locale !== "en") {
    const fallback = await db
      .select()
      .from(seoSettings)
      .where(and(eq(seoSettings.pagePath, pagePath), eq(seoSettings.locale, "en")))
      .get();
    return fallback ?? null;
  }
  return null;
}

async function getWithFallback<T extends { locale: string }>(
  table: any,
  locale: string,
  orderBy?: any,
): Promise<T[]> {
  let query = db.select().from(table).where(eq(table.locale, locale));
  if (orderBy) query = query.orderBy(orderBy) as typeof query;
  const results = await query.all();
  if (locale !== "en" && results.length === 0) {
    let fallbackQuery = db.select().from(table).where(eq(table.locale, "en"));
    if (orderBy) fallbackQuery = fallbackQuery.orderBy(orderBy) as typeof fallbackQuery;
    return fallbackQuery.all() as Promise<T[]>;
  }
  return results as T[];
}

async function getSingletonWithFallback<T extends { locale: string }>(
  table: any,
  locale: string,
): Promise<T | null> {
  const result = await db.select().from(table).where(eq(table.locale, locale)).get();
  if (result) return result as T;
  if (locale !== "en") {
    return db.select().from(table).where(eq(table.locale, "en")).get() as Promise<T | null>;
  }
  return null;
}

export async function getPortfolioData(locale: string = "en"): Promise<PortfolioData> {
  const [
    personal,
    allProjects,
    allSkills,
    allExperiences,
    allEducation,
    allCertificates,
    allSocialLinks,
    hp,
    diffs,
    settings,
    allTechs,
    allNavItems,
    allFormFields,
    fs,
    allCustomSections,
    allCustomSectionItems,
    allLanguages,
    allVolunteering,
    allSoftSkills,
  ] = await Promise.all([
    getSingletonWithFallback<PersonalInfo>(personalInfo, locale),
    getWithFallback<Project>(projects, locale, asc(projects.orderIndex)),
    db.select().from(skills).orderBy(asc(skills.category), asc(skills.orderIndex)).all(),
    getWithFallback<Experience>(experiences, locale, asc(experiences.orderIndex)),
    getWithFallback<Education>(education, locale, asc(education.orderIndex)),
    db.select().from(certificates).orderBy(asc(certificates.orderIndex)).all(),
    db.select().from(socialLinks).orderBy(asc(socialLinks.orderIndex)).all(),
    getSingletonWithFallback<HomepageContent>(homepageContent, locale),
    getWithFallback<Differentiator>(differentiators, locale, asc(differentiators.orderIndex)),
    getSingletonWithFallback<SiteSettings>(siteSettings, locale),
    db.select().from(technologies).orderBy(asc(technologies.category), asc(technologies.name)).all(),
    getWithFallback<NavItem>(navItems, locale, asc(navItems.orderIndex)),
    getWithFallback<FormField>(formFields, locale, asc(formFields.orderIndex)),
    getSingletonWithFallback<FormSettings>(formSettings, locale),
    getWithFallback<CustomSection>(customSections, locale, asc(customSections.orderIndex)),
    db.select().from(customSectionItems).all(),
    getWithFallback<Language>(languages, locale, asc(languages.orderIndex)),
    getWithFallback<VolunteeringEntry>(volunteering, locale, asc(volunteering.orderIndex)),
    getWithFallback<SoftSkill>(softSkills, locale, asc(softSkills.orderIndex)),
  ]);

  const projectsWithTech: ProjectWithTech[] = await Promise.all(
    allProjects.map(async (project) => {
      const techLinks = await db
        .select({ technologyId: projectTechnologies.technologyId })
        .from(projectTechnologies)
        .where(eq(projectTechnologies.projectId, project.id))
        .all();

      const techs = await Promise.all(
        techLinks.map(async (link) => {
          const tech = await db
            .select()
            .from(technologies)
            .where(eq(technologies.id, link.technologyId))
            .get();
          return tech!;
        })
      );

      return { ...project, technologies: techs.filter(Boolean) };
    })
  );

  const customSectionsWithItems = allCustomSections
    .filter((s) => s.visible)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((section) => ({
      ...section,
      items: allCustomSectionItems
        .filter((item) => item.sectionId === section.id && item.locale === locale)
        .sort((a, b) => a.orderIndex - b.orderIndex),
    }));

  return {
    personal: personal ?? null,
    projects: projectsWithTech,
    skills: allSkills,
    experiences: allExperiences,
    education: allEducation,
    certificates: allCertificates,
    socialLinks: allSocialLinks,
    homepage: hp ?? null,
    differentiators: diffs,
    siteSettings: settings ?? null,
    technologies: allTechs,
    navItems: allNavItems,
    formFields: allFormFields,
    formSettings: fs ?? null,
    customSections: customSectionsWithItems,
    languages: allLanguages,
    volunteeringEntries: allVolunteering,
    softSkills: allSoftSkills,
  };
}

export async function getProjectsForPage(locale: string = "en"): Promise<ProjectWithTech[]> {
  const allProjects = await getWithFallback<Project>(projects, locale, asc(projects.orderIndex));

  const projectsWithTech: ProjectWithTech[] = await Promise.all(
    allProjects.map(async (project) => {
      const techLinks = await db
        .select({ technologyId: projectTechnologies.technologyId })
        .from(projectTechnologies)
        .where(eq(projectTechnologies.projectId, project.id))
        .all();

      const techs = await Promise.all(
        techLinks.map(async (link) => {
          const tech = await db
            .select()
            .from(technologies)
            .where(eq(technologies.id, link.technologyId))
            .get();
          return tech!;
        })
      );

      return { ...project, technologies: techs.filter(Boolean) };
    })
  );

  return projectsWithTech;
}

export async function getProjectBySlug(slug: string, locale: string = "en"): Promise<ProjectWithTech | null> {
  const allProjects = await getWithFallback<Project>(projects, locale, asc(projects.orderIndex));
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) return null;

  const techLinks = await db
    .select({ technologyId: projectTechnologies.technologyId })
    .from(projectTechnologies)
    .where(eq(projectTechnologies.projectId, project.id))
    .all();

  const techIds = techLinks.map((l) => l.technologyId);
  const techs = techIds.length
    ? await db.select().from(technologies).where(
        techIds.length === 1
          ? eq(technologies.id, techIds[0])
          : undefined
      )
    : [];

  return { ...project, technologies: techs.filter(Boolean) };
}
