PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_site_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`site_name` text DEFAULT 'Portfolio' NOT NULL,
	`favicon_url` text,
	`default_og_image_url` text,
	`analytics_id` text,
	`contact_form_endpoint` text DEFAULT '/api/contact',
	`maintenance_mode` integer DEFAULT false NOT NULL,
	`maintenance_message` text DEFAULT 'Notre site est actuellement en maintenance. Nous serons de retour très bientôt. Merci pour votre patience.',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_site_settings`("id", "site_name", "favicon_url", "default_og_image_url", "analytics_id", "contact_form_endpoint", "maintenance_mode", "maintenance_message", "created_at", "updated_at") SELECT "id", "site_name", "favicon_url", "default_og_image_url", "analytics_id", "contact_form_endpoint", "maintenance_mode", "maintenance_message", "created_at", "updated_at" FROM `site_settings`;--> statement-breakpoint
DROP TABLE `site_settings`;--> statement-breakpoint
ALTER TABLE `__new_site_settings` RENAME TO `site_settings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;