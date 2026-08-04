// src/features/generation/index.ts

// Server-only: only import this into Server Components/route handlers.
export { generateWebsite } from "./service";

// Safe to import from Client Components — this is a Server Action, so it
// actually executes on the server even when called from client code.
export { generateWebsiteAction } from "./actions";

export type {
  WebsiteContent,
  HeroContent,
  ServiceItem,
  ReviewItem,
  BusinessInfo,
  AboutContent,
  GalleryItem,
  WebsiteBlueprint,
  WebsiteThemeSpec,
  SectionName,
  CTAType,
  SEOMetadata,
} from "./types";