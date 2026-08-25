import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Instrument_Serif, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { PageTransitionProvider } from '@/components/layout/PageTransition';
import './globals.css';

/*
 * Brand typography — three families locked by design:
 * serif display (Instrument Serif) + sans body (Space Grotesk) + mono telemetry (JetBrains Mono).
 * Intentional exception to the two-font-family guideline.
 */
const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
});

const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap'
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azeonics.com';
const description =
  'Integrated precision manufacturing, testing and innovation facility for drones, satellites and aerospace systems.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Azeonics | From Earth Intelligence to Space Excellence.',
    template: '%s | Azeonics'
  },
  description,
  keywords: [
    'Azeonics',
    'aerospace manufacturing',
    'satellite integration',
    'CubeSat',
    'precision machining',
    'manufacturing as a service',
    'ground station as a service',
    'space tech India',
    'Thane'
  ],
  applicationName: 'Azeonics',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Azeonics',
    title: 'Azeonics | Idea 2 Orbit Innovation Hub',
    description,
    url: '/',
    locale: 'en_IN'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azeonics |  From Earth Intelligence to Space Excellence.',
    description
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
