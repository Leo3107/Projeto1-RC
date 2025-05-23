import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjusted path

// PUT /api/reviews/[id] - Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const reviewId = params.id;
  if (!reviewId) {
    return NextResponse.json(
      { message: "Review ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { rating, comment } = body;

    if (rating === undefined && comment === undefined) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    const reviewToUpdate = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!reviewToUpdate) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    if (reviewToUpdate.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden - You can only update your own reviews" },
        { status: 403 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating !== undefined && { rating: parseInt(rating, 10) }),
        ...(comment !== undefined && { comment }),
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error);
    return NextResponse.json(
      { message: "Error updating review" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest, // request is not used but required by Next.js convention
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const reviewId = params.id;
  if (!reviewId) {
    return NextResponse.json(
      { message: "Review ID is required" },
      { status: 400 }
    );
  }

  try {
    const reviewToDelete = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!reviewToDelete) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    if (reviewToDelete.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden - You can only delete your own reviews" },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    return NextResponse.json(
      { message: "Error deleting review" },
      { status: 500 }
    );
  }
}
