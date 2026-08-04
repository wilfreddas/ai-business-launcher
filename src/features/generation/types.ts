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
  | "menu"
  | "services"
  | "gallery"
  | "about"
  | "reviews"
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
