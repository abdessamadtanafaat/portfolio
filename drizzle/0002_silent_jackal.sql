CREATE TABLE `differentiators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text DEFAULT 'Code' NOT NULL,
	`color` text DEFAULT 'brand',
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `hero_cta2_text` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `hero_cta2_url` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `hero_badge_text` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `about_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `about_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `about_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `about_cards` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `differentiators_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `experience_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `experience_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `experience_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `projects_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `projects_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `projects_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `projects_cta_text` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `skills_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `skills_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `skills_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `education_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `education_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `education_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `certificates_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `certificates_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `certificates_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `certificates_in_progress` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `contact_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `contact_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `contact_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `contact_success_message` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `footer_copyright` text;