import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookStatus } from "@prisma/client";

// POST /api/bookshelf - Add a book to shelf or update its status
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookData, status } = body;
    const { id: bookId, title, authors, coverUrl, publishedYear } = bookData;

    if (!bookId || !title || !status) {
      return NextResponse.json(
        { message: "Missing required fields (bookId, title, status)" },
        { status: 400 }
      );
    }

    if (!Object.values(BookStatus).includes(status as BookStatus)) {
      return NextResponse.json({ message: "Invalid book status" }, { status: 400 });
    }

    // Ensure the book exists in the database, or create it
    const book = await prisma.book.upsert({
      where: { id: bookId },
      update: {
        title,
        authors: authors ? authors.join(", ") : null,
        coverUrl,
        publishedYear,
      },
      create: {
        id: bookId,
        title,
        authors: authors ? authors.join(", ") : null,
        coverUrl,
        publishedYear,
      },
    });

    // Add or update the book on the user's shelf
    const userBookShelfEntry = await prisma.userBookShelf.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: book.id,
        },
      },
      create: {
        userId: session.user.id,
        bookId: book.id,
        status: status as BookStatus,
      },
      update: {
        status: status as BookStatus,
      },
      include: {
        book: true, // Include book details in the response
      },
    });

    return NextResponse.json(userBookShelfEntry, { status: 200 }); // 200 for upsert
  } catch (error) {
    console.error("Error adding/updating book on shelf:", error);
    return NextResponse.json(
      { message: "Error adding/updating book on shelf" },
      { status: 500 }
    );
  }
}

// GET /api/bookshelf - Get all books on the user's shelf
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status") as BookStatus | null;

  try {
    const bookshelfEntries = await prisma.userBookShelf.findMany({
      where: {
        userId: session.user.id,
        ...(statusFilter && { status: statusFilter }),
      },
      include: {
        book: true, // Include full book details
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(bookshelfEntries);
  } catch (error) {
    console.error("Error fetching bookshelf:", error);
    return NextResponse.json(
      { message: "Error fetching bookshelf" },
      { status: 500 }
    );
  }
}
