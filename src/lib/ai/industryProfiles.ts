// src/lib/ai/industryProfiles.ts
//
// This file does NOT decide the design. It gives Claude a per-industry menu
// of sensible options (which sections are relevant, what color/font mood
// fits, what the primary call-to-action usually is) so that generations stay
// on-brand for the industry while Claude still makes every real decision:
// exact colors, exact fonts, exact section order, and all copy.

import { BusinessType } from "@/features/businesses/types";

export interface IndustryProfile {
  label: string;
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
  /** Sections Claude may choose from for this industry, roughly in a sensible default order. */
  availableSections: string[];
  moodHints: string;
  colorHints: string;
  fontHints: string;
  defaultCtaType: "call" | "quote" | "book" | "order" | "contact";
}

export const INDUSTRY_PROFILES: Record<BusinessType, IndustryProfile> = {
  restaurant: {
    label: "Restaurant / Food",
    template: "restaurant",
    availableSections: ["hero", "menu", "gallery", "about", "reviews", "location", "contact"],
    moodHints:
      "Appetite-driven, warm, sensory. Should feel like walking into the actual dining room.",
    colorHints:
      "Rich, appetite-appealing palettes: deep reds, terracottas, warm ambers, or deep charcoal with a bold accent. Avoid cold clinical blues.",
    fontHints:
      "Often an elegant serif/display heading paired with a clean readable body font, unless the vibe is casual/fast-food (then bold sans works better).",
    defaultCtaType: "book",
  },
  lawn_care: {
    label: "Lawn Care",
    template: "lawn_care",
    availableSections: ["hero", "services", "gallery", "about", "reviews", "contact"],
    moodHints:
      "Outdoorsy, fresh, trustworthy, seasonal. Gallery should read as before/after transformation work.",
    colorHints:
      "Natural greens, earthy browns, sky blues. Should feel alive outdoors, not corporate.",
    fontHints: "Friendly, approachable heading font; clean readable body.",
    defaultCtaType: "quote",
  },
  landscaping: {
    label: "Landscaping",
    template: "lawn_care",
    availableSections: ["hero", "services", "gallery", "about", "reviews", "contact"],
    moodHints: "Premium outdoor craftsmanship, design-forward, aspirational.",
    colorHints: "Deep greens, stone/earth neutrals, one confident accent color.",
    fontHints: "Can lean slightly upscale/serif for heading if premium positioning; friendly sans otherwise.",
    defaultCtaType: "quote",
  },
  plumber: {
    label: "Plumbing",
    template: "plumbing",
    availableSections: ["hero", "services", "about", "reviews", "location", "contact"],
    moodHints:
      "Urgent, dependable, no-nonsense. Emergency/24-7 messaging matters. People want a phone call, fast.",
    colorHints: "Bold blues or reds, high contrast, easy to read fast on a phone screen.",
    fontHints: "Bold, condensed/industrial heading font that reads as trustworthy and strong.",
    defaultCtaType: "call",
  },
  electrician: {
    label: "Electrical",
    template: "electrical",
    availableSections: ["hero", "services", "about", "reviews", "location", "contact"],
    moodHints: "Safety-focused, licensed/certified feel, urgent for emergencies.",
    colorHints: "Electric blue, yellow/amber accent (caution/energy), or deep navy with bright accent.",
    fontHints: "Bold industrial heading font; highly legible body.",
    defaultCtaType: "call",
  },
  hvac: {
    label: "HVAC",
    template: "hvac",
    availableSections: ["hero", "services", "about", "reviews", "location", "contact"],
    moodHints: "Comfort-focused, seasonal (heating/cooling), reliability.",
    colorHints: "Cool blues for AC, warm oranges for heat, often blended into one confident palette.",
    fontHints: "Bold, clean heading; highly legible body for scannability.",
    defaultCtaType: "book",
  },
  cleaning: {
    label: "Cleaning Services",
    template: "cleaning",
    availableSections: ["hero", "services", "gallery", "about", "reviews", "contact"],
    moodHints: "Fresh, spotless, trustworthy-in-your-home feeling.",
    colorHints: "Crisp whites, soft blues/teals or fresh greens. Should feel clean and light.",
    fontHints: "Friendly, rounded heading font; light and airy overall feel.",
    defaultCtaType: "quote",
  },
  dentist: {
    label: "Dental Practice",
    template: "dental",
    availableSections: ["hero", "about", "services", "gallery", "reviews", "location", "contact"],
    moodHints: "Calm, clinical-but-warm, trust and comfort focused (many visitors are anxious).",
    colorHints: "Soft blues, mint/teal, clean whites. Avoid anything alarming or overly bold.",
    fontHints: "Clean modern sans or a soft serif heading; very readable body.",
    defaultCtaType: "book",
  },
  lawyer: {
    label: "Legal Practice",
    template: "legal",
    availableSections: ["hero", "about", "services", "reviews", "location", "contact"],
    moodHints: "Authoritative, established, trustworthy. Understated confidence, not flashy.",
    colorHints: "Deep navy, charcoal, forest green, or burgundy with a muted gold or silver accent.",
    fontHints: "Classic serif heading conveys authority and tradition; clean sans body.",
    defaultCtaType: "contact",
  },
  other: {
    label: "General Service Business",
    template: "service",
    availableSections: ["hero", "services", "about", "gallery", "reviews", "location", "contact"],
    moodHints: "Professional and adaptable to whatever this specific business actually does.",
    colorHints: "Choose a palette that fits the described business rather than a generic default.",
    fontHints: "Choose fonts that fit the tone described for this specific business.",
    defaultCtaType: "contact",
  },
};

export function getIndustryProfile(type?: string): IndustryProfile {
  if (type && type in INDUSTRY_PROFILES) {
    return INDUSTRY_PROFILES[type as BusinessType];
  }
  return INDUSTRY_PROFILES.other;
}

/**
 * Human-readable industry label for prompts. Falls back to the business's
 * own free-text description of what it is when type is "other", so a
 * bakery or a yoga studio gets treated as itself, not a generic service.
 */
export function resolveIndustryLabel(business: {
  type?: string;
  customType?: string;
}): string {
  if (business.type === "other" && business.customType?.trim()) {
    return business.customType.trim();
  }
  return getIndustryProfile(business.type).label;
}
