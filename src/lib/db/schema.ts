import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn"),
  genre: text("genre"),
  year: integer("year"),
  status: text("status", { enum: ["available", "borrowed"] }).notNull().default("available"),
  borrowedBy: text("borrowed_by"),
  borrowedAt: timestamp("borrowed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
