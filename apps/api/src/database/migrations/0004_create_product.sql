CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "product_artisan" (
	"product_id" integer NOT NULL,
	"artisan_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_artisan_product_id_artisan_id_pk" PRIMARY KEY("product_id","artisan_id")
);
--> statement-breakpoint
CREATE TABLE "product_photo" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"object_key" varchar(512) NOT NULL,
	"mime_type" "mime_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "product_artisan" ADD CONSTRAINT "product_artisan_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_artisan" ADD CONSTRAINT "product_artisan_artisan_id_artisan_id_fk" FOREIGN KEY ("artisan_id") REFERENCES "public"."artisan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_photo" ADD CONSTRAINT "product_photo_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;