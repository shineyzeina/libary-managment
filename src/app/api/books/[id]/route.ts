import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [book] = await db.select().from(schema.books).where(eq(schema.books.id, id));
    if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(book);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, author, isbn, genre, year } = body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = String(title).trim();
    if (author !== undefined) updates.author = String(author).trim();
    if (isbn !== undefined) updates.isbn = isbn ? String(isbn).trim() : null;
    if (genre !== undefined) updates.genre = genre ? String(genre).trim() : null;
    if (year !== undefined) updates.year = year ? Number(year) : null;
    await db.update(schema.books).set(updates as any).where(eq(schema.books.id, id));
    const [book] = await db.select().from(schema.books).where(eq(schema.books.id, id));
    return NextResponse.json(book);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(schema.books).where(eq(schema.books.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
