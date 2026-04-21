import { isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { institutions } from '../database/schema';
import {
  updateInstitutionBodySchema,
  updateInstitutionResponseSchema,
} from '../schemas/institution';
import { errorResponseSchema } from '../schemas/shared';
import type { UpdateInstitutionBody } from '../types/institution';

export async function institutionRoutes(app: FastifyInstance) {
  const updateInstitutionSchema = {
    description: "Update the institution's contact information",
    tags: ['Institution'],
    body: updateInstitutionBodySchema,
    response: {
      200: updateInstitutionResponseSchema,
      400: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .patch('/institution', { schema: updateInstitutionSchema }, updateInstitution);
}

async function updateInstitution(
  request: FastifyRequest<{ Body: UpdateInstitutionBody }>,
  reply: FastifyReply,
) {
  const { instagram, whatsapp, pixKey } = request.body;

  const [institution] = await db
    .select()
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);

  if (!institution) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'INSTITUTION_NOT_FOUND',
      error: 'Not Found',
      message: 'Institution not found',
    });
  }

  const [updated] = await db
    .update(institutions)
    .set({
      ...(instagram !== undefined && { instagram }),
      ...(whatsapp !== undefined && { whatsapp }),
      ...(pixKey !== undefined && { pixKey }),
      updatedAt: new Date(),
    })
    .returning();

  return reply.status(200).send({
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    instagram: updated.instagram ?? null,
    whatsapp: updated.whatsapp ?? null,
    pixKey: updated.pixKey ?? null,
  });
}
