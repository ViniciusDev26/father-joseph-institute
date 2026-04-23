import { isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { institutions } from '../database/schema';
import { institutionResponseSchema, updateInstitutionBodySchema } from '../schemas/institution';
import { errorResponseSchema } from '../schemas/shared';
import type { UpdateInstitutionBody } from '../types/institution';

export async function institutionRoutes(app: FastifyInstance) {
  const getInstitutionSchema = {
    description: "Return the institution's profile data",
    tags: ['Institution'],
    response: {
      200: institutionResponseSchema,
      404: errorResponseSchema,
    },
  };

  const updateInstitutionSchema = {
    description: "Update the institution's contact information",
    tags: ['Institution'],
    body: updateInstitutionBodySchema,
    response: {
      200: institutionResponseSchema,
      400: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/institution', { schema: getInstitutionSchema }, getInstitution)
    .patch(
      '/institution',
      {
        schema: updateInstitutionSchema,
        preHandler: [app.authenticate],
      },
      updateInstitution,
    );
}

function toResponse(institution: typeof institutions.$inferSelect) {
  return {
    id: institution.id,
    name: institution.name,
    slug: institution.slug,
    instagram: institution.instagram ?? null,
    whatsapp: institution.whatsapp ?? null,
    pixKey: institution.pixKey ?? null,
    addressStreet: institution.addressStreet ?? null,
    addressComplement: institution.addressComplement ?? null,
    addressNeighborhood: institution.addressNeighborhood ?? null,
    addressCity: institution.addressCity ?? null,
    addressState: institution.addressState ?? null,
    addressZip: institution.addressZip ?? null,
  };
}

async function getInstitution(_request: FastifyRequest, reply: FastifyReply) {
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

  return reply.status(200).send(toResponse(institution));
}

async function updateInstitution(
  request: FastifyRequest<{ Body: UpdateInstitutionBody }>,
  reply: FastifyReply,
) {
  const {
    instagram,
    whatsapp,
    pixKey,
    addressStreet,
    addressComplement,
    addressNeighborhood,
    addressCity,
    addressState,
    addressZip,
  } = request.body;

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
      ...(addressStreet !== undefined && { addressStreet }),
      ...(addressComplement !== undefined && { addressComplement }),
      ...(addressNeighborhood !== undefined && { addressNeighborhood }),
      ...(addressCity !== undefined && { addressCity }),
      ...(addressState !== undefined && { addressState }),
      ...(addressZip !== undefined && { addressZip }),
      updatedAt: new Date(),
    })
    .where(isNull(institutions.deletedAt))
    .returning();

  return reply.status(200).send(toResponse(updated));
}
