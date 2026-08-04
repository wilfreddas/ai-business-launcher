"use server";

// This file is the boundary between client code and the AI generation
// pipeline. Without it, importing generateWebsite directly into a "use
// client" component (like WebsitePreviewWrapper) causes Next.js to bundle
// the Anthropic SDK — and the code that reads ANTHROPIC_API_KEY — into the
// browser bundle, where the real key is never available (only
// NEXT_PUBLIC_-prefixed vars reach the client). That's why generation was
// always silently falling back to placeholder content regardless of the key
// in .env.local: it was running in the browser, not the server.

import type { Business } from "@/features/businesses/types";
import type { WebsiteContent } from "./types";
import { generateWebsite } from "./service";

export async function generateWebsiteAction(
  business: Partial<Business>
): Promise<WebsiteContent> {
  return generateWebsite(business);
}
