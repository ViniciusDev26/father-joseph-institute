import type { Metadata } from 'next';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { VolunteerForm } from './volunteer-form';

export const metadata: Metadata = {
  title: 'Seja Voluntário',
};

export default function VolunteerPage() {
  const { volunteer: c } = content;

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

      {/* Form */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <FadeIn>
            <VolunteerForm
              content={{ form: c.form, days: c.days, success: c.success, error: c.error }}
            />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
