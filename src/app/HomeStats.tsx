"use client";

import { useEffect, useState, useCallback } from "react";

type Stats = { total: number; available: number; borrowed: number };

export function HomeStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchStats = useCallback(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ total: 0, available: 0, borrowed: 0 }));
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed");
      if (res.ok) fetchStats();
    } finally {
      setSeeding(false);
    }
  };

  if (stats === null) {
    return (
      <div className="rounded-2xl border border-amber-200/60 bg-white/90 p-8 shadow-sm backdrop-blur">
        <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
      </div>
    );
  }

  const isEmpty = stats.total === 0;

  return (
    <div className="rounded-2xl border border-amber-200/60 bg-white/90 p-8 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-800/80">
          Collection
        </h2>
        {isEmpty && (
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
          >
            {seeding ? "Loading…" : "Load sample books"}
          </button>
        )}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="rounded-xl bg-slate-50/80 p-4">
          <p className="text-3xl font-bold tabular-nums text-slate-900">{stats.total}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Total books</p>
        </div>
        <div className="rounded-xl bg-emerald-50/80 p-4">
          <p className="text-3xl font-bold tabular-nums text-emerald-700">{stats.available}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Available</p>
        </div>
        <div className="rounded-xl bg-amber-50/80 p-4">
          <p className="text-3xl font-bold tabular-nums text-amber-700">{stats.borrowed}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Borrowed</p>
        </div>
      </div>
      {isEmpty && !seeding && (
        <p className="mt-4 text-sm text-slate-500">
          No books yet. Click “Load sample books” above or add some from the Books page.
        </p>
      )}
    </div>
  );
}
