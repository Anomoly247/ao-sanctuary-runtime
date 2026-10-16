CREATE TABLE IF NOT EXISTS `ao_wallet_balances` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `glow_points` decimal(14,2) NOT NULL DEFAULT '0.00',
  `anom_coins` decimal(14,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `ao_wallet_balances_id` PRIMARY KEY (`id`),
  CONSTRAINT `ao_wallet_balances_user_id_unique` UNIQUE (`user_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ao_ledger_entries` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `asset` enum('GP','AC') NOT NULL,
  `direction` enum('earn','spend','adjustment') NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `balance_after` decimal(14,2) NOT NULL,
  `event_type` varchar(80) NOT NULL,
  `idempotency_key` varchar(160) NOT NULL,
  `source` varchar(120) NOT NULL,
  `metadata` json,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `ao_ledger_entries_id` PRIMARY KEY (`id`),
  CONSTRAINT `ao_ledger_user_id_idempotency` UNIQUE (`user_id`,`idempotency_key`)
);
