CREATE TABLE IF NOT EXISTS `achievements` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `icon` text,
  `category` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user_achievements` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `achievement_id` int NOT NULL,
  `unlocked_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`),
  CONSTRAINT `user_achievements_user_achievement` UNIQUE(`user_id`,`achievement_id`)
);
--> statement-breakpoint
ALTER TABLE `global_missions` ADD COLUMN IF NOT EXISTS `achievement_id` int;
