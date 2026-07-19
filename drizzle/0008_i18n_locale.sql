-- Add locale column to all content tables
ALTER TABLE `personal_info` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `site_settings` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `homepage_content` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `experiences` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `education` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `differentiators` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `nav_items` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `form_fields` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `custom_section_items` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `languages` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `volunteering` ADD `locale` text DEFAULT 'en' NOT NULL;
ALTER TABLE `soft_skills` ADD `locale` text DEFAULT 'en' NOT NULL;
--> statement-breakpoint
-- Recreate form_settings with locale column (was singleton with default(1))
PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_form_settings` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `locale` text DEFAULT 'en' NOT NULL,
  `form_type` text DEFAULT 'contact' NOT NULL,
  `submit_button_text` text DEFAULT 'Send message' NOT NULL,
  `loading_button_text` text DEFAULT 'Sending...' NOT NULL,
  `success_message` text DEFAULT 'Message sent successfully!' NOT NULL,
  `error_message` text DEFAULT 'An error occurred. Please try again.' NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
INSERT INTO `__new_form_settings`("id", "locale", "form_type", "submit_button_text", "loading_button_text", "success_message", "error_message", "created_at", "updated_at") SELECT "id", 'en', "form_type", "submit_button_text", "loading_button_text", "success_message", "error_message", "created_at", "updated_at" FROM `form_settings`;
DROP TABLE `form_settings`;
ALTER TABLE `__new_form_settings` RENAME TO `form_settings`;
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Recreate homepage_content with locale column
PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_homepage_content` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `locale` text DEFAULT 'en' NOT NULL,
  `hero_headline` text NOT NULL,
  `hero_subtext` text,
  `hero_cta_text` text,
  `hero_cta_url` text,
  `hero_cta2_text` text,
  `hero_cta2_url` text,
  `hero_badge_text` text,
  `about_badge` text,
  `about_title` text,
  `about_description` text,
  `about_cards` text DEFAULT '[]',
  `differentiators_title` text,
  `differentiators_description` text,
  `experience_badge` text,
  `experience_title` text,
  `experience_description` text,
  `projects_badge` text,
  `projects_title` text,
  `projects_description` text,
  `projects_cta_text` text,
  `skills_badge` text,
  `skills_title` text,
  `skills_description` text,
  `education_badge` text,
  `education_title` text,
  `education_description` text,
  `certificates_badge` text,
  `certificates_title` text,
  `certificates_description` text,
  `certificates_in_progress` text DEFAULT '[]',
  `contact_badge` text,
  `contact_title` text,
  `contact_description` text,
  `contact_success_message` text,
  `hero_cta3_text` text,
  `hero_cta3_url` text,
  `languages_badge` text,
  `languages_title` text,
  `languages_description` text,
  `volunteering_badge` text,
  `volunteering_title` text,
  `volunteering_description` text,
  `soft_skills_badge` text,
  `soft_skills_title` text,
  `soft_skills_description` text,
  `footer_copyright` text,
  `footer_description` text,
  `footer_nav_title` text DEFAULT 'Navigation',
  `footer_contact_title` text DEFAULT 'Contact',
  `footer_tech_title` text DEFAULT 'Technologies',
  `section_visibility` text DEFAULT '{}' NOT NULL,
  `section_order` text DEFAULT '[]' NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
INSERT INTO `__new_homepage_content`("id", "locale", "hero_headline", "hero_subtext", "hero_cta_text", "hero_cta_url", "hero_cta2_text", "hero_cta2_url", "hero_badge_text", "about_badge", "about_title", "about_description", "about_cards", "differentiators_title", "differentiators_description", "experience_badge", "experience_title", "experience_description", "projects_badge", "projects_title", "projects_description", "projects_cta_text", "skills_badge", "skills_title", "skills_description", "education_badge", "education_title", "education_description", "certificates_badge", "certificates_title", "certificates_description", "certificates_in_progress", "contact_badge", "contact_title", "contact_description", "contact_success_message", "hero_cta3_text", "hero_cta3_url", "languages_badge", "languages_title", "languages_description", "volunteering_badge", "volunteering_title", "volunteering_description", "soft_skills_badge", "soft_skills_title", "soft_skills_description", "footer_copyright", "footer_description", "footer_nav_title", "footer_contact_title", "footer_tech_title", "section_visibility", "section_order", "created_at", "updated_at") SELECT "id", 'en', "hero_headline", "hero_subtext", "hero_cta_text", "hero_cta_url", "hero_cta2_text", "hero_cta2_url", "hero_badge_text", "about_badge", "about_title", "about_description", "about_cards", "differentiators_title", "differentiators_description", "experience_badge", "experience_title", "experience_description", "projects_badge", "projects_title", "projects_description", "projects_cta_text", "skills_badge", "skills_title", "skills_description", "education_badge", "education_title", "education_description", "certificates_badge", "certificates_title", "certificates_description", "certificates_in_progress", "contact_badge", "contact_title", "contact_description", "contact_success_message", "hero_cta3_text", "hero_cta3_url", "languages_badge", "languages_title", "languages_description", "volunteering_badge", "volunteering_title", "volunteering_description", "soft_skills_badge", "soft_skills_title", "soft_skills_description", "footer_copyright", "footer_description", "footer_nav_title", "footer_contact_title", "footer_tech_title", "section_visibility", "section_order", "created_at", "updated_at" FROM `homepage_content`;
DROP TABLE `homepage_content`;
ALTER TABLE `__new_homepage_content` RENAME TO `homepage_content`;
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Recreate personal_info with locale column
PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_personal_info` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `locale` text DEFAULT 'en' NOT NULL,
  `name` text NOT NULL,
  `title` text NOT NULL,
  `tagline` text,
  `bio` text,
  `location` text,
  `email` text,
  `phone` text,
  `avatar_url` text,
  `resume_url` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
INSERT INTO `__new_personal_info`("id", "locale", "name", "title", "tagline", "bio", "location", "email", "phone", "avatar_url", "resume_url", "created_at", "updated_at") SELECT "id", 'en', "name", "title", "tagline", "bio", "location", "email", "phone", "avatar_url", "resume_url", "created_at", "updated_at" FROM `personal_info`;
DROP TABLE `personal_info`;
ALTER TABLE `__new_personal_info` RENAME TO `personal_info`;
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Recreate site_settings with locale column
PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_site_settings` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `locale` text DEFAULT 'en' NOT NULL,
  `site_name` text DEFAULT 'Portfolio' NOT NULL,
  `favicon_url` text,
  `default_og_image_url` text,
  `analytics_id` text,
  `contact_form_endpoint` text DEFAULT '/api/contact',
  `maintenance_mode` integer DEFAULT false NOT NULL,
  `maintenance_message` text DEFAULT 'Site under maintenance.',
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
INSERT INTO `__new_site_settings`("id", "locale", "site_name", "favicon_url", "default_og_image_url", "analytics_id", "contact_form_endpoint", "maintenance_mode", "maintenance_message", "created_at", "updated_at") SELECT "id", 'en', "site_name", "favicon_url", "default_og_image_url", "analytics_id", "contact_form_endpoint", "maintenance_mode", "maintenance_message", "created_at", "updated_at" FROM `site_settings`;
DROP TABLE `site_settings`;
ALTER TABLE `__new_site_settings` RENAME TO `site_settings`;
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Recreate projects with locale column
PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_projects` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL,
  `locale` text DEFAULT 'en' NOT NULL,
  `title` text NOT NULL,
  `subtitle` text,
  `short_description` text,
  `description` text,
  `cover_image_url` text,
  `category` text NOT NULL,
  `status` text DEFAULT 'production' NOT NULL,
  `featured` integer DEFAULT false NOT NULL,
  `demo_url` text,
  `repo_url` text,
  `case_study_url` text,
  `start_date` integer,
  `end_date` integer,
  `order_index` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
INSERT INTO `__new_projects`("id", "slug", "locale", "title", "subtitle", "short_description", "description", "cover_image_url", "category", "status", "featured", "demo_url", "repo_url", "case_study_url", "start_date", "end_date", "order_index", "created_at", "updated_at") SELECT "id", "slug", 'en', "title", "subtitle", "short_description", "description", "cover_image_url", "category", "status", "featured", "demo_url", "repo_url", "case_study_url", "start_date", "end_date", "order_index", "created_at", "updated_at" FROM `projects`;
DROP TABLE `projects`;
ALTER TABLE `__new_projects` RENAME TO `projects`;
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Recreate seo_settings with locale column
PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_seo_settings` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `page_path` text NOT NULL,
  `locale` text DEFAULT 'en' NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `og_title` text,
  `og_description` text,
  `og_image_url` text,
  `twitter_card` text DEFAULT 'summary_large_image',
  `json_ld` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
INSERT INTO `__new_seo_settings`("id", "page_path", "locale", "title", "description", "og_title", "og_description", "og_image_url", "twitter_card", "json_ld", "created_at", "updated_at") SELECT "id", "page_path", 'en', "title", "description", "og_title", "og_description", "og_image_url", "twitter_card", "json_ld", "created_at", "updated_at" FROM `seo_settings`;
DROP TABLE `seo_settings`;
ALTER TABLE `__new_seo_settings` RENAME TO `seo_settings`;
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Recreate custom_sections with locale column
PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_custom_sections` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL,
  `locale` text DEFAULT 'en' NOT NULL,
  `badge` text,
  `title` text NOT NULL,
  `description` text,
  `layout` text DEFAULT 'cards' NOT NULL,
  `visible` integer DEFAULT true NOT NULL,
  `order_index` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
INSERT INTO `__new_custom_sections`("id", "slug", "locale", "badge", "title", "description", "layout", "visible", "order_index", "created_at", "updated_at") SELECT "id", "slug", 'en', "badge", "title", "description", "layout", "visible", "order_index", "created_at", "updated_at" FROM `custom_sections`;
DROP TABLE `custom_sections`;
ALTER TABLE `__new_custom_sections` RENAME TO `custom_sections`;
PRAGMA foreign_keys=ON;
--> statement-breakpoint
-- Create unique indexes
CREATE UNIQUE INDEX `idx_personal_info_locale` ON `personal_info` (`locale`);
CREATE UNIQUE INDEX `idx_site_settings_locale` ON `site_settings` (`locale`);
CREATE UNIQUE INDEX `idx_homepage_content_locale` ON `homepage_content` (`locale`);
CREATE UNIQUE INDEX `idx_seo_page_path_locale` ON `seo_settings` (`page_path`, `locale`);
CREATE UNIQUE INDEX `idx_projects_slug_locale` ON `projects` (`slug`, `locale`);
CREATE UNIQUE INDEX `idx_custom_sections_slug_locale` ON `custom_sections` (`slug`, `locale`);
CREATE UNIQUE INDEX `idx_form_settings_type_locale` ON `form_settings` (`form_type`, `locale`);
