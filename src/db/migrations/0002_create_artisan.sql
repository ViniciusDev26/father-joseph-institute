CREATE TABLE "artisan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"photo_object_key" varchar(512) NOT NULL,
	"photo_mime_type" "mime_type" NOT NULL,
	"phone" varchar(11),
	"email" varchar(255),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
