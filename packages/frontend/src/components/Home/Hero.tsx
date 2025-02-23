import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <h1 className="text-4xl font-medium tracking-tight text-white sm:text-7xl">
              Track, Analyze, and Grow Your Social Media with Ease
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Get real-time insights into your social media performance, track engagement metrics, and optimize your content strategy with our comprehensive analytics dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
              <Link
                href="/signup"
                className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
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
              <Image
                src="/dashboard-preview.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-full rounded-xl shadow-2xl"
                priority
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
