import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { getInstitution, updateInstitution } from '@/lib/data/institution';
import { updateInstitutionBodySchema } from '@/schemas/institution';

export async function GET() {
  const institution = await getInstitution();
  if (!institution) return errorResponse(404, 'INSTITUTION_NOT_FOUND', 'Institution not found');
  return NextResponse.json(institution);
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request, updateInstitutionBodySchema);
  if (!parsed.ok) return parsed.response;

  const result = await updateInstitution(parsed.data);
  if (!result.ok) return errorResponse(404, result.code, result.message);

  return NextResponse.json(result.institution);
}
