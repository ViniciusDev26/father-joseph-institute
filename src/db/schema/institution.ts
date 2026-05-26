import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const institutions = pgTable('institution', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  instagram: varchar('instagram', { length: 255 }),
  whatsapp: varchar('whatsapp', { length: 50 }),
  pixKey: varchar('pix_key', { length: 255 }),
  addressStreet: varchar('address_street', { length: 255 }),
  addressComplement: varchar('address_complement', { length: 255 }),
  addressNeighborhood: varchar('address_neighborhood', { length: 255 }),
  addressCity: varchar('address_city', { length: 255 }),
  addressState: varchar('address_state', { length: 2 }),
  addressZip: varchar('address_zip', { length: 8 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
