import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { fetchArtisans } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Artesãs',
};

export const revalidate = 60;

export default async function ArtisansPage() {
  const { artisans: c } = content;
  const artisans = await fetchArtisans();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-sage" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-terracotta" />
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
          {artisans.length === 0 ? (
            <FadeIn>
              <p className="text-center text-bark-light">{c.empty}</p>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {artisans.map((artisan, i) => (
                <FadeIn key={artisan.id} delay={i * 80}>
                  <article className="group overflow-hidden rounded-2xl border border-bark/[0.06] bg-cream-dark/50 transition-colors hover:border-terracotta/20">
                    <div className="relative aspect-square overflow-hidden bg-bark/[0.04]">
                      <Image
                        src={artisan.photoUrl}
                        alt={artisan.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="font-display text-xl font-semibold text-bark">
                        {artisan.name}
                      </h2>
                      {artisan.description && (
                        <p className="mt-2 text-sm leading-relaxed text-bark-light line-clamp-3">
                          {artisan.description}
                        </p>
                      )}
                      <div className="mt-4 flex flex-col gap-1">
                        {artisan.phone && (
                          <a
                            href={`https://wa.me/55${artisan.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-terracotta transition-colors hover:text-terracotta-dark"
                          >
                            WhatsApp: {artisan.phone}
                          </a>
                        )}
                        {artisan.email && (
                          <a
                            href={`mailto:${artisan.email}`}
                            className="text-sm text-terracotta transition-colors hover:text-terracotta-dark"
                          >
                            {artisan.email}
                          </a>
                        )}
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
