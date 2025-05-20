import React, { useState } from "react";
import { User } from "@/lib/types";
import { createOrUpdateReview } from "@/lib/utils/localStorage";
import Button from "../ui/Button";
import StarRating from "./StarRating";
import Toggle from "../ui/Toggle";

interface ReviewFormProps {
  bookId: string;
  userId: string;
  initialRating?: number;
  initialText?: string;
  initialHasSpoilers?: boolean;
  onSubmitSuccess: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  bookId,
  userId,
  initialRating = 0,
  initialText = "",
  initialHasSpoilers = false,
  onSubmitSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);
  const [hasSpoilers, setHasSpoilers] = useState(initialHasSpoilers);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    // Reset error if validation passes
    setError("");

    // Create or update the review
    createOrUpdateReview({
      userId,
      bookId,
      rating,
      text,
      hasSpoilers,
    });

    // Call the success callback
    onSubmitSuccess();
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
        />
      </div>

      <div>
        <Toggle
          isEnabled={hasSpoilers}
          onChange={setHasSpoilers}
          label="Contains spoilers"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Submit Review</Button>
      </div>
    </form>
  );
}
