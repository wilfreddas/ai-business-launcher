"use server";

import { revalidatePath } from "next/cache";
import { setReviewApproval, deleteCustomerReview } from "./storage";

export async function approveReviewAction(slug: string, reviewId: string): Promise<void> {
  await setReviewApproval(slug, reviewId, true);
  revalidatePath(`/site/${slug}`);
}

export async function rejectReviewAction(slug: string, reviewId: string): Promise<void> {
  await setReviewApproval(slug, reviewId, false);
  revalidatePath(`/site/${slug}`);
}

export async function deleteReviewAction(slug: string, reviewId: string): Promise<void> {
  await deleteCustomerReview(slug, reviewId);
  revalidatePath(`/site/${slug}`);
}
