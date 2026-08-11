import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";
import { getSite } from "@/features/website/storage";
import { addCustomerReview } from "@/features/reviews/storage";

interface ReviewPayload {
  slug?: string;
  author?: string;
  rating?: number;
  text?: string;
  /** Honeypot -- see /api/contact for the same pattern. */
  website?: string;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Handles real review submissions from a generated site's "write a review"
 * form. Every review starts unapproved (see addCustomerReview) -- nothing a
 * stranger submits here shows up on the live site until someone on the team
 * approves it from the site's Edit Content page.
 */
export async function POST(request: NextRequest) {
  let body: ReviewPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.website?.trim()) {
    return NextResponse.json({ success: true });
  }

  if (isRateLimited(`review:${getClientIp(request)}`)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const { slug, author, text } = body;
  const rating = Number(body.rating);

  if (!slug?.trim() || !author?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: "Name and review text are required." },
      { status: 400 }
    );
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const site = await getSite(slug);
  if (!site) {
    return NextResponse.json({ error: "Site not found." }, { status: 404 });
  }

  await addCustomerReview(slug, { author: author.trim(), rating, text: text.trim() });

  return NextResponse.json({ success: true });
}
