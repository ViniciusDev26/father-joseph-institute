import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const institutions = pgTable('institution', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  instagram: varchar('instagram', { length: 255 }),
  whatsapp: varchar('whatsapp', { length: 50 }),
  pixKey: varchar('pix_key', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
