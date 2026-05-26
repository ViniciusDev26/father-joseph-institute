import { pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const mimeTypeEnum = pgEnum('mime_type', ['image/png', 'image/jpeg']);

export const events = pgTable('event', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  date: timestamp('date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
