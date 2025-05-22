import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// DELETE /api/bookshelf/[bookId] - Remove a book from the user's shelf
export async function DELETE(
  request: NextRequest, // Not used, but required by Next.js convention
  { params }: { params: { bookId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const bookId = params.bookId;
  // The bookId from OpenLibrary can contain slashes, so we need to decode it.
  // However, Next.js path parameters are automatically decoded.
  // If the ID was part of a query param, we'd use decodeURIComponent.
  // For path params, it should be fine, but good to be mindful.
  // Let's assume bookId is the direct ID like "OL123W" or "/works/OL123W"
  // Prisma schema uses the full ID string including potentially "/works/"

  if (!bookId) {
    return NextResponse.json({ message: "Book ID is required" }, { status: 400 });
  }

  try {
    const deletedEntry = await prisma.userBookShelf.delete({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId, // Use the bookId directly as passed in params
        },
      },
    });

    if (!deletedEntry) {
      // This case might not be hit if Prisma throws an error for not found record to delete
      // P2025: An operation failed because it depends on one or more records that were required but not found.
      return NextResponse.json({ message: "Book not found on shelf" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Book removed from shelf successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // Check if the error is due to the record not being found
    if (error.code === 'P2025') { // Prisma error code for record not found
        return NextResponse.json({ message: "Book not found on shelf or already removed" }, { status: 404 });
    }
    console.error(`Error removing book ${bookId} from shelf:`, error);
    return NextResponse.json(
      { message: "Error removing book from shelf" },
      { status: 500 }
    );
  }
}
