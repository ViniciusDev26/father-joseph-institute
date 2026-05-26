import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { artisans } from './artisan';
import { products } from './product';

export const productArtisans = pgTable(
  'product_artisan',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    artisanId: integer('artisan_id')
      .notNull()
      .references(() => artisans.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [primaryKey({ columns: [t.productId, t.artisanId] })],
);
