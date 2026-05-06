import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import scalarApiReference from '@scalar/fastify-api-reference';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import Fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { db } from './database/connection';
import { env } from './env';
import { artisanRoutes } from './routes/artisans';
import { authProvider, authRoutes } from './routes/auth';
import { cartRoutes } from './routes/cart';
import { eventRoutes } from './routes/events';
import { institutionRoutes } from './routes/institution';
import { orderRoutes } from './routes/orders';
import { productRoutes } from './routes/products';
import { volunteerRoutes } from './routes/volunteers';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: import('fastify').preHandlerHookHandler;
  }
}

const app = Fastify({ logger: true });

app.log.info('Running database migrations...');
try {
  await migrate(db, { migrationsFolder: './src/database/migrations' });
  app.log.info('Database migrations completed successfully.');
} catch (err) {
  app.log.error({ err }, 'Database migration failed.');
  process.exit(1);
}

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(cors, {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Instituto Padre José — API',
      description: 'API REST do Instituto Padre José',
      version: '0.1.0',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
  },
  transform: jsonSchemaTransform,
});

await app.register(scalarApiReference, {
  routePrefix: '/docs',
});

// Register all providers first (if any), then all routes
await app.register(authProvider);

await app.register(authRoutes);
await app.register(artisanRoutes);
await app.register(cartRoutes);
await app.register(eventRoutes);
await app.register(institutionRoutes);
await app.register(orderRoutes);
await app.register(productRoutes);
await app.register(volunteerRoutes);

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server running at ${address}`);
});
