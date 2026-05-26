import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getOrders } from '@/lib/data/orders';

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const orders = await getOrders();
  return NextResponse.json({ orders });
}
