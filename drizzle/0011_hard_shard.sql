CREATE TABLE `ao_troll_crush_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`session_id` varchar(120) NOT NULL,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	`completed_at` timestamp,
	`guardian_confirmed` boolean NOT NULL DEFAULT false,
	`completion_event` varchar(80) NOT NULL,
	`score` int,
	`completed_rounds` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ao_troll_crush_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `ao_troll_crush_sessions_session_id_unique` UNIQUE(`session_id`)
);
