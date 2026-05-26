import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '@/db/connection';
import {
  cartItems,
  carts,
  institutions,
  orderItems,
  orders,
  productPhotos,
  products,
} from '@/db/schema';
import { getPublicUrl } from '@/lib/storage';
import type { Cart } from '@/types/content';

export async function loadCartWithItems(cartId: number, sessionId: string): Promise<Cart> {
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
    .where(eq(cartItems.cartId, cartId));

  const seen = new Map<number, Cart['items'][number]>();
  for (const row of rows) {
    if (!seen.has(row.itemId)) {
      seen.set(row.itemId, {
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

  return { cartId, sessionId, items: [...seen.values()] };
}

async function findOpenCart(sessionId: string) {
  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.sessionId, sessionId), eq(carts.status, 'open')))
    .limit(1);
  return cart ?? null;
}

export async function getCartBySession(sessionId: string): Promise<Cart | null> {
  const cart = await findOpenCart(sessionId);
  if (!cart) return null;
  return loadCartWithItems(cart.id, sessionId);
}

export type AddToCartInput = {
  sessionId: string;
  productId: number;
  quantity: number;
};

export type AddToCartResult =
  | { ok: true; cart: Cart }
  | { ok: false; code: 'PRODUCT_NOT_FOUND'; message: string };

export async function addToCart(input: AddToCartInput): Promise<AddToCartResult> {
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, input.productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product) {
    return { ok: false, code: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  }

  let cart = await findOpenCart(input.sessionId);
  if (!cart) {
    [cart] = await db.insert(carts).values({ sessionId: input.sessionId }).returning();
  }

  await db
    .insert(cartItems)
    .values({ cartId: cart.id, productId: input.productId, quantity: input.quantity })
    .onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.productId],
      set: {
        quantity: sql`${cartItems.quantity} + excluded.quantity`,
        updatedAt: new Date(),
      },
    });

  return { ok: true, cart: await loadCartWithItems(cart.id, input.sessionId) };
}

export type UpdateCartItemResult =
  | { ok: true; cart: Cart }
  | { ok: false; code: 'CART_NOT_FOUND' | 'CART_ITEM_NOT_FOUND'; message: string };

export async function updateCartItemQuantity(
  itemId: number,
  sessionId: string,
  quantity: number,
): Promise<UpdateCartItemResult> {
  const cart = await findOpenCart(sessionId);
  if (!cart) {
    return { ok: false, code: 'CART_NOT_FOUND', message: 'No open cart found for this session' };
  }

  const [item] = await db
    .select({ id: cartItems.id })
    .from(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
    .limit(1);

  if (!item) {
    return { ok: false, code: 'CART_ITEM_NOT_FOUND', message: 'Cart item not found' };
  }

  if (quantity === 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, itemId));
  }

  return { ok: true, cart: await loadCartWithItems(cart.id, sessionId) };
}

export type CheckoutResult =
  | { ok: true; orderId: number; whatsappUrl: string }
  | {
      ok: false;
      code: 'CART_NOT_FOUND' | 'CART_EMPTY' | 'INSTITUTION_WHATSAPP_NOT_SET';
      message: string;
    };

export async function checkout(sessionId: string): Promise<CheckoutResult> {
  const cart = await findOpenCart(sessionId);
  if (!cart) {
    return { ok: false, code: 'CART_NOT_FOUND', message: 'No open cart found for this session' };
  }

  const items = await db
    .select({
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      productName: products.name,
      productPrice: products.price,
    })
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .where(eq(cartItems.cartId, cart.id));

  if (items.length === 0) {
    return { ok: false, code: 'CART_EMPTY', message: 'Cart has no items' };
  }

  const [institution] = await db
    .select({ whatsapp: institutions.whatsapp })
    .from(institutions)
    .where(isNull(institutions.deletedAt))
    .limit(1);

  if (!institution?.whatsapp) {
    return {
      ok: false,
      code: 'INSTITUTION_WHATSAPP_NOT_SET',
      message: 'Institution has no WhatsApp number registered',
    };
  }

  const total = items.reduce((sum, i) => sum + i.quantity * parseFloat(i.productPrice), 0);

  const [order] = await db
    .insert(orders)
    .values({ cartId: cart.id, sessionId, status: 'pending', total: total.toFixed(2) })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.productPrice,
      quantity: item.quantity,
    })),
  );

  await db
    .update(carts)
    .set({ status: 'closed', closedAt: new Date(), updatedAt: new Date() })
    .where(eq(carts.id, cart.id));

  const itemLines = items
    .map(item => {
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

  return { ok: true, orderId: order.id, whatsappUrl };
}
