"use client";

import { useState } from "react";

export function HomeSuggest({ className = "" }: { className?: string }) {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() || undefined }),
      });
      const data = await res.json();
      if (res.ok) setSuggestion(data.suggestion);
      else setSuggestion(data.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">AI suggestion</h2>
      <p className="mt-1 text-slate-600">Get a book recommendation from the catalog.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="e.g. Something light for the weekend"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "…" : "Suggest"}
        </button>
      </form>
      {suggestion && (
        <blockquote className="mt-4 border-l-4 border-slate-300 pl-4 italic text-slate-700">
          {suggestion}
        </blockquote>
      )}
    </div>
  );
}
