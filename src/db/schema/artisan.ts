import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { mimeTypeEnum } from './event';

export const artisans = pgTable('artisan', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  photoObjectKey: varchar('photo_object_key', { length: 512 }).notNull(),
  photoMimeType: mimeTypeEnum('photo_mime_type').notNull(),
  phone: varchar('phone', { length: 11 }),
  email: varchar('email', { length: 255 }),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
