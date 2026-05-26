import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { assistedPeople } from '@/db/schema';

export type AssistedPerson = {
  id: number;
  name: string;
  description: string | null;
};

function toAssistedPerson(row: typeof assistedPeople.$inferSelect): AssistedPerson {
  return { id: row.id, name: row.name, description: row.description ?? null };
}

export async function getAssistedPeople(): Promise<AssistedPerson[]> {
  const rows = await db.select().from(assistedPeople).where(isNull(assistedPeople.deletedAt));
  return rows.map(toAssistedPerson);
}

export async function getAssistedPersonById(id: number): Promise<AssistedPerson | null> {
  const [row] = await db
    .select()
    .from(assistedPeople)
    .where(and(eq(assistedPeople.id, id), isNull(assistedPeople.deletedAt)))
    .limit(1);
  return row ? toAssistedPerson(row) : null;
}

export async function createAssistedPerson(input: {
  name: string;
  description?: string | null;
}): Promise<AssistedPerson> {
  const [row] = await db
    .insert(assistedPeople)
    .values({ name: input.name, description: input.description ?? null })
    .returning();
  return toAssistedPerson(row);
}

export type UpdateAssistedPersonResult =
  | { ok: true; person: AssistedPerson }
  | { ok: false; code: 'ASSISTED_PERSON_NOT_FOUND'; message: string };

export async function updateAssistedPerson(
  id: number,
  patch: { name?: string; description?: string | null },
): Promise<UpdateAssistedPersonResult> {
  const updates: { name?: string; description?: string | null; updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.description !== undefined) updates.description = patch.description;

  const [updated] = await db
    .update(assistedPeople)
    .set(updates)
    .where(and(eq(assistedPeople.id, id), isNull(assistedPeople.deletedAt)))
    .returning();

  if (!updated) {
    return { ok: false, code: 'ASSISTED_PERSON_NOT_FOUND', message: 'Assisted person not found' };
  }
  return { ok: true, person: toAssistedPerson(updated) };
}

export async function softDeleteAssistedPerson(id: number): Promise<boolean> {
  const [deleted] = await db
    .update(assistedPeople)
    .set({ deletedAt: new Date() })
    .where(and(eq(assistedPeople.id, id), isNull(assistedPeople.deletedAt)))
    .returning({ id: assistedPeople.id });
  return !!deleted;
}
