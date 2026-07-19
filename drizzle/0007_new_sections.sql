CREATE TABLE `languages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`level` text NOT NULL,
	`proficiency` integer NOT NULL DEFAULT 80,
	`order_index` integer NOT NULL DEFAULT 0,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `volunteering` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`organization` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`description` text,
	`icon` text,
	`color` text,
	`order_index` integer NOT NULL DEFAULT 0,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `soft_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL DEFAULT 'soft_skill',
	`icon` text,
	`color` text,
	`order_index` integer NOT NULL DEFAULT 0,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `hero_cta3_text` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `hero_cta3_url` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `languages_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `languages_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `languages_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `volunteering_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `volunteering_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `volunteering_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `soft_skills_badge` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `soft_skills_title` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `soft_skills_description` text;--> statement-breakpoint
CREATE INDEX `idx_languages_order` ON `languages` (`order_index`);--> statement-breakpoint
CREATE INDEX `idx_volunteering_order` ON `volunteering` (`order_index`);--> statement-breakpoint
CREATE INDEX `idx_soft_skills_category` ON `soft_skills` (`category`);--> statement-breakpoint
CREATE INDEX `idx_soft_skills_order` ON `soft_skills` (`order_index`);
