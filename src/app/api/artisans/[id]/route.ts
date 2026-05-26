import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import {
  getArtisanById,
  softDeleteArtisan,
  updateArtisan,
} from '@/lib/data/artisans';
import { artisanParamsSchema, updateArtisanBodySchema } from '@/schemas/artisan';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, artisanParamsSchema);
  if (!parsed.ok) return parsed.response;

  const artisan = await getArtisanById(parsed.data.id);
  if (!artisan) return errorResponse(404, 'ARTISAN_NOT_FOUND', 'Artisan not found');

  return NextResponse.json(artisan);
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsedParams = parseParams(params, artisanParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, updateArtisanBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await updateArtisan(parsedParams.data.id, parsedBody.data);
  if (!result.ok) {
    const status = result.code === 'ARTISAN_NOT_FOUND' ? 404 : 400;
    return errorResponse(status, result.code, result.message);
  }

  return NextResponse.json(result.artisan);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, artisanParamsSchema);
  if (!parsed.ok) return parsed.response;

  const deleted = await softDeleteArtisan(parsed.data.id);
  if (!deleted) return errorResponse(404, 'ARTISAN_NOT_FOUND', 'Artisan not found');

  return new NextResponse(null, { status: 204 });
}
