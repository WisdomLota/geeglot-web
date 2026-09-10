import type { Metadata } from 'next';
import { Archivo, Newsreader } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-text',
  display: 'swap',
});

const SITE = 'https://geeglot.com';
const TAGLINE = 'I check the job boards. You decide.';
const DESCRIPTION =
  'GeegLot reads every new job and gig listing against what you are looking for, and only gets in touch when something is genuinely worth your time. It drafts the application. You send it.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `GeegLot — ${TAGLINE}`,
    template: '%s · GeegLot',
  },
  description: DESCRIPTION,
  applicationName: 'GeegLot',
  keywords: [
    'job alerts',
    'gig alerts',
    'remote jobs',
    'job search assistant',
    'job matching',
    'application drafts',
    'freelance work',
    'North Cyprus jobs',
  ],
  authors: [{ name: 'GeegLot' }],
  creator: 'GeegLot',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'GeegLot',
    title: `GeegLot — ${TAGLINE}`,
    description: DESCRIPTION,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: `GeegLot — ${TAGLINE}`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
    verification: { google: 'B83f5RSnYdEHYLmVwjwKCSifpciiTdX3ZDG_kC8Byng' },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
};

/**
 * Structured data tells search engines what this is rather than making them
 * infer it from prose. It's also what powers rich results.
 */
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'GeegLot',
      description: DESCRIPTION,
      publisher: { '@id': `${SITE}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'GeegLot',
      url: SITE,
      description: DESCRIPTION,
    },
    {
      '@type': 'SoftwareApplication',
      name: 'GeegLot',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE,
      description: DESCRIPTION,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}