// src/features/reviews/types.ts
//
// A real customer review, submitted through the "write a review" form on a
// generated site -- distinct from the old AI-fabricated ReviewItem
// (features/generation/types.ts), which was placeholder marketing copy
// written to *look like* a testimonial, not a real one. Kept in its own
// file (rather than generation/types.ts) so a client component can import
// just the type without pulling in anything server-only.

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  submittedAt: string;
  /** Reviews start unapproved -- nothing a stranger types shows up on the
   * live site until someone on the team reviews and approves it. */
  approved: boolean;
}
