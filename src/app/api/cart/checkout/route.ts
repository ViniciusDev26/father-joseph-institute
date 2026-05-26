import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody } from '@/lib/api-handler';
import { checkout } from '@/lib/data/cart';
import { checkoutBodySchema } from '@/schemas/cart';

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, checkoutBodySchema);
  if (!parsed.ok) return parsed.response;

  const result = await checkout(parsed.data.sessionId);
  if (!result.ok) {
    const status = result.code === 'CART_NOT_FOUND' ? 404 : 422;
    return errorResponse(status, result.code, result.message);
  }

  return NextResponse.json({ orderId: result.orderId, whatsappUrl: result.whatsappUrl });
}
