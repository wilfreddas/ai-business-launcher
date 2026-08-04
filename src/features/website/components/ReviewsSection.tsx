"use client";

import { Star } from "lucide-react";
import { ReviewItem } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, cardClass } from "../theme";

interface Props {
  reviews: ReviewItem[];
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

export default function ReviewsSection({ reviews }: Props) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-[var(--w-secondary)]/40 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 style={headingStyle} className={sectionHeadingClass}>
            What Customers Say
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {reviews.map((review, idx) => (
            <div key={idx} className={`${cardClass} !bg-white transition-shadow hover:shadow-lg`}>
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
      </div>
    </section>
  );
}
