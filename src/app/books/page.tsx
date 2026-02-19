"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  genre: string | null;
  year: number | null;
  status: string;
  borrowedBy: string | null;
  borrowedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    const url = search ? `/api/books?q=${encodeURIComponent(search)}` : "/api/books";
    const res = await fetch(url);
    const data = await res.json();
    setBooks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            ← Library
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Books</h1>
          <button
            type="button"
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add book
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="search"
            placeholder="Search by title, author, genre, ISBN…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          <button
            type="button"
            disabled={aiLoading}
            onClick={async () => {
              setAiLoading(true);
              setAiSuggestion(null);
              try {
                const res = await fetch("/api/ai/suggest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
                const data = await res.json();
                setAiSuggestion(res.ok ? data.suggestion : data.error || "AI not configured.");
              } finally {
                setAiLoading(false);
              }
            }}
            className="shrink-0 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {aiLoading ? "…" : "Suggest a book"}
          </button>
        </div>
        {aiSuggestion && (
          <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <strong className="text-slate-600">Suggestion:</strong> {aiSuggestion}
          </div>
        )}

        {showForm && (
          <BookForm
            onClose={() => { setShowForm(false); setEditingId(null); }}
            onSaved={() => { fetchBooks(); setShowForm(false); setEditingId(null); }}
          />
        )}

        {editingId && (
          <BookForm
            bookId={editingId}
            onClose={() => setEditingId(null)}
            onSaved={() => { fetchBooks(); setEditingId(null); }}
          />
        )}

        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : books.length === 0 ? (
          <p className="rounded border border-slate-200 bg-white p-6 text-center text-slate-500">
            No books found. Add one or try a different search.
          </p>
        ) : (
          <ul className="space-y-2">
            {books.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-4 rounded border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{b.title}</p>
                  <p className="text-sm text-slate-600">{b.author}</p>
                  {(b.genre || b.year) && (
                    <p className="mt-1 text-xs text-slate-500">
                      {[b.genre, b.year].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <span
                    className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                      b.status === "borrowed" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingId(b.id); setShowForm(false); }}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="rounded border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function BookForm({
  bookId,
  onClose,
  onSaved,
}: {
  bookId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetch(`/api/books/${bookId}`)
        .then((r) => r.json())
        .then((b: Book) => {
          setTitle(b.title);
          setAuthor(b.author);
          setIsbn(b.isbn ?? "");
          setGenre(b.genre ?? "");
          setYear(b.year ? String(b.year) : "");
        });
    }
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title: title.trim(), author: author.trim(), isbn: isbn.trim() || undefined, genre: genre.trim() || undefined, year: year ? Number(year) : undefined };
      const url = bookId ? `/api/books/${bookId}` : "/api/books";
      const method = bookId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">{bookId ? "Edit book" : "Add book"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Author *</label>
            <input required value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">ISBN</label>
            <input value={isbn} onChange={(e) => setIsbn(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Genre</label>
            <input value={genre} onChange={(e) => setGenre(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Year</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-800" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50">
              {saving ? "Saving…" : bookId ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
