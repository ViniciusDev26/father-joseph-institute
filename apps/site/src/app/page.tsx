import Link from 'next/link';
import { routes } from '@/lib/routes';

export default function HomePage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-bark md:text-7xl">
        Instituto Padre José
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-lg text-bark-light">
        [Frase de apresentação do instituto na página inicial]
      </p>
      <Link
        href={routes.about}
        className="mt-8 rounded-full bg-terracotta px-8 py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark"
      >
        Conheça nossa história
      </Link>
    </section>
  );
}
