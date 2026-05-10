import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

export async function buildTestApp(
  routes: FastifyPluginAsync | FastifyPluginAsync[],
): Promise<FastifyInstance> {
  const Fastify = (await import('fastify')).default;
  const { serializerCompiler, validatorCompiler } = await import('fastify-type-provider-zod');

  const app = Fastify();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.decorate('authenticate', async () => {});

  const plugins = Array.isArray(routes) ? routes : [routes];
  for (const plugin of plugins) {
    await app.register(plugin);
  }

  return app;
}
