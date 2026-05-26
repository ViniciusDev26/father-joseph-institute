import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { getVolunteers, registerVolunteer } from '@/lib/data/volunteers';
import { registerVolunteerBodySchema } from '@/schemas/volunteer';

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const volunteers = await getVolunteers();
  return NextResponse.json({ volunteers });
}

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, registerVolunteerBodySchema);
  if (!parsed.ok) return parsed.response;

  const result = await registerVolunteer(parsed.data);
  if (!result.ok) return errorResponse(422, result.code, result.message);

  return NextResponse.json({ whatsappUrl: result.whatsappUrl }, { status: 201 });
}
