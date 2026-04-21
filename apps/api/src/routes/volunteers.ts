import { isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { institutions, volunteers } from '../database/schema';
import {
  registerVolunteerBodySchema,
  registerVolunteerResponseSchema,
} from '../schemas/volunteer';
import { errorResponseSchema } from '../schemas/shared';
import type { RegisterVolunteerBody } from '../types/volunteer';

const dayLabels: Record<string, string> = {
  monday: 'segunda-feira',
  tuesday: 'terça-feira',
  wednesday: 'quarta-feira',
  thursday: 'quinta-feira',
  friday: 'sexta-feira',
  saturday: 'sábado',
  sunday: 'domingo',
};

function buildWhatsappUrl(whatsapp: string, name: string, profession: string, days: string[], startTime: string, endTime: string) {
  const dayNames = days.map((d) => dayLabels[d]).join(', ');
  const message = `Olá! Me chamo ${name}, sou ${profession} e gostaria de me voluntariar no Instituto Padre José. Tenho disponibilidade às ${dayNames} das ${startTime} às ${endTime}.`;
  return `https://wa.me/55${whatsapp}?text=${encodeURIComponent(message)}`;
}

export async function volunteerRoutes(app: FastifyInstance) {
  const registerVolunteerSchema = {
    description: 'Register a new volunteer and get a pre-filled WhatsApp URL',
    tags: ['Volunteers'],
    body: registerVolunteerBodySchema,
    response: {
      201: registerVolunteerResponseSchema,
      400: errorResponseSchema,
      422: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/volunteers', { schema: registerVolunteerSchema }, registerVolunteer);
}

async function registerVolunteer(
  request: FastifyRequest<{ Body: RegisterVolunteerBody }>,
  reply: FastifyReply,
) {
  const { name, profession, availability } = request.body;

  const [institution] = await db
    .select({ whatsapp: institutions.whatsapp })
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);

  if (!institution?.whatsapp) {
    return reply.status(422).send({
      statusCode: 422,
      code: 'INSTITUTION_WHATSAPP_NOT_SET',
      error: 'Unprocessable Entity',
      message: 'Institution has no WhatsApp number registered',
    });
  }


  const [volunteer] = await db
    .insert(volunteers)
    .values({ name, profession, availability })
    .returning();

  const whatsappUrl = buildWhatsappUrl(
    institution.whatsapp,
    volunteer.name,
    volunteer.profession,
    volunteer.availability.days,
    volunteer.availability.startTime,
    volunteer.availability.endTime,
  );

  return reply.status(201).send({
    id: volunteer.id,
    name: volunteer.name,
    profession: volunteer.profession,
    availability: volunteer.availability,
    whatsappUrl,
  });
}
