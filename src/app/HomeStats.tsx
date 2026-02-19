"use client";

import { useEffect, useState } from "react";

type Stats = { total: number; available: number; borrowed: number };

export function HomeStats({ className = "" }: { className?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ total: 0, available: 0, borrowed: 0 }));
  }, []);

  if (stats === null) return <div className={className}>Loading stats…</div>;

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collection</h2>
      <div className="mt-3 flex gap-8">
        <div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-600">Total books</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
          <p className="text-sm text-slate-600">Available</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-600">{stats.borrowed}</p>
          <p className="text-sm text-slate-600">Borrowed</p>
        </div>
      </div>
    </div>
  );
}
