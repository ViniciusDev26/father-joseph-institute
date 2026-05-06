import { and, desc, eq, isNull } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { orderItems, orders } from '../database/schema';
import {
  listOrdersResponseSchema,
  updateOrderObservationsBodySchema,
  updateOrderObservationsParamsSchema,
  updateOrderObservationsResponseSchema,
  updateOrderStatusBodySchema,
  updateOrderStatusParamsSchema,
  updateOrderStatusResponseSchema,
} from '../schemas/order';
import { errorResponseSchema } from '../schemas/shared';
import type {
  UpdateOrderObservationsBody,
  UpdateOrderObservationsParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
} from '../types/order';

export async function orderRoutes(app: FastifyInstance) {
  const listOrdersSchema = {
    description: 'List all orders, most recent first',
    tags: ['Orders'],
    response: {
      200: listOrdersResponseSchema,
      401: errorResponseSchema,
    },
  };

  const updateOrderStatusSchema = {
    description: 'Update the status of an order',
    tags: ['Orders'],
    params: updateOrderStatusParamsSchema,
    body: updateOrderStatusBodySchema,
    response: {
      200: updateOrderStatusResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  const updateOrderObservationsSchema = {
    description: 'Update the observations of an order',
    tags: ['Orders'],
    params: updateOrderObservationsParamsSchema,
    body: updateOrderObservationsBodySchema,
    response: {
      200: updateOrderObservationsResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/orders', { schema: listOrdersSchema, preHandler: [app.authenticate] }, listOrders)
    .patch(
      '/orders/:id/status',
      { schema: updateOrderStatusSchema, preHandler: [app.authenticate] },
      updateOrderStatus,
    )
    .patch(
      '/orders/:id/observations',
      { schema: updateOrderObservationsSchema, preHandler: [app.authenticate] },
      updateOrderObservations,
    );
}

async function listOrders(_request: FastifyRequest, reply: FastifyReply) {
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

  const byOrder = new Map<
    number,
    {
      id: number;
      status: 'pending' | 'paid' | 'delivered';
      total: number;
      observations: string | null;
      sessionId: string;
      createdAt: string;
      items: Array<{ id: number; productName: string; unitPrice: number; quantity: number }>;
    }
  >();

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

  return reply.status(200).send({ orders: [...byOrder.values()] });
}

async function updateOrderStatus(
  request: FastifyRequest<{ Params: UpdateOrderStatusParams; Body: UpdateOrderStatusBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { status } = request.body;

  const [updated] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(orders.id, id), isNull(orders.deletedAt)))
    .returning({ id: orders.id, status: orders.status });

  if (!updated) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ORDER_NOT_FOUND',
      error: 'Not Found',
      message: 'Order not found',
    });
  }

  return reply.status(200).send({ id: updated.id, status: updated.status });
}

async function updateOrderObservations(
  request: FastifyRequest<{
    Params: UpdateOrderObservationsParams;
    Body: UpdateOrderObservationsBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { observations } = request.body;

  const [updated] = await db
    .update(orders)
    .set({ observations, updatedAt: new Date() })
    .where(and(eq(orders.id, id), isNull(orders.deletedAt)))
    .returning({ id: orders.id, observations: orders.observations });

  if (!updated) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'ORDER_NOT_FOUND',
      error: 'Not Found',
      message: 'Order not found',
    });
  }

  return reply.status(200).send({ id: updated.id, observations: updated.observations });
}
