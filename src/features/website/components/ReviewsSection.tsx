"use client";

import { Star } from "lucide-react";
import type { CustomerReview } from "@/features/reviews/types";
import { headingStyle, cardClass } from "../theme";
import SectionHeading from "./SectionHeading";
import ReviewSubmissionForm from "./ReviewSubmissionForm";

interface Props {
  /** Real, approved customer reviews -- see features/reviews. Never
   * AI-fabricated content (that was the old behavior; see git history if
   * you're wondering why this used to always have 4 reviews on day one). */
  reviews: CustomerReview[];
  /** Slug to submit new reviews against. Omit (or pass allowSubmissions=false)
   * in contexts with no live server behind them, e.g. the static HTML export. */
  slug?: string;
  allowSubmissions?: boolean;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

export default function ReviewsSection({ reviews, slug, allowSubmissions = true }: Props) {
  const canSubmit = allowSubmissions && Boolean(slug);

  // Nothing real to show and nowhere to submit one -- genuinely nothing to
  // render (this is the static-export case).
  if (reviews.length === 0 && !canSubmit) return null;

  return (
    <section id="reviews" className="bg-[var(--w-secondary)]/40 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading heading="What Customers Say" />

        {reviews.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className={`${cardClass} !bg-white transition-shadow hover:shadow-lg`}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--w-text)]/80">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: "var(--w-primary)" }}
                    aria-hidden
                  >
                    {initials(review.author)}
                  </div>
                  <p style={headingStyle} className="text-sm font-semibold">
                    {review.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {canSubmit && (
          <div className={reviews.length > 0 ? "mt-12 border-t border-[var(--w-text)]/10 pt-10" : ""}>
            <p className="mb-5 text-center text-sm font-semibold text-[var(--w-text)]">
              Leave a review
            </p>
            <ReviewSubmissionForm slug={slug!} />
          </div>
        )}
      </div>
    </section>
  );
}
