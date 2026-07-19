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
  navItems,
  formFields,
  formSettings,
  customSections,
  customSectionItems,
} from "./schema";
import { eq, desc, asc, and, or, ilike, sql } from "drizzle-orm";

// Personal Info
export async function getPersonalInfo(locale?: string) {
  if (locale) {
    const result = await db.select().from(personalInfo).where(eq(personalInfo.locale, locale)).get();
    if (result) return result;
    return db.select().from(personalInfo).where(eq(personalInfo.locale, "en")).get();
  }
  return db.select().from(personalInfo).get();
}

export async function getAllPersonalInfo() {
  return db.select().from(personalInfo).all();
}

export async function updatePersonalInfo(data: Partial<typeof personalInfo.$inferInsert>) {
  const locale = data.locale || "en";
  const existing = await db.select().from(personalInfo).where(eq(personalInfo.locale, locale)).get();
  if (existing) {
    return db.update(personalInfo).set({ ...data, updatedAt: Date.now() }).where(eq(personalInfo.id, existing.id)).run();
  }
  return db.insert(personalInfo).values({
    name: data.name ?? "",
    title: data.title ?? "",
    locale,
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

// Site Settings
export async function getSiteSettings(locale?: string) {
  if (locale) {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.locale, locale)).get();
    if (result) return result;
    return db.select().from(siteSettings).where(eq(siteSettings.locale, "en")).get();
  }
  return db.select().from(siteSettings).get();
}

export async function getAllSiteSettings() {
  return db.select().from(siteSettings).all();
}

export async function updateSiteSettings(data: Partial<typeof siteSettings.$inferInsert>) {
  const locale = data.locale || "en";
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.locale, locale)).get();
  if (existing) {
    return db.update(siteSettings).set({ ...data, updatedAt: Date.now() }).where(eq(siteSettings.id, existing.id)).run();
  }
  return db.insert(siteSettings).values({
    siteName: data.siteName ?? "Portfolio",
    locale,
    faviconUrl: data.faviconUrl ?? null,
    defaultOgImageUrl: data.defaultOgImageUrl ?? null,
    analyticsId: data.analyticsId ?? null,
    contactFormEndpoint: data.contactFormEndpoint ?? null,
    maintenanceMode: data.maintenanceMode ?? false,
    maintenanceMessage: data.maintenanceMessage ?? null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }).run();
}

// Homepage Content
export async function getHomepageContent(locale?: string) {
  if (locale) {
    const result = await db.select().from(homepageContent).where(eq(homepageContent.locale, locale)).get();
    if (result) return result;
    return db.select().from(homepageContent).where(eq(homepageContent.locale, "en")).get();
  }
  return db.select().from(homepageContent).get();
}

export async function getAllHomepageContent() {
  return db.select().from(homepageContent).all();
}

export async function updateHomepageContent(data: Partial<typeof homepageContent.$inferInsert>) {
  const locale = data.locale || "en";
  const existing = await db.select().from(homepageContent).where(eq(homepageContent.locale, locale)).get();
  if (existing) {
    return db.update(homepageContent).set({ ...data, updatedAt: Date.now() }).where(eq(homepageContent.id, existing.id)).run();
  }
  return db.insert(homepageContent).values({
    heroHeadline: data.heroHeadline ?? "Welcome",
    locale,
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
export async function getAllSeoSettings(locale?: string) {
  if (locale) {
    return db.select().from(seoSettings).where(eq(seoSettings.locale, locale)).all();
  }
  return db.select().from(seoSettings).all();
}

export async function getSeoSetting(pagePath: string, locale?: string) {
  if (locale) {
    const result = await db.select().from(seoSettings)
      .where(and(eq(seoSettings.pagePath, pagePath), eq(seoSettings.locale, locale)))
      .get();
    if (result) return result;
    return db.select().from(seoSettings)
      .where(and(eq(seoSettings.pagePath, pagePath), eq(seoSettings.locale, "en")))
      .get() ?? null;
  }
  return db.select().from(seoSettings).where(eq(seoSettings.pagePath, pagePath)).get();
}

export async function upsertSeoSetting(data: typeof seoSettings.$inferInsert) {
  const locale = data.locale || "en";
  const existing = await db.select().from(seoSettings)
    .where(and(eq(seoSettings.pagePath, data.pagePath), eq(seoSettings.locale, locale)))
    .get();
  if (existing) {
    return db.update(seoSettings).set({ ...data, updatedAt: Date.now() }).where(eq(seoSettings.id, existing.id)).run();
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
  locale?: string;
  sortBy?: "orderIndex" | "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  let query = db.select().from(projects);
  const conditions = [];

  if (options?.locale) {
    conditions.push(eq(projects.locale, options.locale));
  }
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

export async function getProjectBySlug(slug: string, locale?: string) {
  if (locale) {
    const result = await db.select().from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.locale, locale)))
      .get();
    if (result) return result;
    return db.select().from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.locale, "en")))
      .get();
  }
  return db.select().from(projects).where(eq(projects.slug, slug)).get();
}

export async function getProjectWithDetails(slug: string, locale?: string) {
  const project = await getProjectBySlug(slug, locale);
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
export async function getAllExperiences(locale?: string) {
  if (locale) {
    return db.select().from(experiences).where(eq(experiences.locale, locale)).orderBy(desc(experiences.startDate)).all();
  }
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
export async function getAllEducation(locale?: string) {
  if (locale) {
    return db.select().from(education).where(eq(education.locale, locale)).orderBy(desc(education.startDate)).all();
  }
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
export async function getAllDifferentiators(locale?: string) {
  if (locale) {
    return db.select().from(differentiators).where(eq(differentiators.locale, locale)).orderBy(asc(differentiators.orderIndex)).all();
  }
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
export async function getAllLanguages(locale?: string) {
  if (locale) {
    return db.select().from(languages).where(eq(languages.locale, locale)).orderBy(asc(languages.orderIndex)).all();
  }
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
export async function getAllVolunteering(locale?: string) {
  if (locale) {
    return db.select().from(volunteering).where(eq(volunteering.locale, locale)).orderBy(asc(volunteering.orderIndex)).all();
  }
  return db.select().from(volunteering).orderBy(asc(volunteering.orderIndex)).all();
}

export async function getVolunteering(id: number) {
  return db.select().from(volunteering).where(eq(volunteering.id, id)).get();
}

export async function createVolunteering(data: typeof volunteering.$inferInsert) {
  return db.insert(volunteering).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateVolunteering(id: number, data: Partial<typeof volunteering.$inferInsert>) {
  return db.update(volunteering).set({ ...data }).where(eq(volunteering.id, id)).returning().get();
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
export async function getAllSoftSkills(locale?: string) {
  if (locale) {
    return db.select().from(softSkills).where(eq(softSkills.locale, locale)).orderBy(asc(softSkills.orderIndex)).all();
  }
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

// Nav Items
export async function getAllNavItems(locale?: string) {
  if (locale) {
    return db.select().from(navItems).where(eq(navItems.locale, locale)).orderBy(asc(navItems.orderIndex)).all();
  }
  return db.select().from(navItems).orderBy(asc(navItems.orderIndex)).all();
}

export async function getNavItem(id: number) {
  return db.select().from(navItems).where(eq(navItems.id, id)).get();
}

export async function createNavItem(data: typeof navItems.$inferInsert) {
  return db.insert(navItems).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateNavItem(id: number, data: Partial<typeof navItems.$inferInsert>) {
  return db.update(navItems).set(data).where(eq(navItems.id, id)).returning().get();
}

export async function deleteNavItem(id: number) {
  return db.delete(navItems).where(eq(navItems.id, id)).run();
}

export async function reorderNavItems(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(navItems).set({ orderIndex: item.order }).where(eq(navItems.id, item.id)).run();
  }
  return { updated: items.length };
}

// Form Fields
export async function getAllFormFields(locale?: string) {
  if (locale) {
    return db.select().from(formFields).where(eq(formFields.locale, locale)).orderBy(asc(formFields.orderIndex)).all();
  }
  return db.select().from(formFields).orderBy(asc(formFields.orderIndex)).all();
}

export async function getFormField(id: number) {
  return db.select().from(formFields).where(eq(formFields.id, id)).get();
}

export async function createFormField(data: typeof formFields.$inferInsert) {
  return db.insert(formFields).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateFormField(id: number, data: Partial<typeof formFields.$inferInsert>) {
  return db.update(formFields).set(data).where(eq(formFields.id, id)).returning().get();
}

export async function deleteFormField(id: number) {
  return db.delete(formFields).where(eq(formFields.id, id)).run();
}

export async function reorderFormFields(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(formFields).set({ orderIndex: item.order }).where(eq(formFields.id, item.id)).run();
  }
  return { updated: items.length };
}

// Form Settings
export async function getFormSettings(locale?: string) {
  if (locale) {
    const result = await db.select().from(formSettings).where(eq(formSettings.locale, locale)).get();
    if (result) return result;
    return db.select().from(formSettings).where(eq(formSettings.locale, "en")).get();
  }
  return db.select().from(formSettings).get();
}

export async function getAllFormSettings() {
  return db.select().from(formSettings).all();
}

export async function updateFormSettings(data: Partial<typeof formSettings.$inferInsert>) {
  const locale = data.locale || "en";
  const formType = data.formType || "contact";
  const existing = await db.select().from(formSettings)
    .where(and(eq(formSettings.locale, locale), eq(formSettings.formType, formType)))
    .get();
  if (existing) {
    return db.update(formSettings).set({ ...data, updatedAt: Date.now() }).where(eq(formSettings.id, existing.id)).run();
  }
  return db.insert(formSettings).values({
    formType,
    locale,
    submitButtonText: data.submitButtonText ?? "Send message",
    loadingButtonText: data.loadingButtonText ?? "Sending...",
    successMessage: data.successMessage ?? "Message sent successfully!",
    errorMessage: data.errorMessage ?? "An error occurred. Please try again.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }).run();
}

// Custom Sections
export async function getAllCustomSections(locale?: string) {
  if (locale) {
    return db.select().from(customSections).where(eq(customSections.locale, locale)).orderBy(asc(customSections.orderIndex)).all();
  }
  return db.select().from(customSections).orderBy(asc(customSections.orderIndex)).all();
}

export async function getCustomSection(id: number) {
  return db.select().from(customSections).where(eq(customSections.id, id)).get();
}

export async function createCustomSection(data: typeof customSections.$inferInsert) {
  return db.insert(customSections).values({ ...data, createdAt: Date.now(), updatedAt: Date.now() }).returning().get();
}

export async function updateCustomSection(id: number, data: Partial<typeof customSections.$inferInsert>) {
  return db.update(customSections).set({ ...data, updatedAt: Date.now() }).where(eq(customSections.id, id)).returning().get();
}

export async function deleteCustomSection(id: number) {
  return db.delete(customSections).where(eq(customSections.id, id)).run();
}

export async function reorderCustomSections(items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(customSections).set({ orderIndex: item.order }).where(eq(customSections.id, item.id)).run();
  }
  return { updated: items.length };
}

// Custom Section Items
export async function getAllCustomSectionItems(sectionId?: number) {
  if (sectionId) {
    return db.select().from(customSectionItems).where(eq(customSectionItems.sectionId, sectionId)).orderBy(asc(customSectionItems.orderIndex)).all();
  }
  return db.select().from(customSectionItems).orderBy(asc(customSectionItems.orderIndex)).all();
}

export async function getCustomSectionItem(id: number) {
  return db.select().from(customSectionItems).where(eq(customSectionItems.id, id)).get();
}

export async function createCustomSectionItem(data: typeof customSectionItems.$inferInsert) {
  return db.insert(customSectionItems).values({ ...data, createdAt: Date.now() }).returning().get();
}

export async function updateCustomSectionItem(id: number, data: Partial<typeof customSectionItems.$inferInsert>) {
  return db.update(customSectionItems).set(data).where(eq(customSectionItems.id, id)).returning().get();
}

export async function deleteCustomSectionItem(id: number) {
  return db.delete(customSectionItems).where(eq(customSectionItems.id, id)).run();
}

export async function reorderCustomSectionItems(sectionId: number, items: { id: number; order: number }[]) {
  for (const item of items) {
    await db.update(customSectionItems).set({ orderIndex: item.order }).where(eq(customSectionItems.id, item.id)).run();
  }
  return { updated: items.length };
}
