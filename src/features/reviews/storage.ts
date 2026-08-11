// src/features/reviews/storage.ts
//
// Server-only persistence for real, customer-submitted reviews. Deliberately
// separate from website/storage.ts's SavedSite blob: a review can arrive at
// any time, independent of whether/when the site's content is next edited
// or regenerated, so it gets its own key rather than living nested inside
// WebsiteContent.

import "server-only";
import { randomUUID } from "crypto";
import { getRedis } from "@/lib/redis";
import type { CustomerReview } from "./types";

const memoryReviews = new Map<string, CustomerReview[]>();

function reviewsKey(slug: string): string {
  return `reviews:${slug}`;
}

async function readAll(slug: string): Promise<CustomerReview[]> {
  const redis = getRedis();
  if (redis) {
    return (await redis.get<CustomerReview[]>(reviewsKey(slug))) || [];
  }
  return memoryReviews.get(slug) || [];
}

async function writeAll(slug: string, reviews: CustomerReview[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(reviewsKey(slug), reviews);
  } else {
    memoryReviews.set(slug, reviews);
  }
}

/** Records a new review submission. Always starts unapproved. */
export async function addCustomerReview(
  slug: string,
  input: { author: string; rating: number; text: string }
): Promise<CustomerReview> {
  const review: CustomerReview = {
    id: randomUUID(),
    author: input.author,
    rating: input.rating,
    text: input.text,
    submittedAt: new Date().toISOString(),
    approved: false,
  };

  const existing = await readAll(slug);
  await writeAll(slug, [...existing, review]);
  return review;
}

/** Every review for a site, approved or not -- used by the moderation panel. */
export async function listAllCustomerReviews(slug: string): Promise<CustomerReview[]> {
  return readAll(slug);
}

/** Only approved reviews -- used by the live site. */
export async function listApprovedReviews(slug: string): Promise<CustomerReview[]> {
  const all = await readAll(slug);
  return all.filter((r) => r.approved);
}

export async function setReviewApproval(
  slug: string,
  reviewId: string,
  approved: boolean
): Promise<void> {
  const all = await readAll(slug);
  await writeAll(
    slug,
    all.map((r) => (r.id === reviewId ? { ...r, approved } : r))
  );
}

export async function deleteCustomerReview(slug: string, reviewId: string): Promise<void> {
  const all = await readAll(slug);
  await writeAll(
    slug,
    all.filter((r) => r.id !== reviewId)
  );
}
