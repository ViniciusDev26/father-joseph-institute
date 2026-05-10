'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

type Photo = { id: number; url: string };

type Props = {
  photos: Photo[];
  alt: string;
};

export function EventCarousel({ photos, alt }: Props) {
  const [index, setIndex] = useState(0);
  const total = photos.length;
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setIndex(wrapped);
    },
    [total],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  if (total === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-bark/[0.04] md:aspect-auto md:min-h-64">
        <span className="text-sm text-bark-light">[Sem foto]</span>
      </div>
    );
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`Fotos de ${alt}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="group relative aspect-video w-full overflow-hidden bg-bark/[0.04] md:aspect-auto md:min-h-64"
    >
      <div
        className="flex h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {photos.map((photo, i) => (
          <div key={photo.id} className="relative h-full w-full flex-shrink-0">
            <Image
              src={photo.url}
              alt={i === 0 ? alt : ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-cream/90 text-bark shadow-md backdrop-blur-sm transition hover:bg-cream md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-cream/90 text-bark shadow-md backdrop-blur-sm transition hover:bg-cream md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para foto ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-cream' : 'w-1.5 bg-cream/60 hover:bg-cream/80'
                }`}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-bark/60 px-2 py-0.5 text-xs font-medium text-cream">
            {index + 1} / {total}
          </div>
        </>
      )}
    </section>
  );
}
