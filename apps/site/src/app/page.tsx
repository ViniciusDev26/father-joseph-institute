import Link from 'next/link';
import { FadeIn } from '@/components/fade-in';
import { routes } from '@/lib/routes';

export default function HomePage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <FadeIn>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-bark sm:text-5xl md:text-7xl">
          Instituto Padre José
        </h1>
      </FadeIn>
      <FadeIn delay={150}>
        <p className="mx-auto mt-6 max-w-lg text-lg text-bark-light">
          [Frase de apresentação do instituto na página inicial]
        </p>
      </FadeIn>
      <FadeIn delay={280}>
        <Link
          href={routes.about}
          className="mt-8 rounded-full bg-terracotta px-8 py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark"
        >
          Conheça nossa história
        </Link>
      </FadeIn>
    </section>
  );
}
