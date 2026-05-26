import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { artisans } from '@/db/schema';
import { getPublicUrl } from '@/lib/storage';
import type { Artisan } from '@/types/content';

export async function getArtisans(): Promise<Artisan[]> {
  const rows = await db.select().from(artisans).where(isNull(artisans.deletedAt));

  return rows.map(artisan => ({
    id: artisan.id,
    name: artisan.name,
    photoUrl: getPublicUrl(artisan.photoObjectKey),
    phone: artisan.phone ?? null,
    email: artisan.email ?? null,
    description: artisan.description ?? null,
  }));
}

export async function getArtisanById(id: number): Promise<Artisan | null> {
  const [artisan] = await db
    .select()
    .from(artisans)
    .where(and(eq(artisans.id, id), isNull(artisans.deletedAt)))
    .limit(1);

  if (!artisan) return null;

  return {
    id: artisan.id,
    name: artisan.name,
    photoUrl: getPublicUrl(artisan.photoObjectKey),
    phone: artisan.phone ?? null,
    email: artisan.email ?? null,
    description: artisan.description ?? null,
  };
}
