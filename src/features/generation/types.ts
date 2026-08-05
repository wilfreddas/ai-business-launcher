// src/features/generation/types.ts

export interface WebsiteContent {
  title: string;
  description: string;
  hero: HeroContent;
  services: ServiceItem[];
  reviews: ReviewItem[];
  businessInfo: BusinessInfo;
  about: AboutContent;
  gallery: GalleryItem[];
  stats: StatItem[];
  features: FeatureItem[];
  process: ProcessStep[];
  pricing: PricingTier[];
  faq: FAQItem[];
  chatIntro: ChatIntro;
  blueprint: WebsiteBlueprint;
  seo: SEOMetadata;
  sections: string[];
  theme: WebsiteThemeSpec;
  generatedAt: string;
  businessType: string;
}

export interface HeroContent {
  headline: string;
  subheading: string;
  /** Short trust badge shown above the headline, e.g. "Now Booking" or "Serving Albany & Surrounds". */
  badge?: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  category?: string;
  price?: string;
}

export interface ReviewItem {
  text: string;
  author: string;
  rating: number;
}

export type CTAType = "call" | "quote" | "book" | "order" | "contact";

export interface BusinessInfo {
  businessName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  cta: string;
  ctaDescription: string;
  ctaType: CTAType;
  hours?: string;
  emergencyAvailable?: boolean;
}

export interface AboutContent {
  heading: string;
  body: string;
  highlights: string[];
}

export interface GalleryItem {
  caption: string;
  label: string;
}

/** A single stat-bar entry, e.g. "100%" / "Satisfaction Guarantee". Value is
 * deliberately a short qualitative or self-evident claim (a guarantee, a
 * commitment) rather than a specific fabricated number like a client count
 * or years-in-business figure the AI can't actually know. */
export interface StatItem {
  value: string;
  label: string;
}

/** A "why choose us" style feature card. */
export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

/** A single numbered step in a "how it works" process section. */
export interface ProcessStep {
  title: string;
  description: string;
}

/**
 * A pricing-tier card. Deliberately has no invented dollar amount — the
 * business owner never told us real prices, so priceLabel is CTA-style text
 * ("Get a Custom Quote") shown in the same visual slot a price would occupy,
 * rather than the AI guessing a number a real customer might rely on.
 */
export interface PricingTier {
  name: string;
  priceLabel: string;
  priceNote?: string;
  badge?: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/** Pre-written opener + suggested first questions for the live chat widget. */
export interface ChatIntro {
  greeting: string;
  quickReplies: string[];
}

/**
 * Full theme spec chosen by the AI per-business. Colors are hex strings so
 * they can be applied as CSS custom properties at render time (Tailwind v4
 * arbitrary values read them via var(--w-primary) etc).
 */
export interface WebsiteThemeSpec {
  style: "modern" | "professional" | "friendly" | "luxury" | "bold" | "minimal";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: "serif" | "sans" | "display" | "friendly";
  bodyFont: "serif" | "sans";
  radius: "none" | "soft" | "round";
}

export type SectionName =
  | "hero"
  | "stats"
  | "menu"
  | "services"
  | "features"
  | "process"
  | "pricing"
  | "gallery"
  | "about"
  | "reviews"
  | "faq"
  | "location"
  | "contact";

export interface WebsiteBlueprint {
  template:
    | "restaurant"
    | "lawn_care"
    | "plumbing"
    | "electrical"
    | "hvac"
    | "cleaning"
    | "dental"
    | "legal"
    | "service"
    | "generic";
  sections: SectionName[];
  theme: WebsiteThemeSpec;
  reasoning?: string;
}

export interface SEOMetadata {
  title: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}
