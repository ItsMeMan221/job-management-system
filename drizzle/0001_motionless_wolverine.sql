ALTER TABLE "jobs" ADD COLUMN "editor_rate" integer;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "reporter_rate_type" "rate_type";--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "editor_rate_type" "rate_type";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "editor_fee";