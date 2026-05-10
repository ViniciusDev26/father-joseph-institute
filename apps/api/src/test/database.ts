import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

type Database = typeof import('../database/connection').db;

let container: StartedPostgreSqlContainer | undefined;
let db: Database | undefined;

export async function startTestDatabase(): Promise<{
  db: Database;
  container: StartedPostgreSqlContainer;
}> {
  if (container && db) return { db, container };

  container = await new PostgreSqlContainer('postgres:16-alpine').start();

  process.env.DATABASE_URL = container.getConnectionUri();
  process.env.PORT ??= '3000';
  process.env.R2_ACCOUNT_ID ??= 'test';
  process.env.R2_ACCESS_KEY_ID ??= 'test';
  process.env.R2_SECRET_ACCESS_KEY ??= 'test';
  process.env.R2_BUCKET_NAME ??= 'test';
  process.env.R2_PUBLIC_URL ??= 'https://public.example.com';
  process.env.ADMIN_BASIC_AUTH_TOKEN ??= 'test-token';

  ({ db } = await import('../database/connection'));
  const { migrate } = await import('drizzle-orm/postgres-js/migrator');
  await migrate(db, { migrationsFolder: './src/database/migrations' });

  return { db, container };
}

export async function stopTestDatabase(): Promise<void> {
  await container?.stop();
  container = undefined;
  db = undefined;
}
