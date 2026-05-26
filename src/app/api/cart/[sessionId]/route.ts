import { NextResponse } from 'next/server';
import { errorResponse, parseParams } from '@/lib/api-handler';
import { getCartBySession } from '@/lib/data/cart';
import { getCartParamsSchema } from '@/schemas/cart';

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const parsed = parseParams(params, getCartParamsSchema);
  if (!parsed.ok) return parsed.response;

  const cart = await getCartBySession(parsed.data.sessionId);
  if (!cart) {
    return errorResponse(404, 'CART_NOT_FOUND', 'No open cart found for this session');
  }
  return NextResponse.json(cart);
}
