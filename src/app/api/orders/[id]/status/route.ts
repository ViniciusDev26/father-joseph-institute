import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { updateOrderStatus } from '@/lib/data/orders';
import { updateOrderStatusBodySchema, updateOrderStatusParamsSchema } from '@/schemas/order';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsedParams = parseParams(params, updateOrderStatusParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, updateOrderStatusBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await updateOrderStatus(parsedParams.data.id, parsedBody.data.status);
  if (!result.ok) return errorResponse(404, result.code, result.message);

  return NextResponse.json({ id: result.id, status: result.status });
}
