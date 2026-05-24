ALTER TABLE "volunteer" ADD COLUMN "phone" varchar(11);--> statement-breakpoint
UPDATE "volunteer" SET "phone" = '00000000000' WHERE "phone" IS NULL;--> statement-breakpoint
ALTER TABLE "volunteer" ALTER COLUMN "phone" SET NOT NULL;