import type { FastifyInstance, preHandlerHookHandler } from 'fastify';
import fp from 'fastify-plugin';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { env } from '../env';
import { unauthorizedResponseSchema, validateAuthResponseSchema } from '../schemas/auth';

export const authProvider = fp(async (app: FastifyInstance) => {
  const authenticate: preHandlerHookHandler = async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Basic ')) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const [, base64Credentials] = authHeader.split(' ');

    if (!base64Credentials) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    if (credentials !== env.ADMIN_BASIC_AUTH_TOKEN) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  };

  app.decorate('authenticate', authenticate);
});

export async function authRoutes(app: FastifyInstance) {
  const validateAuthSchema = {
    description: 'Validate admin credentials',
    tags: ['Auth'],
    response: {
      200: validateAuthResponseSchema,
      401: unauthorizedResponseSchema,
    },
  };

  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/validate',
    {
      schema: validateAuthSchema,
      preHandler: [app.authenticate],
    },
    async (_request, reply) => {
      return reply.status(200).send({ valid: true });
    },
  );
}
