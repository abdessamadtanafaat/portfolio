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
import { eq, asc } from "drizzle-orm";

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

export function tsToYear(ts: number | null): string {
  if (!ts) return "";
  return new Date(ts * 1000).getFullYear().toString();
}

function tsToMonthYear(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatExperienceDate(startTs: number | null, endTs: number | null, current: boolean): string {
  const start = tsToMonthYear(startTs);
  const end = current ? "Présent" : tsToMonthYear(endTs);
  return end ? `${start} – ${end}` : start;
}

export function formatEducationDate(startTs: number | null, endTs: number | null): string {
  return `${tsToYear(startTs)} – ${tsToYear(endTs) || "Présent"}`;
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

export async function getSeoForPage(pagePath: string): Promise<SeoSetting | null> {
  const result = await db.select().from(seoSettings).where(eq(seoSettings.pagePath, pagePath)).get();
  return result ?? null;
}

export async function getPortfolioData(): Promise<PortfolioData> {
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
    db.select().from(personalInfo).get(),
    db.select().from(projects).orderBy(asc(projects.orderIndex)).all(),
    db.select().from(skills).orderBy(asc(skills.category), asc(skills.orderIndex)).all(),
    db.select().from(experiences).orderBy(asc(experiences.orderIndex)).all(),
    db.select().from(education).orderBy(asc(education.orderIndex)).all(),
    db.select().from(certificates).orderBy(asc(certificates.orderIndex)).all(),
    db.select().from(socialLinks).orderBy(asc(socialLinks.orderIndex)).all(),
    db.select().from(homepageContent).get(),
    db.select().from(differentiators).orderBy(asc(differentiators.orderIndex)).all(),
    db.select().from(siteSettings).get(),
    db.select().from(technologies).orderBy(asc(technologies.category), asc(technologies.name)).all(),
    db.select().from(navItems).orderBy(asc(navItems.orderIndex)).all(),
    db.select().from(formFields).orderBy(asc(formFields.orderIndex)).all(),
    db.select().from(formSettings).get(),
    db.select().from(customSections).orderBy(asc(customSections.orderIndex)).all(),
    db.select().from(customSectionItems).all(),
    db.select().from(languages).orderBy(asc(languages.orderIndex)).all(),
    db.select().from(volunteering).orderBy(asc(volunteering.orderIndex)).all(),
    db.select().from(softSkills).orderBy(asc(softSkills.orderIndex)).all(),
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
        .filter((item) => item.sectionId === section.id)
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

export async function getProjectsForPage(): Promise<ProjectWithTech[]> {
  const allProjects = await db.select().from(projects).orderBy(asc(projects.orderIndex)).all();

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
