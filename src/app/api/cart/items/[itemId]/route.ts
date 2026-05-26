import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { updateCartItemQuantity } from '@/lib/data/cart';
import { updateCartItemBodySchema, updateCartItemParamsSchema } from '@/schemas/cart';

type RouteContext = { params: Promise<{ itemId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const params = await context.params;
  const parsedParams = parseParams(params, updateCartItemParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, updateCartItemBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await updateCartItemQuantity(
    parsedParams.data.itemId,
    parsedBody.data.sessionId,
    parsedBody.data.quantity,
  );
  if (!result.ok) return errorResponse(404, result.code, result.message);

  return NextResponse.json(result.cart);
}
