import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody } from '@/lib/api-handler';
import { addToCart } from '@/lib/data/cart';
import { addToCartBodySchema } from '@/schemas/cart';

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, addToCartBodySchema);
  if (!parsed.ok) return parsed.response;

  const result = await addToCart(parsed.data);
  if (!result.ok) return errorResponse(422, result.code, result.message);

  return NextResponse.json(result.cart);
}
