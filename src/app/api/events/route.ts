import { NextResponse } from 'next/server';
import { errorResponse, parseJsonBody } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/auth';
import { createEvent, getEvents } from '@/lib/data/events';
import { createEventBodySchema } from '@/schemas/event';

export async function GET() {
  const events = await getEvents();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = await parseJsonBody(request, createEventBodySchema);
  if (!parsed.ok) return parsed.response;

  try {
    const created = await createEvent(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return errorResponse(500, 'INTERNAL_ERROR', 'Failed to create event');
  }
}
