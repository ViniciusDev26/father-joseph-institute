import { and, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/db/connection';
import { orderItems, orders } from '@/db/schema';

export type OrderItem = {
  id: number;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export type OrderRecord = {
  id: number;
  status: 'pending' | 'paid' | 'delivered';
  total: number;
  observations: string | null;
  sessionId: string;
  createdAt: string;
  items: OrderItem[];
};

export async function getOrders(): Promise<OrderRecord[]> {
  const rows = await db
    .select({
      orderId: orders.id,
      status: orders.status,
      total: orders.total,
      observations: orders.observations,
      sessionId: orders.sessionId,
      createdAt: orders.createdAt,
      itemId: orderItems.id,
      productName: orderItems.productName,
      unitPrice: orderItems.unitPrice,
      quantity: orderItems.quantity,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(isNull(orders.deletedAt))
    .orderBy(desc(orders.createdAt));

  const byOrder = new Map<number, OrderRecord>();
  for (const row of rows) {
    let order = byOrder.get(row.orderId);
    if (!order) {
      order = {
        id: row.orderId,
        status: row.status,
        total: parseFloat(row.total),
        observations: row.observations,
        sessionId: row.sessionId,
        createdAt: row.createdAt.toISOString(),
        items: [],
      };
      byOrder.set(row.orderId, order);
    }
    if (row.itemId !== null) {
      order.items.push({
        id: row.itemId,
        productName: row.productName ?? '',
        unitPrice: parseFloat(row.unitPrice ?? '0'),
        quantity: row.quantity ?? 0,
      });
    }
  }
  return [...byOrder.values()];
}

export type UpdateOrderStatusResult =
  | { ok: true; id: number; status: 'pending' | 'paid' | 'delivered' }
  | { ok: false; code: 'ORDER_NOT_FOUND'; message: string };

export async function updateOrderStatus(
  id: number,
  status: 'pending' | 'paid' | 'delivered',
): Promise<UpdateOrderStatusResult> {
  const [updated] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(orders.id, id), isNull(orders.deletedAt)))
    .returning({ id: orders.id, status: orders.status });

  if (!updated) {
    return { ok: false, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
  }
  return { ok: true, id: updated.id, status: updated.status };
}

export type UpdateOrderObservationsResult =
  | { ok: true; id: number; observations: string | null }
  | { ok: false; code: 'ORDER_NOT_FOUND'; message: string };

export async function updateOrderObservations(
  id: number,
  observations: string | null,
): Promise<UpdateOrderObservationsResult> {
  const [updated] = await db
    .update(orders)
    .set({ observations, updatedAt: new Date() })
    .where(and(eq(orders.id, id), isNull(orders.deletedAt)))
    .returning({ id: orders.id, observations: orders.observations });

  if (!updated) {
    return { ok: false, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
  }
  return { ok: true, id: updated.id, observations: updated.observations };
}
