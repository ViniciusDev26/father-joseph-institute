import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { env } from '../env';
import {
  unauthorizedResponseSchema,
  validateAuthResponseSchema,
} from '../schemas/auth';

export async function authRoutes(app: FastifyInstance) {
  // Decorator to protect routes
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Basic ')) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    if (credentials !== env.ADMIN_BASIC_AUTH_TOKEN) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  const validateAuthSchema = {
    description: 'Validate admin credentials',
    tags: ['Auth'],
    response: {
      200: validateAuthResponseSchema,
      401: unauthorizedResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/auth/validate', { schema: validateAuthSchema }, validateAuth);
}

async function validateAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Basic ')) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

  if (credentials !== env.ADMIN_BASIC_AUTH_TOKEN) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  return reply.status(200).send({ valid: true });
}
