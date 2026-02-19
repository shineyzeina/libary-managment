"use client";

import { useState } from "react";

export function HomeSuggest() {
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
    <div className="rounded-2xl border border-amber-200/60 bg-white/90 p-8 shadow-sm backdrop-blur">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-800/80">
        AI suggestion
      </h2>
      <p className="mt-2 text-slate-600">
        Get a book recommendation from the catalog.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="e.g. Something light for the weekend"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "…" : "Suggest"}
        </button>
      </form>
      {suggestion && (
        <blockquote className="mt-5 border-l-4 border-amber-300 bg-amber-50/50 py-2 pl-4 pr-2 text-slate-700">
          {suggestion}
        </blockquote>
      )}
      {suggestion && suggestion.includes("not configured") && (
        <p className="mt-2 text-xs text-slate-500">
          Set OPENAI_API_KEY in your environment to enable AI suggestions.
        </p>
      )}
    </div>
  );
}
