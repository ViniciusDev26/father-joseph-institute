import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { updateOrderObservations } from '@/lib/data/orders';
import {
  updateOrderObservationsBodySchema,
  updateOrderObservationsParamsSchema,
} from '@/schemas/order';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsedParams = parseParams(params, updateOrderObservationsParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, updateOrderObservationsBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await updateOrderObservations(parsedParams.data.id, parsedBody.data.observations);
  if (!result.ok) return errorResponse(404, result.code, result.message);

  return NextResponse.json({ id: result.id, observations: result.observations });
}
