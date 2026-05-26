import Link from 'next/link';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { routes } from '@/lib/routes';

export default function HomePage() {
  const { home } = content;

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <FadeIn>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-bark sm:text-5xl md:text-7xl">
          Instituto Padre José
        </h1>
      </FadeIn>
      <FadeIn delay={150} className="mt-6">
        <p className="mx-auto max-w-lg text-lg text-bark-light">{home.subtitle}</p>
      </FadeIn>
      <FadeIn delay={280} className="mt-8">
        <Link
          href={routes.about}
          className="rounded-full bg-terracotta px-8 py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark"
        >
          {home.cta}
        </Link>
      </FadeIn>
    </section>
  );
}
