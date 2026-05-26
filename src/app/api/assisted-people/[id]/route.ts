import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import {
  getAssistedPersonById,
  softDeleteAssistedPerson,
  updateAssistedPerson,
} from '@/lib/data/assisted-people';
import {
  assistedPersonParamsSchema,
  updateAssistedPersonBodySchema,
} from '@/schemas/assisted-person';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, assistedPersonParamsSchema);
  if (!parsed.ok) return parsed.response;

  const person = await getAssistedPersonById(parsed.data.id);
  if (!person) return errorResponse(404, 'ASSISTED_PERSON_NOT_FOUND', 'Assisted person not found');

  return NextResponse.json(person);
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsedParams = parseParams(params, assistedPersonParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, updateAssistedPersonBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await updateAssistedPerson(parsedParams.data.id, parsedBody.data);
  if (!result.ok) return errorResponse(404, result.code, result.message);

  return NextResponse.json(result.person);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, assistedPersonParamsSchema);
  if (!parsed.ok) return parsed.response;

  const deleted = await softDeleteAssistedPerson(parsed.data.id);
  if (!deleted) return errorResponse(404, 'ASSISTED_PERSON_NOT_FOUND', 'Assisted person not found');

  return new NextResponse(null, { status: 204 });
}
