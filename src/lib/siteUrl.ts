// src/lib/siteUrl.ts
//
// Single place to resolve the app's own public base URL, used for building
// absolute URLs in the sitemap, robots.txt, and each generated site's
// LocalBusiness structured data. Prefers an explicit override (set
// NEXT_PUBLIC_SITE_URL once a real domain is attached), then falls back to
// Vercel's own env vars, then localhost for local dev.

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return "http://localhost:3000";
}
