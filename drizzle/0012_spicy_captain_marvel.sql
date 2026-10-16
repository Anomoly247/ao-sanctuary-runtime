CREATE TABLE `ao_identity_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`house` varchar(32),
	`mount` varchar(64),
	`mount_color` varchar(32),
	`guardian_tier` enum('child','teen','adult','guardian') NOT NULL DEFAULT 'adult',
	`guardian_confirmed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ao_identity_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `ao_identity_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `ao_inventory_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`package_id` int NOT NULL,
	`asset_id` varchar(120) NOT NULL,
	`acquisition` enum('grant','ac_purchase') NOT NULL DEFAULT 'grant',
	`idempotency_key` varchar(160) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ao_inventory_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `ao_inventory_user_id_idempotency` UNIQUE(`user_id`,`idempotency_key`)
);
--> statement-breakpoint
CREATE TABLE `ao_sentinel_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_key` varchar(160) NOT NULL,
	`subject_type` enum('asset','profile','media') NOT NULL,
	`subject_id` varchar(160) NOT NULL,
	`severity` enum('low','medium','high') NOT NULL DEFAULT 'low',
	`status` enum('open','under_review','resolved','dismissed') NOT NULL DEFAULT 'open',
	`reason` text NOT NULL,
	`evidence` json,
	`created_by` int NOT NULL,
	`reviewed_by` int,
	`reviewed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ao_sentinel_cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `ao_sentinel_cases_case_key_unique` UNIQUE(`case_key`)
);
