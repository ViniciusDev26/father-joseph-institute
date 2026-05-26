import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { createProduct, getProducts } from '@/lib/data/products';
import { createProductBodySchema } from '@/schemas/product';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request, createProductBodySchema);
  if (!parsed.ok) return parsed.response;

  const result = await createProduct(parsed.data);
  if (!result.ok) return errorResponse(422, result.code, result.message);

  return NextResponse.json(result.product, { status: 201 });
}
