import type { Metadata } from 'next';
import { FadeIn } from '@/components/fade-in';
import content from '@/content.json';
import { fetchInstitution } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Contato',
};

export default async function ContactPage() {
  const { contact: c } = content;
  const institution = await fetchInstitution();

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

      {/* Contact info */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          {!institution ? (
            <FadeIn>
              <p className="text-center text-bark-light">{c.notFound}</p>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {institution.whatsapp && (
                <FadeIn>
                  <a
                    href={`https://wa.me/55${institution.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-4 rounded-2xl border border-bark/[0.06] bg-cream-dark/50 p-8 transition-colors hover:border-terracotta/20 hover:bg-cream-dark"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-terracotta/10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-terracotta"
                        aria-hidden="true"
                      >
                        <path
                          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-bark">{c.whatsapp}</h2>
                      <p className="mt-1 text-sm text-bark-light">+55 {institution.whatsapp}</p>
                    </div>
                  </a>
                </FadeIn>
              )}

              {institution.instagram && (
                <FadeIn delay={100}>
                  <a
                    href={`https://instagram.com/${institution.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-4 rounded-2xl border border-bark/[0.06] bg-cream-dark/50 p-8 transition-colors hover:border-terracotta/20 hover:bg-cream-dark"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-terracotta/10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-terracotta"
                        aria-hidden="true"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-bark">
                        {c.instagram}
                      </h2>
                      <p className="mt-1 text-sm text-bark-light">{institution.instagram}</p>
                    </div>
                  </a>
                </FadeIn>
              )}

              {institution.addressStreet && (
                <FadeIn delay={200}>
                  <div className="flex flex-col gap-4 rounded-2xl border border-bark/[0.06] bg-cream-dark/50 p-8">
                    <div className="flex size-12 items-center justify-center rounded-full bg-terracotta/10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-terracotta"
                        aria-hidden="true"
                      >
                        <path
                          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-bark">
                        {c.address.title}
                      </h2>
                      <p className="mt-1 text-sm text-bark-light">{institution.addressStreet}</p>
                      {institution.addressComplement && (
                        <p className="text-sm text-bark-light">{institution.addressComplement}</p>
                      )}
                      {institution.addressNeighborhood && (
                        <p className="text-sm text-bark-light">{institution.addressNeighborhood}</p>
                      )}
                      {(institution.addressCity || institution.addressState) && (
                        <p className="text-sm text-bark-light">
                          {[institution.addressCity, institution.addressState]
                            .filter(Boolean)
                            .join(' — ')}
                        </p>
                      )}
                      {institution.addressZip && (
                        <p className="text-sm text-bark-light">
                          CEP {institution.addressZip.replace(/^(\d{5})(\d{3})$/, '$1-$2')}
                        </p>
                      )}
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
