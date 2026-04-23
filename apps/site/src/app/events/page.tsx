import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { fetchEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Eventos',
};

export const revalidate = 60;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function EventsPage() {
  const { events: c } = content;
  const events = await fetchEvents();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-gold" />
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

      {/* List */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          {events.length === 0 ? (
            <FadeIn>
              <p className="text-center text-bark-light">{c.empty}</p>
            </FadeIn>
          ) : (
            <div className="space-y-12">
              {events.map((event, i) => (
                <FadeIn key={event.id} delay={i * 80}>
                  <article className="grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-bark/[0.06] bg-cream-dark/40 md:grid-cols-2">
                    {/* Photo */}
                    <div className="relative aspect-video overflow-hidden bg-bark/[0.04] md:aspect-auto md:min-h-64">
                      {event.photos[0] ? (
                        <Image
                          src={event.photos[0].url}
                          alt={event.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm text-bark-light">[Sem foto]</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center p-8">
                      <time
                        dateTime={event.date}
                        className="font-display text-sm italic text-terracotta"
                      >
                        {formatDate(event.date)}
                      </time>
                      <h2 className="mt-2 font-display text-2xl font-semibold text-bark md:text-3xl">
                        {event.name}
                      </h2>
                      {event.description && (
                        <p className="mt-4 leading-relaxed text-bark-light">{event.description}</p>
                      )}

                      {/* Photo gallery thumbnails */}
                      {event.photos.length > 1 && (
                        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                          {event.photos.slice(1).map(photo => (
                            <div
                              key={photo.id}
                              className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg bg-bark/[0.04]"
                            >
                              <Image
                                src={photo.url}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                          ))}
                        </div>
                      )}
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
