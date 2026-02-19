import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { or, ilike, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    const base = db.select().from(schema.books).orderBy(schema.books.createdAt);
    const rows = q
      ? await base.where(
          or(
            ilike(schema.books.title, `%${q}%`),
            ilike(schema.books.author, `%${q}%`),
            ilike(schema.books.genre, `%${q}%`),
            ilike(schema.books.isbn, `%${q}%`)
          )!
        )
      : await base;
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, isbn, genre, year } = body;
    if (!title || !author) {
      return NextResponse.json({ error: "title and author required" }, { status: 400 });
    }
    const id = crypto.randomUUID();
    await db.insert(schema.books).values({
      id,
      title: String(title).trim(),
      author: String(author).trim(),
      isbn: isbn ? String(isbn).trim() : null,
      genre: genre ? String(genre).trim() : null,
      year: year ? Number(year) : null,
    });
    const [book] = await db.select().from(schema.books).where(eq(schema.books.id, id));
    return NextResponse.json(book);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
