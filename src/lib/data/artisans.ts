import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { artisans } from '@/db/schema';
import { generatePresignedPutUrl, getPublicUrl } from '@/lib/storage';
import type { Artisan } from '@/types/content';

function toArtisan(row: typeof artisans.$inferSelect): Artisan {
  return {
    id: row.id,
    name: row.name,
    photoUrl: getPublicUrl(row.photoObjectKey),
    phone: row.phone ?? null,
    email: row.email ?? null,
    description: row.description ?? null,
  };
}

export async function getArtisans(): Promise<Artisan[]> {
  const rows = await db.select().from(artisans).where(isNull(artisans.deletedAt));
  return rows.map(toArtisan);
}

export async function getArtisanById(id: number): Promise<Artisan | null> {
  const [row] = await db
    .select()
    .from(artisans)
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .limit(1);

  return row ? toArtisan(row) : null;
}

export type CreateArtisanInput = {
  name: string;
  photo: { mimeType: 'image/png' | 'image/jpeg' };
  phone?: string;
  email?: string;
  description?: string;
};

export type CreateArtisanResult = Artisan & { presignedUrl: string };

export async function createArtisan(input: CreateArtisanInput): Promise<CreateArtisanResult> {
  const ext = input.photo.mimeType === 'image/png' ? 'png' : 'jpg';

  const [inserted] = await db
    .insert(artisans)
    .values({
      name: input.name,
      photoObjectKey: 'pending',
      photoMimeType: input.photo.mimeType,
      phone: input.phone ?? null,
      email: input.email ?? null,
      description: input.description ?? null,
    })
    .returning();

  const objectKey = `artisans/${inserted.id}.${ext}`;

  const [updated] = await db
    .update(artisans)
    .set({ photoObjectKey: objectKey })
    .where(eq(artisans.id, inserted.id))
    .returning();

  const presignedUrl = await generatePresignedPutUrl(objectKey, input.photo.mimeType);

  return { ...toArtisan(updated), presignedUrl };
}

export type UpdateArtisanInput = {
  name?: string;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
};

export type UpdateArtisanResult =
  | { ok: true; artisan: Artisan }
  | { ok: false; code: 'ARTISAN_NOT_FOUND' | 'ARTISAN_CONTACT_REQUIRED'; message: string };

export async function updateArtisan(
  id: number,
  patch: UpdateArtisanInput,
): Promise<UpdateArtisanResult> {
  const [current] = await db
    .select()
    .from(artisans)
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .limit(1);

  if (!current) {
    return { ok: false, code: 'ARTISAN_NOT_FOUND', message: 'Artisan not found' };
  }

  const nextPhone = patch.phone === undefined ? current.phone : patch.phone;
  const nextEmail = patch.email === undefined ? current.email : patch.email;

  if (nextPhone === null && nextEmail === null) {
    return {
      ok: false,
      code: 'ARTISAN_CONTACT_REQUIRED',
      message: 'At least one of phone or email must remain set',
    };
  }

  const updates: {
    name?: string;
    phone?: string | null;
    email?: string | null;
    description?: string | null;
    updatedAt: Date;
  } = { updatedAt: new Date() };
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.phone !== undefined) updates.phone = patch.phone;
  if (patch.email !== undefined) updates.email = patch.email;
  if (patch.description !== undefined) updates.description = patch.description;

  const [updated] = await db
    .update(artisans)
    .set(updates)
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .returning();

  if (!updated) {
    return { ok: false, code: 'ARTISAN_NOT_FOUND', message: 'Artisan not found' };
  }

  return { ok: true, artisan: toArtisan(updated) };
}

export async function softDeleteArtisan(id: number): Promise<boolean> {
  const [deleted] = await db
    .update(artisans)
    .set({ deletedAt: new Date() })
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .returning({ id: artisans.id });

  return !!deleted;
}
