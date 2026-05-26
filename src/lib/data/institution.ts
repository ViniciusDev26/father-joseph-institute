import { isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { institutions } from '@/db/schema';
import type { Institution } from '@/types/content';

export async function getInstitution(): Promise<Institution | null> {
  const [institution] = await db
    .select()
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);

  if (!institution) return null;

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
