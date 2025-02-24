'use client';

import Hero from '@/components/Home/Hero';
import Features from '@/components/Home/Features';
import Tools from '@/components/Home/Tools';
import Testimonials from '@/components/Home/Testimonials';
import Pricing from '@/components/Home/Pricing';
import Footer from '@/components/Home/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Tools />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
