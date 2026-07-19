import {
  sqliteTable,
  integer,
  text,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const adminUser = sqliteTable("admin_user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").notNull().default(sql`(unixepoch())`),
  lastLoginAt: integer("last_login_at"),
});

export const personalInfo = sqliteTable("personal_info", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  bio: text("bio"),
  location: text("location"),
  email: text("email"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  siteName: text("site_name").notNull().default("Portfolio"),
  faviconUrl: text("favicon_url"),
  defaultOgImageUrl: text("default_og_image_url"),
  analyticsId: text("analytics_id"),
  contactFormEndpoint: text("contact_form_endpoint").default("/api/contact"),
  maintenanceMode: integer("maintenance_mode", { mode: "boolean" }).notNull().default(false),
  maintenanceMessage: text("maintenance_message").default("Site under maintenance."),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const homepageContent = sqliteTable("homepage_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  heroHeadline: text("hero_headline").notNull(),
  heroSubtext: text("hero_subtext"),
  heroCtaText: text("hero_cta_text"),
  heroCtaUrl: text("hero_cta_url"),
  heroCta2Text: text("hero_cta2_text"),
  heroCta2Url: text("hero_cta2_url"),
  heroBadgeText: text("hero_badge_text"),
  aboutBadge: text("about_badge"),
  aboutTitle: text("about_title"),
  aboutDescription: text("about_description"),
  aboutCards: text("about_cards").default("[]"),
  differentiatorsTitle: text("differentiators_title"),
  differentiatorsDescription: text("differentiators_description"),
  experienceBadge: text("experience_badge"),
  experienceTitle: text("experience_title"),
  experienceDescription: text("experience_description"),
  projectsBadge: text("projects_badge"),
  projectsTitle: text("projects_title"),
  projectsDescription: text("projects_description"),
  projectsCtaText: text("projects_cta_text"),
  skillsBadge: text("skills_badge"),
  skillsTitle: text("skills_title"),
  skillsDescription: text("skills_description"),
  educationBadge: text("education_badge"),
  educationTitle: text("education_title"),
  educationDescription: text("education_description"),
  certificatesBadge: text("certificates_badge"),
  certificatesTitle: text("certificates_title"),
  certificatesDescription: text("certificates_description"),
  certificatesInProgress: text("certificates_in_progress").default("[]"),
  contactBadge: text("contact_badge"),
  contactTitle: text("contact_title"),
  contactDescription: text("contact_description"),
  contactSuccessMessage: text("contact_success_message"),
  heroCta3Text: text("hero_cta3_text"),
  heroCta3Url: text("hero_cta3_url"),
  languagesBadge: text("languages_badge"),
  languagesTitle: text("languages_title"),
  languagesDescription: text("languages_description"),
  volunteeringBadge: text("volunteering_badge"),
  volunteeringTitle: text("volunteering_title"),
  volunteeringDescription: text("volunteering_description"),
  softSkillsBadge: text("soft_skills_badge"),
  softSkillsTitle: text("soft_skills_title"),
  softSkillsDescription: text("soft_skills_description"),
  footerCopyright: text("footer_copyright"),
  footerDescription: text("footer_description"),
  footerNavTitle: text("footer_nav_title").default("Navigation"),
  footerContactTitle: text("footer_contact_title").default("Contact"),
  footerTechTitle: text("footer_tech_title").default("Technologies"),
  sectionVisibility: text("section_visibility").notNull().default("{}"),
  sectionOrder: text("section_order").notNull().default("[]"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const seoSettings = sqliteTable("seo_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pagePath: text("page_path").notNull(),
  locale: text("locale").notNull().default("en"),
  title: text("title").notNull(),
  description: text("description"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImageUrl: text("og_image_url"),
  twitterCard: text("twitter_card").default("summary_large_image"),
  jsonLd: text("json_ld"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  locale: text("locale").notNull().default("en"),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  shortDescription: text("short_description"),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  category: text("category", {
    enum: ["fullstack", "frontend", "backend", "cms", "devops", "mobile"],
  }).notNull(),
  status: text("status", {
    enum: ["production", "staging", "prototype", "archived"],
  }).notNull().default("production"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  caseStudyUrl: text("case_study_url"),
  startDate: integer("start_date"),
  endDate: integer("end_date"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const projectImages = sqliteTable("project_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  orderIndex: integer("order_index").notNull().default(0),
  isCover: integer("is_cover", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
});

export const technologies = sqliteTable("technologies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category", {
    enum: ["frontend", "backend", "cms", "devops", "database", "tools", "testing"],
  }).notNull(),
  icon: text("icon"),
  color: text("color"),
  primary: integer("primary", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
});

export const projectTechnologies = sqliteTable(
  "project_technologies",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: integer("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.technologyId] }),
  })
);

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category", {
    enum: ["frontend", "backend", "cms", "devops", "database", "tools", "testing"],
  }).notNull(),
  proficiency: integer("proficiency").notNull(),
  icon: text("icon"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const experiences = sqliteTable("experiences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  company: text("company").notNull(),
  role: text("role").notNull(),
  location: text("location"),
  startDate: integer("start_date").notNull(),
  endDate: integer("end_date"),
  current: integer("current", { mode: "boolean" }).notNull().default(false),
  description: text("description"),
  highlights: text("highlights").notNull().default("[]"),
  technologies: text("technologies").notNull().default("[]"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  location: text("location"),
  startDate: integer("start_date").notNull(),
  endDate: integer("end_date"),
  honors: text("honors"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const certificates = sqliteTable("certificates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: integer("issue_date").notNull(),
  expiryDate: integer("expiry_date"),
  credentialUrl: text("credential_url"),
  imageUrl: text("image_url"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform", {
    enum: ["github", "linkedin", "twitter", "email", "phone", "website"],
  }).notNull(),
  url: text("url").notNull(),
  label: text("label"),
  icon: text("icon"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const differentiators = sqliteTable("differentiators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Code"),
  color: text("color").default("brand"),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const navItems = sqliteTable("nav_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  label: text("label").notNull(),
  href: text("href").notNull(),
  type: text("type", { enum: ["internal", "anchor", "external"] }).notNull().default("internal"),
  target: text("target", { enum: ["_self", "_blank"] }).notNull().default("_self"),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const formFields = sqliteTable("form_fields", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  formType: text("form_type").notNull().default("contact"),
  label: text("label").notNull(),
  name: text("name").notNull(),
  type: text("type", {
    enum: ["text", "email", "textarea", "phone", "url", "number", "date", "checkbox", "radio", "select"],
  }).notNull().default("text"),
  placeholder: text("placeholder"),
  helperText: text("helper_text"),
  required: integer("required", { mode: "boolean" }).notNull().default(true),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  options: text("options"),
  validation: text("validation"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const formSettings = sqliteTable("form_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  formType: text("form_type").notNull().default("contact"),
  submitButtonText: text("submit_button_text").notNull().default("Send message"),
  loadingButtonText: text("loading_button_text").notNull().default("Sending..."),
  successMessage: text("success_message").notNull().default("Message sent successfully!"),
  errorMessage: text("error_message").notNull().default("An error occurred. Please try again."),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
});

export const customSections = sqliteTable("custom_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  locale: text("locale").notNull().default("en"),
  badge: text("badge"),
  title: text("title").notNull(),
  description: text("description"),
  layout: text("layout", { enum: ["cards", "grid", "list", "timeline"] }).notNull().default("cards"),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const customSectionItems = sqliteTable("custom_section_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  sectionId: integer("section_id")
    .notNull()
    .references(() => customSections.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  linkLabel: text("link_label"),
  icon: text("icon"),
  color: text("color"),
  tags: text("tags").default("[]"),
  metadata: text("metadata").default("{}"),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const languages = sqliteTable("languages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  name: text("name").notNull(),
  level: text("level").notNull(),
  proficiency: integer("proficiency").notNull().default(80),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const volunteering = sqliteTable("volunteering", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  startDate: integer("start_date").notNull(),
  endDate: integer("end_date"),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const softSkills = sqliteTable("soft_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locale: text("locale").notNull().default("en"),
  name: text("name").notNull(),
  category: text("category").notNull().default("soft_skill"),
  icon: text("icon"),
  color: text("color"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const indexes = [
  uniqueIndex("idx_personal_info_locale").on(personalInfo.locale),
  uniqueIndex("idx_site_settings_locale").on(siteSettings.locale),
  uniqueIndex("idx_homepage_content_locale").on(homepageContent.locale),
  uniqueIndex("idx_seo_page_path_locale").on(seoSettings.pagePath, seoSettings.locale),
  uniqueIndex("idx_projects_slug_locale").on(projects.slug, projects.locale),
  uniqueIndex("idx_custom_sections_slug_locale").on(customSections.slug, customSections.locale),
  uniqueIndex("idx_form_settings_type_locale").on(formSettings.formType, formSettings.locale),
  index("idx_projects_category").on(projects.category),
  index("idx_projects_status").on(projects.status),
  index("idx_projects_featured").on(projects.featured),
  index("idx_projects_order").on(projects.orderIndex),
  index("idx_project_images_project").on(projectImages.projectId),
  index("idx_project_images_order").on(projectImages.projectId, projectImages.orderIndex),
  index("idx_technologies_category").on(technologies.category),
  index("idx_skills_category").on(skills.category),
  index("idx_skills_order").on(skills.orderIndex),
  index("idx_experiences_order").on(experiences.orderIndex),
  index("idx_experiences_dates").on(experiences.startDate),
  index("idx_education_order").on(education.orderIndex),
  index("idx_certificates_order").on(certificates.orderIndex),
  index("idx_social_links_order").on(socialLinks.orderIndex),
  index("idx_differentiators_order").on(differentiators.orderIndex),
  index("idx_nav_items_order").on(navItems.orderIndex),
  index("idx_form_fields_form_type").on(formFields.formType),
  index("idx_form_fields_order").on(formFields.formType, formFields.orderIndex),
  index("idx_custom_sections_order").on(customSections.orderIndex),
  index("idx_custom_section_items_section").on(customSectionItems.sectionId),
  index("idx_custom_section_items_order").on(customSectionItems.sectionId, customSectionItems.orderIndex),
  index("idx_languages_order").on(languages.orderIndex),
  index("idx_volunteering_order").on(volunteering.orderIndex),
  index("idx_soft_skills_category").on(softSkills.category),
  index("idx_soft_skills_order").on(softSkills.orderIndex),
];
