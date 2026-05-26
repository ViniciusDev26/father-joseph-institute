import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { getEventById, updateEvent } from '@/lib/data/events';
import { eventParamsSchema, updateEventBodySchema } from '@/schemas/event';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, eventParamsSchema);
  if (!parsed.ok) return parsed.response;

  const event = await getEventById(parsed.data.id);
  if (!event) return errorResponse(404, 'EVENT_NOT_FOUND', 'Event not found');

  return NextResponse.json(event);
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsedParams = parseParams(params, eventParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, updateEventBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await updateEvent(parsedParams.data.id, parsedBody.data);
  if (!result.ok) return errorResponse(404, result.code, result.message);

  return NextResponse.json(result.event);
}
