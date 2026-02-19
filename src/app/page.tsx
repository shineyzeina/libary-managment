import Link from "next/link";
import { HomeStats } from "./HomeStats";
import { HomeSuggest } from "./HomeSuggest";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-slate-800">Library Management</h1>
      <p className="mt-2 text-slate-600">Manage books, check-in, and check-out.</p>
      <Link
        href="/books"
        className="mt-6 rounded bg-slate-800 px-5 py-2.5 font-medium text-white hover:bg-slate-700"
      >
        Go to Books
      </Link>
      <HomeStats className="mt-10" />
      <HomeSuggest className="mt-8" />
    </main>
  );
}
