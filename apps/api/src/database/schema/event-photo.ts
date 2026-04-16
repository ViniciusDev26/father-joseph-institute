import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { events, mimeTypeEnum } from './event';

export const eventPhotos = pgTable('event_photo', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  objectKey: varchar('object_key', { length: 512 }).notNull(),
  mimeType: mimeTypeEnum('mime_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
