import { NextResponse } from 'next/server';
import { errorResponse, parseParams } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { deleteEventPhoto } from '@/lib/data/events';
import { eventPhotoParamsSchema } from '@/schemas/event';

type RouteContext = { params: Promise<{ id: string; photoId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const params = await context.params;
  const parsed = parseParams(params, eventPhotoParamsSchema);
  if (!parsed.ok) return parsed.response;

  const result = await deleteEventPhoto(parsed.data.id, parsed.data.photoId);
  if (!result.ok) {
    const status = result.code === 'EVENT_MUST_HAVE_PHOTO' ? 400 : 404;
    return errorResponse(status, result.code, result.message);
  }

  return new NextResponse(null, { status: 204 });
}
