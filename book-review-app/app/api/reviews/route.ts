import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjusted path

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookData, rating, comment } = body;
    const { id: bookId, title, authors, coverUrl, publishedYear } = bookData;

    if (!bookId || !title || !rating) {
      return NextResponse.json({ message: "Missing required fields (bookId, title, rating)" }, { status: 400 });
    }

    // Ensure the book exists in the database, or create it
    const book = await prisma.book.upsert({
      where: { id: bookId },
      update: {
        title,
        authors: authors ? authors.join(", ") : null, // Prisma schema expects String?
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

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating, 10),
        comment,
        userId: session.user.id,
        bookId: book.id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ message: "Error creating review" }, { status: 500 });
  }
}

// GET /api/reviews - Get reviews by bookId or userId
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");
  const userId = searchParams.get("userId");

  try {
    if (bookId) {
      const reviews = await prisma.review.findMany({
        where: { bookId },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reviews);
    }

    if (userId) {
      const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
          book: true, // Include book details when fetching by userId
          user: {
            select: { id: true, name: true, image: true },
          }, 
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reviews);
    }

    return NextResponse.json({ message: "Missing bookId or userId parameter" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Error fetching reviews" }, { status: 500 });
  }
}
