import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { getProductById, softDeleteProduct, updateProduct } from '@/lib/data/products';
import { productParamsSchema, updateProductBodySchema } from '@/schemas/product';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, productParamsSchema);
  if (!parsed.ok) return parsed.response;

  const product = await getProductById(parsed.data.id);
  if (!product) return errorResponse(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  return NextResponse.json(product);
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsedParams = parseParams(params, productParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, updateProductBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await updateProduct(parsedParams.data.id, parsedBody.data);
  if (!result.ok) {
    const status = result.code === 'PRODUCT_NOT_FOUND' ? 404 : 422;
    return errorResponse(status, result.code, result.message);
  }

  return NextResponse.json(result.product);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, productParamsSchema);
  if (!parsed.ok) return parsed.response;

  const deleted = await softDeleteProduct(parsed.data.id);
  if (!deleted) return errorResponse(404, 'PRODUCT_NOT_FOUND', 'Product not found');

  return new NextResponse(null, { status: 204 });
}
