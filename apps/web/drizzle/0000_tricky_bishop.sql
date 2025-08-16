CREATE TABLE `account` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`expires_at` integer,
	`password` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`created_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `account_account_id_idx` ON `account` (`account_id`);--> statement-breakpoint
CREATE TABLE `passkey` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text,
	`public_key` text NOT NULL,
	`user_id` text NOT NULL,
	`credential_id` text NOT NULL,
	`counter` integer NOT NULL,
	`device_type` text NOT NULL,
	`backed_up` text NOT NULL,
	`transports` text,
	`created_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"',
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `passkey_user_id_idx` ON `passkey` (`user_id`);--> statement-breakpoint
CREATE TABLE `purchase` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`customer_id` text NOT NULL,
	`subscription_id` text,
	`price_id` text NOT NULL,
	`status` text,
	`interval` text,
	`period_start` integer,
	`period_end` integer,
	`cancel_at_period_end` integer,
	`trial_start` integer,
	`trial_end` integer,
	`created_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"',
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchase_subscription_id_unique` ON `purchase` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `purchase_user_id_idx` ON `purchase` (`user_id`);--> statement-breakpoint
CREATE INDEX `purchase_subscription_id_idx` ON `purchase` (`subscription_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"' NOT NULL,
	`impersonated_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_idx` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT '"2025-07-04T06:11:40.238Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-04T06:11:40.238Z"' NOT NULL,
	`customer_id` text,
	`role` text,
	`banned` integer,
	`ban_reason` text,
	`ban_expires` integer,
	`locale` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"',
	`updated_at` integer DEFAULT '"2025-07-04T06:11:40.239Z"'
);
