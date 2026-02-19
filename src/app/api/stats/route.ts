import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const [total] = await db.select({ count: count() }).from(schema.books);
    const [borrowed] = await db
      .select({ count: count() })
      .from(schema.books)
      .where(eq(schema.books.status, "borrowed"));
    const totalN = total?.count ?? 0;
    const borrowedN = borrowed?.count ?? 0;
    return NextResponse.json({
      total: totalN,
      borrowed: borrowedN,
      available: totalN - borrowedN,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
