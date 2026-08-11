"use client";

import { useState, useTransition } from "react";
import { Check, Star, Trash2, X } from "lucide-react";
import type { CustomerReview } from "@/features/reviews/types";
import { approveReviewAction, rejectReviewAction, deleteReviewAction } from "@/features/reviews/actions";

interface Props {
  slug: string;
  initialReviews: CustomerReview[];
}

/**
 * Moderation panel for real, customer-submitted reviews -- replaces the old
 * "edit the AI's fake reviews" list. Nothing here is freely editable text
 * (that would defeat the point of these being real); the only actions are
 * approve/reject/delete, since it's someone else's words.
 */
export default function ReviewModeration({ slug, initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isPending, startTransition] = useTransition();

  function setApproval(reviewId: string, approved: boolean) {
    startTransition(async () => {
      if (approved) {
        await approveReviewAction(slug, reviewId);
      } else {
        await rejectReviewAction(slug, reviewId);
      }
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, approved } : r)));
    });
  }

  function remove(reviewId: string) {
    if (!confirm("Delete this review? This can't be undone.")) return;
    startTransition(async () => {
      await deleteReviewAction(slug, reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    });
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No reviews submitted yet. Once a customer submits one through the live site, it&apos;ll show
        up here for approval before it goes public.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{review.author}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    review.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {review.approved ? "Live" : "Pending"}
                </span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-700">{review.text}</p>
              <p className="mt-1 text-xs text-gray-400">
                Submitted {new Date(review.submittedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {review.approved ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setApproval(review.id, false)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-60"
                >
                  <X className="h-3.5 w-3.5" />
                  Unpublish
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setApproval(review.id, true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </button>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => remove(review.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
