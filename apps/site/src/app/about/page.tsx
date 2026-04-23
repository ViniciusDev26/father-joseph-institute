import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Quem Somos',
};

export default function AboutPage() {
  const { about } = content;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-terracotta" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-sage" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-36">
          <FadeIn>
            <span className="font-display text-base italic text-terracotta md:text-lg">
              {about.hero.tag}
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-bark md:text-7xl">
              {about.hero.title}
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-bark-light">
              {about.hero.subtitle}
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

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <div className="mx-auto mb-8 h-px w-16 bg-terracotta/40" />
            <blockquote className="font-display text-2xl leading-snug text-bark md:text-3xl lg:text-4xl">
              &ldquo;{about.mission.quote}&rdquo;
            </blockquote>
            <div className="mx-auto mt-8 h-px w-16 bg-terracotta/40" />
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="bg-sage-light py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <FadeIn>
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-bark/[0.06]">
                <span className="text-sm text-bark-light">[Foto do instituto]</span>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div>
                <span className="font-display text-sm italic text-sage">{about.story.tag}</span>
                <h2 className="mt-2 font-display text-3xl font-semibold text-bark md:text-4xl">
                  {about.story.title}
                </h2>
                {about.story.paragraphs.map(paragraph => (
                  <p key={paragraph} className="mt-4 first:mt-6 leading-relaxed text-bark-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="text-center">
              <span className="font-display text-sm italic text-terracotta">
                {about.values.tag}
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-bark md:text-4xl">
                {about.values.title}
              </h2>
            </div>
          </FadeIn>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.items.map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="group rounded-2xl border border-bark/[0.06] bg-cream-dark/50 p-8 transition-colors hover:border-terracotta/20 hover:bg-cream-dark">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-terracotta/10 font-display text-sm font-semibold text-terracotta">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-bark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bark-light">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-terracotta py-20 text-cream md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="text-center">
              <span className="font-display text-sm italic text-cream/70">{about.impact.tag}</span>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
                {about.impact.title}
              </h2>
            </div>
          </FadeIn>

          <div className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {about.impact.stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 100}>
                <div className="text-center">
                  <div className="font-display text-4xl font-bold md:text-5xl">{stat.value}</div>
                  <div className="mt-2 text-sm text-cream/70">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <span className="font-display text-sm italic text-terracotta">{about.cta.tag}</span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-bark md:text-4xl">
              {about.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-bark-light">{about.cta.description}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={routes.volunteer}
                className="rounded-full bg-terracotta px-8 py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark"
              >
                Seja Voluntário
              </Link>
              <Link
                href={routes.donations}
                className="rounded-full border border-bark/20 px-8 py-3 font-medium text-bark transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Faça uma Doação
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
