import { isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { institutions } from '@/db/schema';
import type { Institution } from '@/types/content';

function toInstitution(row: typeof institutions.$inferSelect): Institution {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    instagram: row.instagram ?? null,
    whatsapp: row.whatsapp ?? null,
    pixKey: row.pixKey ?? null,
    addressStreet: row.addressStreet ?? null,
    addressComplement: row.addressComplement ?? null,
    addressNeighborhood: row.addressNeighborhood ?? null,
    addressCity: row.addressCity ?? null,
    addressState: row.addressState ?? null,
    addressZip: row.addressZip ?? null,
  };
}

export async function getInstitution(): Promise<Institution | null> {
  const [row] = await db
    .select()
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);
  return row ? toInstitution(row) : null;
}

export type UpdateInstitutionInput = {
  instagram?: string | null;
  whatsapp?: string | null;
  pixKey?: string | null;
  addressStreet?: string | null;
  addressComplement?: string | null;
  addressNeighborhood?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZip?: string | null;
};

export type UpdateInstitutionResult =
  | { ok: true; institution: Institution }
  | { ok: false; code: 'INSTITUTION_NOT_FOUND'; message: string };

export async function updateInstitution(
  patch: UpdateInstitutionInput,
): Promise<UpdateInstitutionResult> {
  const [existing] = await db
    .select()
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);

  if (!existing) {
    return { ok: false, code: 'INSTITUTION_NOT_FOUND', message: 'Institution not found' };
  }

  const [updated] = await db
    .update(institutions)
    .set({
      ...(patch.instagram !== undefined && { instagram: patch.instagram }),
      ...(patch.whatsapp !== undefined && { whatsapp: patch.whatsapp }),
      ...(patch.pixKey !== undefined && { pixKey: patch.pixKey }),
      ...(patch.addressStreet !== undefined && { addressStreet: patch.addressStreet }),
      ...(patch.addressComplement !== undefined && { addressComplement: patch.addressComplement }),
      ...(patch.addressNeighborhood !== undefined && {
        addressNeighborhood: patch.addressNeighborhood,
      }),
      ...(patch.addressCity !== undefined && { addressCity: patch.addressCity }),
      ...(patch.addressState !== undefined && { addressState: patch.addressState }),
      ...(patch.addressZip !== undefined && { addressZip: patch.addressZip }),
      updatedAt: new Date(),
    })
    .where(isNull(institutions.deletedAt))
    .returning();

  return { ok: true, institution: toInstitution(updated) };
}
