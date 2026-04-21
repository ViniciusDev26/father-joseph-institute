import { and, eq, isNull, sql } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../database/connection';
import { cartItems, carts, institutions, productPhotos, products } from '../database/schema';
import { getPublicUrl } from '../lib/storage';
import {
  addToCartBodySchema,
  addToCartResponseSchema,
  checkoutBodySchema,
  checkoutResponseSchema,
  getCartParamsSchema,
  getCartResponseSchema,
} from '../schemas/cart';
import { errorResponseSchema } from '../schemas/shared';
import type { AddToCartBody, CheckoutBody, GetCartParams } from '../types/cart';

export async function cartRoutes(app: FastifyInstance) {
  const getCartSchema = {
    description: 'Return the open cart and its items for a given session',
    tags: ['Cart'],
    params: getCartParamsSchema,
    response: {
      200: getCartResponseSchema,
      404: errorResponseSchema,
    },
  };

  const addToCartSchema = {
    description: 'Add a product to the cart, creating a new cart if needed',
    tags: ['Cart'],
    body: addToCartBodySchema,
    response: {
      200: addToCartResponseSchema,
      400: errorResponseSchema,
      422: errorResponseSchema,
    },
  };

  const checkoutSchema = {
    description: 'Checkout the cart and get a pre-filled WhatsApp URL',
    tags: ['Cart'],
    body: checkoutBodySchema,
    response: {
      200: checkoutResponseSchema,
      400: errorResponseSchema,
      404: errorResponseSchema,
      422: errorResponseSchema,
    },
  };

  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/cart/:sessionId', { schema: getCartSchema }, getCart)
    .post('/cart/items', { schema: addToCartSchema }, addToCart)
    .post('/cart/checkout', { schema: checkoutSchema }, checkout);
}

async function getCart(
  request: FastifyRequest<{ Params: GetCartParams }>,
  reply: FastifyReply,
) {
  const { sessionId } = request.params;

  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.sessionId, sessionId), eq(carts.status, 'open')))
    .limit(1);

  if (!cart) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'CART_NOT_FOUND',
      error: 'Not Found',
      message: 'No open cart found for this session',
    });
  }

  const rows = await db
    .select({
      itemId: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      productName: products.name,
      productPrice: products.price,
      photoObjectKey: productPhotos.objectKey,
    })
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .leftJoin(
      productPhotos,
      and(eq(productPhotos.productId, products.id), isNull(productPhotos.deletedAt)),
    )
    .where(eq(cartItems.cartId, cart.id));

  const seenItems = new Map<
    number,
    { id: number; quantity: number; product: { id: number; name: string; price: number; photoUrl: string | null } }
  >();

  for (const row of rows) {
    if (!seenItems.has(row.itemId)) {
      seenItems.set(row.itemId, {
        id: row.itemId,
        quantity: row.quantity,
        product: {
          id: row.productId,
          name: row.productName,
          price: parseFloat(row.productPrice),
          photoUrl: row.photoObjectKey ? getPublicUrl(row.photoObjectKey) : null,
        },
      });
    }
  }

  return reply.status(200).send({ cartId: cart.id, sessionId, items: [...seenItems.values()] });
}

async function addToCart(
  request: FastifyRequest<{ Body: AddToCartBody }>,
  reply: FastifyReply,
) {
  const { sessionId, productId, quantity } = request.body;

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product) {
    return reply.status(422).send({
      statusCode: 422,
      code: 'PRODUCT_NOT_FOUND',
      error: 'Unprocessable Entity',
      message: 'Product not found',
    });
  }

  let [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.sessionId, sessionId), eq(carts.status, 'open')))
    .limit(1);

  if (!cart) {
    [cart] = await db.insert(carts).values({ sessionId }).returning();
  }

  await db
    .insert(cartItems)
    .values({ cartId: cart.id, productId, quantity })
    .onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.productId],
      set: {
        quantity: sql`${cartItems.quantity} + excluded.quantity`,
        updatedAt: new Date(),
      },
    });

  const items = await db
    .select({ id: cartItems.id, productId: cartItems.productId, quantity: cartItems.quantity })
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id));

  return reply.status(200).send({ cartId: cart.id, sessionId, items });
}

async function checkout(
  request: FastifyRequest<{ Body: CheckoutBody }>,
  reply: FastifyReply,
) {
  const { sessionId } = request.body;

  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.sessionId, sessionId), eq(carts.status, 'open')))
    .limit(1);

  if (!cart) {
    return reply.status(404).send({
      statusCode: 404,
      code: 'CART_NOT_FOUND',
      error: 'Not Found',
      message: 'No open cart found for this session',
    });
  }

  const items = await db
    .select({
      quantity: cartItems.quantity,
      productName: products.name,
      productPrice: products.price,
    })
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .where(eq(cartItems.cartId, cart.id));

  if (items.length === 0) {
    return reply.status(422).send({
      statusCode: 422,
      code: 'CART_EMPTY',
      error: 'Unprocessable Entity',
      message: 'Cart has no items',
    });
  }

  const [institution] = await db
    .select({ whatsapp: institutions.whatsapp })
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);

  if (!institution?.whatsapp) {
    return reply.status(422).send({
      statusCode: 422,
      code: 'INSTITUTION_WHATSAPP_NOT_SET',
      error: 'Unprocessable Entity',
      message: 'Institution has no WhatsApp number registered',
    });
  }

  await db
    .update(carts)
    .set({ status: 'closed', closedAt: new Date(), updatedAt: new Date() })
    .where(eq(carts.id, cart.id));

  const total = items.reduce((sum, item) => sum + item.quantity * parseFloat(item.productPrice), 0);

  const itemLines = items
    .map((item) => {
      const price = parseFloat(item.productPrice).toFixed(2).replace('.', ',');
      return `- ${item.quantity}x ${item.productName} — R$ ${price} cada`;
    })
    .join('\n');

  const message = [
    'Olá! Gostaria de fazer um pedido:',
    '',
    itemLines,
    '',
    `Total: R$ ${total.toFixed(2).replace('.', ',')}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/55${institution.whatsapp}?text=${encodeURIComponent(message)}`;

  return reply.status(200).send({ whatsappUrl });
}
