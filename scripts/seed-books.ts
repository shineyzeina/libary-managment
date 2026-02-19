import "dotenv/config";
import { db, schema } from "../src/lib/db";
import { and, eq } from "drizzle-orm";

const BOOKS = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction" },
  { title: "1984", author: "George Orwell", year: 1949, genre: "Fiction" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
  { title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Fiction" },
  { title: "The Alchemist", author: "Paulo Coelho", year: 1988, genre: "Fiction" },
  { title: "Dune", author: "Frank Herbert", year: 1965, genre: "Sci-Fi" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" },
  { title: "Project Hail Mary", author: "Andy Weir", year: 2021, genre: "Sci-Fi" },
  { title: "Sapiens", author: "Yuval Noah Harari", year: 2011, genre: "Non-Fiction" },
  { title: "Atomic Habits", author: "James Clear", year: 2018, genre: "Non-Fiction" },
  { title: "Educated", author: "Tara Westover", year: 2018, genre: "Memoir" },
  { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", year: 2005, genre: "Thriller" },
  { title: "Where the Crawdads Sing", author: "Delia Owens", year: 2018, genre: "Fiction" },
  { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", year: 1967, genre: "Fiction" },
  { title: "Beloved", author: "Toni Morrison", year: 1987, genre: "Fiction" },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  let added = 0;
  let skipped = 0;
  for (const b of BOOKS) {
    const existing = await db
      .select()
      .from(schema.books)
      .where(and(eq(schema.books.title, b.title), eq(schema.books.author, b.author)));
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    await db.insert(schema.books).values({
      id: crypto.randomUUID(),
      title: b.title,
      author: b.author,
      genre: b.genre,
      year: b.year,
    });
    added++;
    console.log("Added:", b.title);
  }
  console.log(`Done. Added ${added}, skipped ${skipped} (already exist).`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
