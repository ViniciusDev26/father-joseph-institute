import { isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { institutions, volunteers } from '@/db/schema';

const dayLabels: Record<string, string> = {
  monday: 'segunda-feira',
  tuesday: 'terça-feira',
  wednesday: 'quarta-feira',
  thursday: 'quinta-feira',
  friday: 'sexta-feira',
  saturday: 'sábado',
  sunday: 'domingo',
};

function buildWhatsappUrl(
  whatsapp: string,
  name: string,
  profession: string,
  days: string[],
  startTime: string,
  endTime: string,
) {
  const dayNames = days.map(d => dayLabels[d]).join(', ');
  const message = `Olá! Me chamo ${name}, sou ${profession} e gostaria de me voluntariar no Instituto Padre José. Tenho disponibilidade às ${dayNames} das ${startTime} às ${endTime}.`;
  return `https://wa.me/55${whatsapp}?text=${encodeURIComponent(message)}`;
}

export type RegisterVolunteerInput = {
  name: string;
  profession: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
};

export type RegisterVolunteerResult =
  | { ok: true; whatsappUrl: string }
  | { ok: false; code: 'INSTITUTION_WHATSAPP_NOT_SET'; message: string };

export async function registerVolunteer(
  input: RegisterVolunteerInput,
): Promise<RegisterVolunteerResult> {
  const [institution] = await db
    .select({ whatsapp: institutions.whatsapp })
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);

  if (!institution?.whatsapp) {
    return {
      ok: false,
      code: 'INSTITUTION_WHATSAPP_NOT_SET',
      message: 'Institution has no WhatsApp number registered',
    };
  }

  const [volunteer] = await db
    .insert(volunteers)
    .values({
      name: input.name,
      profession: input.profession,
      availability: input.availability,
    })
    .returning();

  const whatsappUrl = buildWhatsappUrl(
    institution.whatsapp,
    volunteer.name,
    volunteer.profession,
    volunteer.availability.days,
    volunteer.availability.startTime,
    volunteer.availability.endTime,
  );

  return { ok: true, whatsappUrl };
}
