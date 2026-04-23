import type { Metadata } from 'next';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { fetchInstitution } from '@/lib/api';
import { PixCopy } from './pix-copy';

export const metadata: Metadata = {
  title: 'Caixinha Solidária',
};

export const revalidate = 3600;

export default async function DonationsPage() {
  const { donations: c } = content;
  const institution = await fetchInstitution();

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

      {/* PIX + Impact */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* PIX card */}
            <FadeIn>
              <div className="rounded-2xl border border-bark/[0.06] bg-cream-dark/50 p-8">
                <h2 className="font-display text-2xl font-semibold text-bark">{c.pix.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-bark-light">{c.pix.instruction}</p>

                {institution?.pixKey ? (
                  <PixCopy pixKey={institution.pixKey} content={c.pix} />
                ) : (
                  <p className="mt-6 rounded-xl bg-bark/[0.04] px-4 py-3 text-sm text-bark-light">
                    {c.notFound}
                  </p>
                )}
              </div>
            </FadeIn>

            {/* Impact list */}
            <FadeIn delay={150}>
              <div className="rounded-2xl bg-terracotta px-8 py-8 text-cream">
                <h2 className="font-display text-2xl font-semibold">{c.impact.title}</h2>
                <ul className="mt-6 space-y-3">
                  {c.impact.items.map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-cream/20 text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-cream/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
