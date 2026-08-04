"use server";

// This file is the boundary between client code and the AI generation
// pipeline. Without it, importing generateWebsite directly into a "use
// client" component (like WebsitePreviewWrapper) causes Next.js to bundle
// the Anthropic SDK — and the code that reads ANTHROPIC_API_KEY — into the
// browser bundle, where the real key is never available (only
// NEXT_PUBLIC_-prefixed vars reach the client). That's why generation was
// always silently falling back to placeholder content regardless of the key
// in .env.local: it was running in the browser, not the server.
//
// It also saves the generated site server-side (see storage.ts) so the
// result is reachable from any device, not just the browser that created
// it, and returns just the slug -- the client never touches storage code.

import type { Business } from "@/features/businesses/types";
import { generateWebsite } from "./service";
import { saveSite } from "@/features/website/storage";

export async function generateWebsiteAction(
  business: Partial<Business>
): Promise<{ slug: string }> {
  const website = await generateWebsite(business);
  const saved = await saveSite(business, website);
  return { slug: saved.slug };
}
