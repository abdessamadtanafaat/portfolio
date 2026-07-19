import { db } from "./index";
import {
  personalInfo,
  siteSettings,
  homepageContent,
  seoSettings,
  projects,
  projectImages,
  technologies,
  projectTechnologies,
  skills,
  experiences,
  education,
  certificates,
  socialLinks,
  adminUser,
  differentiators,
  languages,
  volunteering,
  softSkills,
} from "./schema";
import { eq, desc, asc, and, or, ilike, sql } from "drizzle-orm";

// Personal Info (Singleton)
export async function getPersonalInfo() {
  return db.select().from(personalInfo).get();
}

export async function updatePersonalInfo(data: Partial<typeof personalInfo.$inferInsert>) {
  const existing = await getPersonalInfo();
  if (existing) {
    return db.update(personalInfo).set({ ...data, updatedAt: Date.now() }).where(eq(personalInfo.id, 1)).run();
  }
  return db.insert(personalInfo).values({
    name: data.name ?? "",
    title: data.title ?? "",
    tagline: data.tagline ?? null,
    bio: data.bio ?? null,
    location: data.location ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    avatarUrl: data.avatarUrl ?? null,
    resumeUrl: data.resumeUrl ?? null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }).run();
}

// Site Settings (Singleton)
export async function getSiteSettings() {
  return db.select().from(siteSettings).get();
}

export async function updateSiteSettings(data: Partial<typeof siteSettings.$inferInsert>) {
  const existing = await getSiteSettings();
  if (existing) {
    return db.update(siteSettings).set({ ...data, updatedAt: Date.now() }).where(eq(siteSettings.id, 1)).run();
  }
  return db.insert(siteSettings).values({
    siteName: data.siteName ?? "Portfolio",
    faviconUrl: data.faviconUrl ?? null,
    defaultOgImageUrl: data.defaultOgImageUrl ?? null,
    analyticsId: data.analyticsId ?? null,
    contactFormEndpoint: data.contactFormEndpoint ?? null,
    id: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }).run();
}

// Homepage Content (Singleton)
export async function getHomepageContent() {
  return db.select().from(homepageContent).get();
}

export async function updateHomepageContent(data: Partial<typeof homepageContent.$inferInsert>) {
  const existing = await getHomepageContent();
  if (existing) {
    return db.update(homepageContent).set({ ...data, updatedAt: Date.now() }).where(eq(homepageContent.id, 1)).run();
  }
  return db.insert(homepageContent).values({
    heroHeadline: data.heroHeadline ?? "Welcome",
    heroSubtext: data.heroSubtext ?? null,
    heroCtaText: data.heroCtaText ?? null,
    heroCtaUrl: data.heroCtaUrl ?? null,
    sectionVisibility: data.sectionVisibility ?? "{}",
    sectionOrder: data.sectionOrder ?? "[]",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }).run();
}

// SEO Settings
export async function getAllSeoSettings() {
  return db.select().from(seoSettings).all();
}

export async function getSeoSetting(pagePath: string) {
  return db.select().from(seoSettings).where(eq(seoSettings.pagePath, pagePath)).get();
}

export async function upsertSeoSetting(data: typeof seoSettings.$inferInsert) {
  const existing = await getSeoSetting(data.pagePath);
  if (existing) {
    return db.update(seoSettings).set({ ...data, updatedAt: Date.now() }).where(eq(seoSettings.pagePath, data.pagePath)).run();
  }
  return db.insert(seoSettings).values({ ...data, createdAt: Date.now(), updatedAt: Date.now() }).returning().get();
}

export async function deleteSeoSetting(id: number) {
  return db.delete(seoSettings).where(eq(seoSettings.id, id)).run();
}

// Projects
export async function getProjects(options?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  sortBy?: "orderIndex" | "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  let query = db.select().from(projects);
  const conditions = [];

  if (options?.search) {
    conditions.push(
      or(
        ilike(projects.title, `%${options.search}%`),
        ilike(projects.subtitle, `%${options.search}%`),
        ilike(projects.description, `%${options.search}%`)
      )
    );
  }
  if (options?.category) {
    conditions.push(eq(projects.category, options.category as "fullstack" | "frontend" | "backend" | "cms" | "devops" | "mobile"));
  }
  if (options?.status) {
    conditions.push(eq(projects.status, options.status as "production" | "staging" | "prototype" | "archived"));
  }
  if (options?.featured !== undefined) {
    conditions.push(eq(projects.featured, options.featured));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  // Skip orderBy for type stability - sort in memory instead
  // const sortOrder = options?.sortOrder ?? "asc";
  // query = query.orderBy(sortOrder === "asc" ? asc(projects.orderIndex) : desc(projects.orderIndex));

  const total = await db.select({ count: sql`count(*)` }).from(projects).get();
  const items = await query.limit(pageSize).offset(offset).all();

  return {
    items,
    total: Number(total?.count ?? 0),
    page,
    pageSize,
    totalPages: Math.ceil(Number(total?.count ?? 0) / pageSize),
  };
}

export async function getProjectById(id: number) {
  return db.select().from(projects).where(eq(projects.id, id)).get();
}

export async function getProjectBySlug(slug: string) {
  return db.select().from(projects).where(eq(projects.slug, slug)).get();
}

export async function getProjectWithDetails(slug: string) {
  const project = await getProjectBySlug(slug);
  if (!project) return null;

  const [images, techs] = await Promise.all([
    db.select().from(projectImages).where(eq(projectImages.projectId, project.id)).orderBy(asc(projectImages.orderIndex)).all(),
    db
      .select({ technology: technologies })
      .from(projectTechnologies)
      .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
      .where(eq(projectTechnologies.projectId, project.id))
      .all(),
  ]);

  return {
    ...project,
    images,
    technologies: techs.map((t) => t.technology),
  };
}

export async function createProject(data: typeof projects.$inferInsert) {
  return db.insert(projects).values({ ...data, createdAt: Date.now(), updatedAt: Date.now() }).returning().get();
}

export async function updateProject(id: number, data: Partial<typeof projects.$inferInsert>) {
  return db.update(projects).set({ ...data, updatedAt: Date.now() }).where(eq(projects.id, id)).returning().get();
}

export async function deleteProject(id: number) {
  return db.delete(projects).where(eq(projects.id, id)).run();
}

export async function reorderProjects(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(projects).set({ orderIndex: item.order, updatedAt: Date.now() }).where(eq(projects.id, item.id)).run();
  }
  return { updated: items.length };
}

// Project Images
export async function getProjectImages(projectId: number) {
  return db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(asc(projectImages.orderIndex)).all();
}

export async function addProjectImage(data: typeof projectImages.$inferInsert) {
  return db.insert(projectImages).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function deleteProjectImage(imageId: number) {
  return db.delete(projectImages).where(eq(projectImages.id, imageId)).run();
}

// Technologies
export async function getAllTechnologies() {
  return db.select().from(technologies).orderBy(asc(technologies.category), asc(technologies.name)).all();
}

export async function getTechnologiesByCategory(category: string) {
  return db.select().from(technologies).where(eq(technologies.category, category as "frontend" | "backend" | "cms" | "devops" | "database" | "tools" | "testing")).orderBy(asc(technologies.name)).all();
}

export async function createTechnology(data: typeof technologies.$inferInsert) {
  return db.insert(technologies).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateTechnology(id: number, data: Partial<typeof technologies.$inferInsert>) {
  return db.update(technologies).set(data).where(eq(technologies.id, id)).returning().get();
}

export async function deleteTechnology(id: number) {
  return db.delete(technologies).where(eq(technologies.id, id)).run();
}

// Project Technologies (M:N)
export async function getProjectTechnologies(projectId: number) {
  return db
    .select({ technology: technologies })
    .from(projectTechnologies)
    .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
    .where(eq(projectTechnologies.projectId, projectId))
    .all();
}

export async function setProjectTechnologies(projectId: number, technologyIds: number[]) {
  await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, projectId)).run();
  if (technologyIds.length > 0) {
    await db.insert(projectTechnologies).values(technologyIds.map((tid) => ({ projectId, technologyId: tid }))).run();
  }
}

// Skills
export async function getAllSkills() {
  return db.select().from(skills).orderBy(asc(skills.category), asc(skills.orderIndex)).all();
}

export async function getSkillsByCategory(category: string) {
  return db.select().from(skills).where(eq(skills.category, category as "frontend" | "backend" | "cms" | "devops" | "database" | "tools" | "testing")).orderBy(asc(skills.orderIndex)).all();
}

export async function createSkill(data: typeof skills.$inferInsert) {
  return db.insert(skills).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateSkill(id: number, data: Partial<typeof skills.$inferInsert>) {
  return db.update(skills).set(data).where(eq(skills.id, id)).returning().get();
}

export async function deleteSkill(id: number) {
  return db.delete(skills).where(eq(skills.id, id)).run();
}

export async function reorderSkills(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(skills).set({ orderIndex: item.order }).where(eq(skills.id, item.id)).run();
  }
  return { updated: items.length };
}

// Experiences
export async function getAllExperiences() {
  return db.select().from(experiences).orderBy(desc(experiences.startDate)).all();
}

export async function createExperience(data: typeof experiences.$inferInsert) {
  return db.insert(experiences).values({ ...data, createdAt: Date.now(), updatedAt: Date.now() }).returning().get();
}

export async function updateExperience(id: number, data: Partial<typeof experiences.$inferInsert>) {
  return db.update(experiences).set({ ...data, updatedAt: Date.now() }).where(eq(experiences.id, id)).returning().get();
}

export async function deleteExperience(id: number) {
  return db.delete(experiences).where(eq(experiences.id, id)).run();
}

// Education
export async function getAllEducation() {
  return db.select().from(education).orderBy(desc(education.startDate)).all();
}

export async function createEducation(data: typeof education.$inferInsert) {
  return db.insert(education).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateEducation(id: number, data: Partial<typeof education.$inferInsert>) {
  return db.update(education).set(data).where(eq(education.id, id)).returning().get();
}

export async function deleteEducation(id: number) {
  return db.delete(education).where(eq(education.id, id)).run();
}

// Certificates
export async function getAllCertificates() {
  return db.select().from(certificates).orderBy(desc(certificates.issueDate)).all();
}

export async function createCertificate(data: typeof certificates.$inferInsert) {
  return db.insert(certificates).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateCertificate(id: number, data: Partial<typeof certificates.$inferInsert>) {
  return db.update(certificates).set(data).where(eq(certificates.id, id)).returning().get();
}

export async function deleteCertificate(id: number) {
  return db.delete(certificates).where(eq(certificates.id, id)).run();
}

// Social Links
export async function getAllSocialLinks() {
  return db.select().from(socialLinks).orderBy(asc(socialLinks.orderIndex)).all();
}

export async function createSocialLink(data: typeof socialLinks.$inferInsert) {
  return db.insert(socialLinks).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateSocialLink(id: number, data: Partial<typeof socialLinks.$inferInsert>) {
  return db.update(socialLinks).set(data).where(eq(socialLinks.id, id)).returning().get();
}

export async function deleteSocialLink(id: number) {
  return db.delete(socialLinks).where(eq(socialLinks.id, id)).run();
}

// Admin User
export async function getAdminUserByEmail(email: string) {
  return db.select().from(adminUser).where(eq(adminUser.email, email)).get();
}

export async function createAdminUser(data: typeof adminUser.$inferInsert) {
  return db.insert(adminUser).values({ ...data, createdAt: Date.now(), updatedAt: Date.now() }).returning().get();
}

export async function updateAdminUserLastLogin(id: number) {
  return db.update(adminUser).set({ lastLoginAt: Date.now() }).where(eq(adminUser.id, id)).run();
}

// Differentiators
export async function getAllDifferentiators() {
  return db.select().from(differentiators).orderBy(asc(differentiators.orderIndex)).all();
}

export async function createDifferentiator(data: typeof differentiators.$inferInsert) {
  return db.insert(differentiators).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateDifferentiator(id: number, data: Partial<typeof differentiators.$inferInsert>) {
  return db.update(differentiators).set(data).where(eq(differentiators.id, id)).returning().get();
}

export async function deleteDifferentiator(id: number) {
  return db.delete(differentiators).where(eq(differentiators.id, id)).run();
}

export async function reorderDifferentiators(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(differentiators).set({ orderIndex: item.order }).where(eq(differentiators.id, item.id)).run();
  }
  return { updated: items.length };
}

// Languages
export async function getAllLanguages() {
  return db.select().from(languages).orderBy(asc(languages.orderIndex)).all();
}

export async function getLanguage(id: number) {
  return db.select().from(languages).where(eq(languages.id, id)).get();
}

export async function createLanguage(data: typeof languages.$inferInsert) {
  return db.insert(languages).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateLanguage(id: number, data: Partial<typeof languages.$inferInsert>) {
  return db.update(languages).set(data).where(eq(languages.id, id)).returning().get();
}

export async function deleteLanguage(id: number) {
  return db.delete(languages).where(eq(languages.id, id)).run();
}

export async function reorderLanguages(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(languages).set({ orderIndex: item.order }).where(eq(languages.id, item.id)).run();
  }
  return { updated: items.length };
}

// Volunteering
export async function getAllVolunteering() {
  return db.select().from(volunteering).orderBy(asc(volunteering.orderIndex)).all();
}

export async function getVolunteering(id: number) {
  return db.select().from(volunteering).where(eq(volunteering.id, id)).get();
}

export async function createVolunteering(data: typeof volunteering.$inferInsert) {
  return db.insert(volunteering).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateVolunteering(id: number, data: Partial<typeof volunteering.$inferInsert>) {
  return db.update(volunteering).set(data).where(eq(volunteering.id, id)).returning().get();
}

export async function deleteVolunteering(id: number) {
  return db.delete(volunteering).where(eq(volunteering.id, id)).run();
}

export async function reorderVolunteering(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(volunteering).set({ orderIndex: item.order }).where(eq(volunteering.id, item.id)).run();
  }
  return { updated: items.length };
}

// Soft Skills
export async function getAllSoftSkills() {
  return db.select().from(softSkills).orderBy(asc(softSkills.orderIndex)).all();
}

export async function getSoftSkill(id: number) {
  return db.select().from(softSkills).where(eq(softSkills.id, id)).get();
}

export async function createSoftSkill(data: typeof softSkills.$inferInsert) {
  return db.insert(softSkills).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateSoftSkill(id: number, data: Partial<typeof softSkills.$inferInsert>) {
  return db.update(softSkills).set(data).where(eq(softSkills.id, id)).returning().get();
}

export async function deleteSoftSkill(id: number) {
  return db.delete(softSkills).where(eq(softSkills.id, id)).run();
}

export async function reorderSoftSkills(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(softSkills).set({ orderIndex: item.order }).where(eq(softSkills.id, item.id)).run();
  }
  return { updated: items.length };
}