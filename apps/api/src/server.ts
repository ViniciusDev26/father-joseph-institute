import cors from '@fastify/cors';
import Fastify from 'fastify';
import { env } from './env';
import { contentRoutes } from './routes/content';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(contentRoutes);

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server running at ${address}`);
});
