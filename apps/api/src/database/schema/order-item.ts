import { integer, numeric, pgTable, serial, timestamp, unique, varchar } from 'drizzle-orm/pg-core';
import { orders } from './order';
import { products } from './product';

export const orderItems = pgTable(
  'order_item',
  {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
    productName: varchar('product_name', { length: 255 }).notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  t => [unique().on(t.orderId, t.productId)],
);
