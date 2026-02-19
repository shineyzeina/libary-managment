import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { db, schema } from "@/lib/db";

const openai = process.env.OPENAI_API_KEY ? new OpenAI() : null;

export async function POST(req: NextRequest) {
  if (!openai) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }
  try {
    const books = await db.select().from(schema.books).limit(50);
    const catalog = books.map((b) => `${b.title} by ${b.author}`).join("\n");
    const body = await req.json().catch(() => ({}));
    const userPrompt = (body.prompt as string)?.trim() || "What should I read next?";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: catalog
            ? `You are a friendly librarian. Here is the library catalog:\n${catalog}\nSuggest a book from this catalog when possible. Keep the reply to 2-3 short sentences.`
            : "You are a friendly librarian. The catalog is empty. Suggest adding some books or mention a classic everyone should read. Keep the reply to 2-3 short sentences.",
        },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 150,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim() || "No suggestion.";
    return NextResponse.json({ suggestion });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI suggestion failed" }, { status: 500 });
  }
}
