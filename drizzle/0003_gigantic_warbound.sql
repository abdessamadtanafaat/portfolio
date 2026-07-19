CREATE TABLE `form_fields` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`form_type` text DEFAULT 'contact' NOT NULL,
	`label` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`placeholder` text,
	`helper_text` text,
	`required` integer DEFAULT true NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`options` text,
	`validation` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `form_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`form_type` text DEFAULT 'contact' NOT NULL,
	`submit_button_text` text DEFAULT 'Envoyer le message' NOT NULL,
	`loading_button_text` text DEFAULT 'Envoi en cours...' NOT NULL,
	`success_message` text DEFAULT 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.' NOT NULL,
	`error_message` text DEFAULT 'Une erreur est survenue. Veuillez réessayer.' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nav_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	`type` text DEFAULT 'internal' NOT NULL,
	`target` text DEFAULT '_self' NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `differentiators` ADD `visible` integer DEFAULT true NOT NULL;