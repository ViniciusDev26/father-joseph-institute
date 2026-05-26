import { pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const cartStatusEnum = pgEnum('cart_status', ['open', 'closed']);

export const carts = pgTable('cart', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 36 }).notNull(),
  status: cartStatusEnum('status').notNull().default('open'),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
