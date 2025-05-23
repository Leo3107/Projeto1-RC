import { NextRequest, NextResponse } from "next/server";
import { searchBooks, getBookById } from "@/lib/utils/openLibrary";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const genre = searchParams.get("genre") || undefined;
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;
  const id = searchParams.get("id");

  if (id) {
    // Fetch a single book by its ID
    try {
      const book = await getBookById(id);
      if (book) {
        return NextResponse.json(book);
      } else {
        return NextResponse.json(
          { message: "Book not found" },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error(`Error fetching book with id ${id}:`, error);
      return NextResponse.json(
        { message: "Error fetching book data" },
        { status: 500 }
      );
    }
  }

  if (query) {
    // Search for books based on query and filters
    try {
      const books = await searchBooks(query, { genre, year });
      return NextResponse.json(books);
    } catch (error) {
      console.error(`Error searching books with query "${query}":`, error);
      return NextResponse.json(
        { message: "Error searching books" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: "Missing query or id parameter" },
    { status: 400 }
  );
}
