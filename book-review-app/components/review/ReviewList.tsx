import React, { useState } from "react";
import Image from "next/image";
import { User, Review } from "@/lib/types";
import { getUsers, deleteReview } from "@/lib/utils/localStorage";
import { useUserStore } from "@/lib/store/userStore";
import Card from "../ui/Card";
import StarRating from "./StarRating";
import Button from "../ui/Button";
import ReviewForm from "./ReviewForm";

interface ReviewItemProps {
  review: Review;
  user: User;
  onDelete: () => void;
  onEdit: () => void;
  canModify: boolean;
}

function ReviewItem({
  review,
  user,
  onDelete,
  onEdit,
  canModify,
}: ReviewItemProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);

  // Format date
  const formattedDate = new Date(review.timestamp).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Card className="p-4">
      <div className="flex items-start">
        {" "}
        <Image
          src={user.avatar || "/images/default-avatar.svg"}
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formattedDate}
                </span>
              </div>
            </div>
            {canModify && (
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          {review.text && (
            <div className="mt-3">
              {review.hasSpoilers && !showSpoiler ? (
                <div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md mb-2 text-sm">
                    This review contains spoilers
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowSpoiler(true)}
                  >
                    Show Anyway
                  </Button>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {review.text}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface ReviewListProps {
  bookId: string;
  reviews: Review[];
  onReviewChange: () => void;
  currentUserId?: string; // Added currentUserId as an optional prop
}

export default function ReviewList({
  bookId,
  reviews,
  onReviewChange,
  currentUserId, // Use currentUserId
}: ReviewListProps) {
  const { activeUser } = useUserStore(); // This might be redundant if currentUserId is reliable
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Get active user's review using currentUserId if available, otherwise fallback to activeUser from store
  const activeUserReview = reviews.find(
    (r) => r.userId === (currentUserId || activeUser?.id)
  );

  // Get all other reviews
  const otherReviews = reviews.filter(
    (r) => r.userId !== (currentUserId || activeUser?.id)
  );

  // Find user for a review
  const getUserForReview = (userId: string): User | undefined => {
    const users = getUsers();
    return users.find((u) => u.id === userId);
  };

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId);
    onReviewChange();
  };

  const handleEditReview = (reviewId: string) => {
    setEditingReviewId(reviewId);
  };

  const handleEditSuccess = () => {
    setEditingReviewId(null);
    onReviewChange();
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  if (reviews.length === 0 && !currentUserId) {
    // Check against currentUserId
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">
          No reviews yet. Sign in to be the first to review this book.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active user's review or review form */}
      {currentUserId &&
        activeUserReview &&
        editingReviewId !== activeUserReview.id && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Your Review
            </h3>
            <ReviewItem
              review={activeUserReview}
              // TODO: Need a way to get the full User object for the current user if not just activeUser from store
              // For now, assuming activeUser from store is sufficient if currentUserId matches activeUser.id
              user={
                activeUser && activeUser.id === currentUserId
                  ? activeUser
                  : ({
                      id: currentUserId,
                      name: "You",
                      avatar: "",
                    } as User) /* Placeholder */
              }
              onDelete={() => handleDeleteReview(activeUserReview.id)}
              onEdit={() => handleEditReview(activeUserReview.id)}
              canModify={true}
            />
          </div>
        )}

      {/* Form for editing existing review or adding a new one if no review exists for current user */}
      {currentUserId && (editingReviewId || !activeUserReview) && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            {editingReviewId ? "Edit Your Review" : "Add Your Review"}
          </h3>
          <ReviewForm
            bookId={bookId}
            userId={currentUserId}
            initialRating={
              editingReviewId && activeUserReview ? activeUserReview.rating : 0
            }
            initialText={
              editingReviewId && activeUserReview ? activeUserReview.text : ""
            }
            initialHasSpoilers={
              editingReviewId && activeUserReview
                ? activeUserReview.hasSpoilers
                : false
            }
            onSubmitSuccess={handleEditSuccess}
            onCancel={editingReviewId ? handleCancelEdit : undefined}
          />
        </div>
      )}

      {/* Other users' reviews */}
      {otherReviews.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Other Reviews
          </h3>
          <div className="space-y-4">
            {otherReviews.map((review) => {
              const reviewUser = getUserForReview(review.userId);
              return reviewUser ? (
                <ReviewItem
                  key={review.id}
                  review={review}
                  user={reviewUser}
                  onDelete={() => handleDeleteReview(review.id)}
                  onEdit={() => handleEditReview(review.id)}
                  canModify={review.userId === currentUserId}
                />
              ) : null;
            })}
          </div>
        </div>
      )}

      {reviews.length === 0 &&
        currentUserId &&
        !activeUserReview &&
        !editingReviewId && (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to review this book!
            </p>
          </div>
        )}
    </div>
  );
}
