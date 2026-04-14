import type { Metadata } from 'next';
import { Albert_Sans, Fraunces } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const albertSans = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-albert-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Instituto Padre José',
    template: '%s | Instituto Padre José',
  },
  description: 'Ajudando moradores de rua e valorizando o trabalho de artesãs',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${albertSans.variable}`}>
      <body className="font-body">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
