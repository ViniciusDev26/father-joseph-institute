import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { createArtisan, getArtisans } from '@/lib/data/artisans';
import { createArtisanBodySchema } from '@/schemas/artisan';

export async function GET() {
  const artisans = await getArtisans();
  return NextResponse.json({ artisans });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request, createArtisanBodySchema);
  if (!parsed.ok) return parsed.response;

  try {
    const result = await createArtisan(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error(err);
    return errorResponse(500, 'INTERNAL_ERROR', 'Failed to create artisan');
  }
}
