CREATE TABLE `custom_section_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_id` integer NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`description` text,
	`image_url` text,
	`link_url` text,
	`link_label` text,
	`icon` text,
	`color` text,
	`tags` text DEFAULT '[]',
	`metadata` text DEFAULT '{}',
	`visible` integer DEFAULT true NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `custom_sections`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `custom_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`badge` text,
	`title` text NOT NULL,
	`description` text,
	`layout` text DEFAULT 'cards' NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `custom_sections_slug_unique` ON `custom_sections` (`slug`);--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `footer_description` text;--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `footer_nav_title` text DEFAULT 'Navigation';--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `footer_contact_title` text DEFAULT 'Contact';--> statement-breakpoint
ALTER TABLE `homepage_content` ADD `footer_tech_title` text DEFAULT 'Technologies';