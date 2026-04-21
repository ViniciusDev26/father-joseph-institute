import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import scalarApiReference from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env } from './env';
import { artisanRoutes } from './routes/artisans';
import { cartRoutes } from './routes/cart';
import { eventRoutes } from './routes/events';
import { institutionRoutes } from './routes/institution';
import { productRoutes } from './routes/products';
import { volunteerRoutes } from './routes/volunteers';

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(cors, { origin: true });

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

await app.register(artisanRoutes);
await app.register(cartRoutes);
await app.register(eventRoutes);
await app.register(institutionRoutes);
await app.register(productRoutes);
await app.register(volunteerRoutes);

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server running at ${address}`);
});
