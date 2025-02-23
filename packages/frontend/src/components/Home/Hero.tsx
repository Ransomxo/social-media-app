import Image from 'next/image';
import Link from 'next/link';
import DashboardPreview from './DashboardPreview';

export default function Hero() {
  return (
    <section className="section-spacing min-h-[90vh] flex items-center">
      <div className="section-gradient"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
              Track, Analyze, and Grow Your Social Media with Ease
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Get real-time insights into your social media performance, track engagement metrics, and optimize your content strategy with our comprehensive analytics dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center justify-center"
              >
                Get started free
              </Link>
            </div>
          </div>
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <div className="absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 to-purple-400 opacity-10 blur-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 to-purple-400 opacity-10"></div>
              </div>
            </div>
            <div className="relative">
              <DashboardPreview />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
