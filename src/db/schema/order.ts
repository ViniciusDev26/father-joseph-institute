import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { carts } from './cart';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'delivered']);

export const orders = pgTable('order', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id').references(() => carts.id, { onDelete: 'set null' }),
  sessionId: varchar('session_id', { length: 36 }).notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  observations: text('observations'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
