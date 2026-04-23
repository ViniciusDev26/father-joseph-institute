import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { fetchProducts } from '@/lib/api';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Produtos',
};

export const revalidate = 60;

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

export default async function ProductsPage() {
  const { products: c } = content;
  const products = await fetchProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-terracotta" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-gold" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-36">
          <FadeIn>
            <span className="font-display text-base italic text-terracotta md:text-lg">
              {c.hero.tag}
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-bark md:text-7xl">
              {c.hero.title}
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-bark-light">
              {c.hero.subtitle}
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Link
              href={routes.shop}
              className="mt-8 inline-block rounded-full bg-terracotta px-8 py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark"
            >
              Ir para a Loja
            </Link>
          </FadeIn>
        </div>
        <svg
          className="absolute bottom-0 w-full text-cream"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
          role="img"
        >
          <path
            d="M0 40C240 70 480 10 720 40C960 70 1200 10 1440 40V80H0V40Z"
            fill="currentColor"
          />
        </svg>
      </section>

      {/* Grid */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          {products.length === 0 ? (
            <FadeIn>
              <p className="text-center text-bark-light">{c.empty}</p>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <FadeIn key={product.id} delay={i * 60}>
                  <article className="group flex flex-col overflow-hidden rounded-2xl border border-bark/[0.06] bg-cream-dark/50 transition-colors hover:border-terracotta/20">
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
                      <h2 className="font-display text-lg font-semibold text-bark">
                        {product.name}
                      </h2>
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
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-display text-lg font-semibold text-terracotta">
                          {formatPrice(product.price)}
                        </span>
                        <Link
                          href={routes.shop}
                          className="rounded-full bg-terracotta px-4 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
                        >
                          Comprar
                        </Link>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
