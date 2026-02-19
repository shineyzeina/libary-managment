import Link from "next/link";
import { HomeStats } from "./HomeStats";
import { HomeSuggest } from "./HomeSuggest";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Library Management
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Manage books, check-in, and check-out.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/books"
              className="inline-flex items-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 hover:shadow-slate-900/30"
            >
              Go to Books
            </Link>
          </div>
        </header>

        <section className="mt-14 space-y-8">
          <HomeStats />
          <HomeSuggest />
        </section>
      </div>
    </main>
  );
}
