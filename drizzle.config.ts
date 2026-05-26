import { defineConfig } from 'drizzle-kit';

// Migrations need a connection that supports prepared statements.
// On Supabase that's the direct connection or the session pooler
// (port 5432). DATABASE_URL at runtime points to the transaction
// pooler (port 6543, no prepared statements) — set DIRECT_URL to the
// session pooler URL for the migrate command to work.
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error('DIRECT_URL or DATABASE_URL must be set');

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
});
