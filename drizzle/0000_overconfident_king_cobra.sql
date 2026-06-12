CREATE TYPE "public"."location" AS ENUM('REMOTE', 'ONSITE');--> statement-breakpoint
CREATE TYPE "public"."people_type" AS ENUM('REPORTER', 'EDITOR');--> statement-breakpoint
CREATE TYPE "public"."rate_type" AS ENUM('MINUTE', 'FLAT');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('NEW', 'ASSIGNED', 'TRANSCRIBED', 'REVIEWED', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "job_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"previous_status" "status",
	"new_status" "status" NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"duration" integer NOT NULL,
	"location" "location" NOT NULL,
	"city_id" uuid,
	"editor_id" uuid,
	"reporter_id" uuid,
	"reporter_rate" integer,
	"editor_fee" integer,
	"status" "status" DEFAULT 'NEW' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "peoples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"city_id" uuid NOT NULL,
	"rate_type" "rate_type" NOT NULL,
	"rate" integer NOT NULL,
	"people_type" "people_type" NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_log" ADD CONSTRAINT "job_log_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_editor_id_peoples_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."peoples"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_reporter_id_peoples_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."peoples"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "peoples" ADD CONSTRAINT "peoples_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE cascade;