import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { addEventPhotos } from '@/lib/data/events';
import { addEventPhotosBodySchema, eventParamsSchema } from '@/schemas/event';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsedParams = parseParams(params, eventParamsSchema);
  if (!parsedParams.ok) return parsedParams.response;

  const parsedBody = await parseJsonBody(request, addEventPhotosBodySchema);
  if (!parsedBody.ok) return parsedBody.response;

  const result = await addEventPhotos(parsedParams.data.id, parsedBody.data.photos);
  if (!result.ok) return errorResponse(404, result.code, result.message);

  return NextResponse.json({ photos: result.photos }, { status: 201 });
}
