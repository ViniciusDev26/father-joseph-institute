import { jsonb, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export type AvailabilityData = {
  days: string[];
  startTime: string;
  endTime: string;
};

export const volunteers = pgTable('volunteer', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  profession: varchar('profession', { length: 255 }).notNull(),
  availability: jsonb('availability').$type<AvailabilityData>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
