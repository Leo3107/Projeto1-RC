import React, { useState } from "react";
// import { User } from "@/lib/types"; // No longer directly needed for User type here
// import { createOrUpdateReview } from "@/lib/utils/localStorage"; // Remove localStorage import
import Button from "../ui/Button";
import StarRating from "./StarRating";
import Toggle from "../ui/Toggle";
import { useSession } from "next-auth/react"; // Import useSession

interface ReviewFormProps {
  bookId: string;
  // userId: string; // userId will come from session
  initialRating?: number;
  initialText?: string;
  initialHasSpoilers?: boolean;
  reviewIdToEdit?: string; // To know if we are editing an existing review
  onSubmitSuccess: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  bookId,
  initialRating = 0,
  initialText = "",
  initialHasSpoilers = false,
  reviewIdToEdit,
  onSubmitSuccess,
  onCancel,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);
  const [hasSpoilers, setHasSpoilers] = useState(initialHasSpoilers);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session?.user?.id) {
      setError("You must be logged in to submit a review.");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsLoading(true);

    try {
      const method = reviewIdToEdit ? "PUT" : "POST";
      const url = reviewIdToEdit
        ? `/api/reviews/${reviewIdToEdit}`
        : "/api/reviews";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          userId: session.user.id,
          rating,
          text,
          hasSpoilers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      onSubmitSuccess();
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setError((err as Error).message || "An unknown error occurred."); // Type assertion for err.message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Rating
        </label>
        <StarRating
          rating={rating}
          interactive
          onChange={setRating}
          size="lg"
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <div>
        <label
          htmlFor="review-text"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Your Review (Optional)
        </label>
        <textarea
          id="review-text"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="Share your thoughts about this book..."
          disabled={isLoading}
        />
      </div>

      <div>
        <Toggle
          isEnabled={hasSpoilers}
          onChange={setHasSpoilers}
          label="Contains spoilers"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? reviewIdToEdit
              ? "Updating..."
              : "Submitting..."
            : reviewIdToEdit
            ? "Update Review"
            : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
