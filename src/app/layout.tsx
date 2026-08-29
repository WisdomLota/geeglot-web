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

export const metadata: Metadata = {
  title: 'GeegLot',
  description: 'Job and gig assessments, prepared for you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}