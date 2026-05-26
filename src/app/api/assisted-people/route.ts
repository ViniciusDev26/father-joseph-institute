import { NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { createAssistedPerson, getAssistedPeople } from '@/lib/data/assisted-people';
import { createAssistedPersonBodySchema } from '@/schemas/assisted-person';

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const assistedPeople = await getAssistedPeople();
  return NextResponse.json({ assistedPeople });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request, createAssistedPersonBodySchema);
  if (!parsed.ok) return parsed.response;

  const person = await createAssistedPerson(parsed.data);
  return NextResponse.json(person, { status: 201 });
}
