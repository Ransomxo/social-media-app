import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrendTide - Social Media Analytics',
  description: 'Track, analyze, and grow your social media presence with comprehensive analytics and insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth bg-[rgb(17,24,39)]">
      <body className={`${inter.className} antialiased h-full overflow-x-hidden`}>{children}</body>
    </html>
  );
}
