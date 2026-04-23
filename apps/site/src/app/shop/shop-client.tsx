'use client';

import Image from 'next/image';
import { useOptimistic, useState, useTransition } from 'react';
import type { Cart, CartItem, Product } from '@/types/content';
import { addToCart, checkout } from './actions';

interface ShopClientProps {
  products: Product[];
  initialCart: Cart | null;
  content: {
    addToCart: string;
    cart: { title: string; empty: string; checkout: string; total: string; remove: string };
    empty: string;
    by: string;
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
}

export function ShopClient({ products, initialCart, content: c }: ShopClientProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [cart, setCart] = useOptimistic<Cart | null>(initialCart);
  function handleAddToCart(product: Product) {
    startTransition(async () => {
      setCart(prev => {
        if (!prev) {
          return {
            cartId: 0,
            sessionId: '',
            items: [
              {
                id: 0,
                quantity: 1,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  photoUrl: product.photos[0]?.url ?? null,
                },
              },
            ],
          };
        }
        const existing = prev.items.find(i => i.product.id === product.id);
        if (existing) {
          return {
            ...prev,
            items: prev.items.map(i =>
              i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          };
        }
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              id: 0,
              quantity: 1,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                photoUrl: product.photos[0]?.url ?? null,
              },
            },
          ],
        };
      });
      await addToCart(product.id, 1);
      setCartOpen(true);
    });
  }

  function handleCheckout() {
    startTransition(async () => {
      const url = await checkout();
      if (url) {
        setCart(null);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <div className="relative">
      {/* Floating cart button */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 font-medium text-cream shadow-lg transition-colors hover:bg-terracotta-dark md:bottom-8 md:right-8"
        aria-label={`${c.cart.title} (${itemCount} itens)`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
          <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{c.cart.title}</span>
        {itemCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-cream text-xs font-bold text-terracotta">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart drawer */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-bark/30 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl">
            <div className="flex items-center justify-between border-b border-bark/10 px-6 py-5">
              <h2 className="font-display text-xl font-semibold text-bark">{c.cart.title}</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg text-bark-light transition-colors hover:bg-bark/5"
                aria-label="Fechar carrinho"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!cart || cart.items.length === 0 ? (
                <p className="mt-8 text-center text-bark-light">{c.cart.empty}</p>
              ) : (
                <ul className="space-y-4">
                  {cart.items.map(item => (
                    <li key={item.product.id} className="flex gap-4">
                      <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-xl bg-bark/[0.04]">
                        {item.product.photoUrl && (
                          <Image
                            src={item.product.photoUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <p className="font-medium text-bark">{item.product.name}</p>
                        <p className="text-sm text-bark-light">
                          {item.quantity}× {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="self-center font-semibold text-bark">
                        {formatPrice(item.quantity * item.product.price)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div className="border-t border-bark/10 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium text-bark">{c.cart.total}</span>
                  <span className="font-display text-xl font-semibold text-bark">
                    {formatPrice(cartTotal(cart.items))}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full rounded-full bg-terracotta py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-60"
                >
                  {c.cart.checkout}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {/* Products grid */}
      {products.length === 0 ? (
        <p className="text-center text-bark-light">{c.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(product => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-bark/[0.06] bg-cream-dark/50 transition-colors hover:border-terracotta/20"
            >
              <div className="relative aspect-square overflow-hidden bg-bark/[0.04]">
                {product.photos[0] ? (
                  <Image
                    src={product.photos[0].url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs text-bark-light">[Sem foto]</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-lg font-semibold text-bark">{product.name}</h2>
                {product.artisans.length > 0 && (
                  <p className="mt-1 text-xs text-bark-light">
                    {c.by} {product.artisans.map(a => a.name).join(', ')}
                  </p>
                )}
                {product.description && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-bark-light line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-semibold text-terracotta">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={isPending}
                    className="rounded-full bg-terracotta px-4 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-60"
                  >
                    {c.addToCart}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
