CREATE TABLE `admin_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_user_email_unique` ON `admin_user` (`email`);--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`issuer` text NOT NULL,
	`issue_date` integer NOT NULL,
	`expiry_date` integer,
	`credential_url` text,
	`image_url` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`institution` text NOT NULL,
	`degree` text NOT NULL,
	`field` text NOT NULL,
	`location` text,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`honors` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`location` text,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`current` integer DEFAULT false NOT NULL,
	`description` text,
	`highlights` text DEFAULT '[]' NOT NULL,
	`technologies` text DEFAULT '[]' NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `homepage_content` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`hero_headline` text NOT NULL,
	`hero_subtext` text,
	`hero_cta_text` text,
	`hero_cta_url` text,
	`section_visibility` text DEFAULT '{}' NOT NULL,
	`section_order` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `personal_info` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
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
--> statement-breakpoint
CREATE TABLE `project_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`is_cover` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project_technologies` (
	`project_id` integer NOT NULL,
	`technology_id` integer NOT NULL,
	PRIMARY KEY(`project_id`, `technology_id`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`technology_id`) REFERENCES `technologies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
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
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE TABLE `seo_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_path` text NOT NULL,
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
--> statement-breakpoint
CREATE UNIQUE INDEX `seo_settings_page_path_unique` ON `seo_settings` (`page_path`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`site_name` text NOT NULL,
	`favicon_url` text,
	`default_og_image_url` text,
	`analytics_id` text,
	`contact_form_endpoint` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`proficiency` integer NOT NULL,
	`icon` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform` text NOT NULL,
	`url` text NOT NULL,
	`label` text,
	`icon` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `technologies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`icon` text,
	`color` text,
	`primary` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `technologies_slug_unique` ON `technologies` (`slug`);