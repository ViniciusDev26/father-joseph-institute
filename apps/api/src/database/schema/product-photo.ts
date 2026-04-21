import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { mimeTypeEnum } from './event';
import { products } from './product';

export const productPhotos = pgTable('product_photo', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  objectKey: varchar('object_key', { length: 512 }).notNull(),
  mimeType: mimeTypeEnum('mime_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
