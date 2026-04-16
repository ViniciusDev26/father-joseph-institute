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
import { contentRoutes } from './routes/content';
import { eventRoutes } from './routes/events';

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

await app.register(contentRoutes);
await app.register(eventRoutes);

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server running at ${address}`);
});
