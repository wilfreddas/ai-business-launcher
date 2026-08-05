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
    availableSections: [
      "hero", "stats", "menu", "about", "features", "reviews", "location", "contact",
    ],
    moodHints:
      "Appetite-driven and sensory, but the specific mood swings hugely by restaurant: a fine-dining spot should feel hushed and elegant; a burger/taco joint should feel loud, fun, and casual; a family pizzeria should feel warm and unpretentious; a sushi bar should feel minimal and precise; a coffee shop/bakery should feel cozy and bright. Match the mood to what THIS place actually is.",
    colorHints:
      "Let the cuisine/vibe pick the palette, don't default to one 'restaurant red': fine dining often reads better in deep charcoal, forest green, or burgundy with a muted gold accent; casual/fast-food suits bold saturated colors (mustard yellow, bright red, orange, even hot pink); a sushi/minimalist spot can be near-monochrome (black/white/stone) with one sharp accent; a bakery/cafe suits soft creams, dusty pinks, or warm browns. Avoid landing on the same 2-3 'safe' hex values every time — commit to a specific palette for this specific place.",
    fontHints:
      "Fine dining: elegant serif/display heading. Casual/fast-food/food truck: bold, chunky sans or a playful display font. Family-style: friendly rounded font. Minimalist (sushi, modern cafe): clean geometric sans. Pick based on the actual formality implied by the name/description.",
    defaultCtaType: "book",
  },
  lawn_care: {
    label: "Lawn Care",
    template: "lawn_care",
    availableSections: [
      "hero", "stats", "services", "features", "process", "pricing", "reviews", "contact",
    ],
    moodHints:
      "Outdoorsy and trustworthy, but the specific personality depends on the business: a no-frills weekly mow crew should feel simple, fast, and budget-friendly; a boutique lawn-care outfit with organic/eco treatments should feel more refined and health-conscious; a family-run operation should feel warm and personal. Match the mood to what THIS business actually emphasizes.",
    colorHints:
      "Don't default to one 'lawn green': a budget mow service can lean bold/high-contrast (bright green + black, or orange for visibility/trucks); an eco/organic outfit suits softer sage greens, cream, and natural browns; a premium outfit can use deep forest green or navy with a single crisp accent. Vary it based on positioning, not just 'it's outdoor work so use green'.",
    fontHints: "Friendly rounded font for family/budget operators; cleaner geometric sans for a more premium or eco-focused positioning.",
    defaultCtaType: "quote",
  },
  landscaping: {
    label: "Landscaping",
    template: "lawn_care",
    availableSections: [
      "hero", "stats", "services", "features", "process", "reviews", "contact",
    ],
    moodHints:
      "Ranges from high-end estate design (aspirational, editorial) to practical hardscape/xeriscape specialists (rugged, technical) to neighborhood crews doing basic yard cleanup (approachable, no-frills). Read the description for which one this actually is.",
    colorHints:
      "High-end design studio: deep greens, charcoal, stone neutrals with one confident accent, feels editorial. Hardscape/xeriscape/desert specialist: terracotta, sand, warm stone tones rather than green-heavy palettes. Basic yard-cleanup crew: simpler, brighter greens, more utilitarian. Don't default to the same 'deep green + stone' combo regardless of what the business actually does.",
    fontHints: "Upscale/serif heading for premium design studios; bold clean sans for practical/hardscape crews.",
    defaultCtaType: "quote",
  },
  plumber: {
    label: "Plumbing",
    template: "plumbing",
    availableSections: [
      "hero", "stats", "services", "features", "process", "reviews", "faq", "location", "contact",
    ],
    moodHints:
      "Personality depends heavily on positioning: a 24/7 emergency repair outfit should feel urgent and no-nonsense; a boutique bathroom-remodel/high-end fixture plumber should feel more refined and design-conscious; a small family shop should feel personal and trustworthy rather than corporate-urgent. Don't default to 'urgent' if the description signals something calmer/higher-end.",
    colorHints:
      "Emergency/24-7 repair: bold blues or reds, high contrast, reads fast on a phone screen. High-end remodel/fixture specialist: more restrained palette — navy, brass/gold accent, warm neutrals, feels closer to an interior-design brand than a repair truck. Small family shop: warmer, friendlier tones.",
    fontHints: "Bold condensed/industrial heading for emergency/repair positioning; a cleaner, more refined sans or light serif for high-end remodel work.",
    defaultCtaType: "call",
  },
  electrician: {
    label: "Electrical",
    template: "electrical",
    availableSections: [
      "hero", "stats", "services", "features", "process", "reviews", "faq", "location", "contact",
    ],
    moodHints:
      "A residential emergency electrician should feel urgent and reassuring; a smart-home/high-end installer should feel modern and tech-forward; a commercial/industrial electrical contractor should feel more corporate and heavy-duty. Read the description for which fits.",
    colorHints:
      "Emergency residential: electric blue or navy with a caution-yellow/amber accent, high contrast. Smart-home/modern installer: sleeker near-monochrome palette (charcoal, white) with a single vivid accent (electric blue or lime), feels more like a tech brand. Commercial/industrial: deeper, more corporate blues and grays.",
    fontHints: "Bold industrial heading for residential/emergency; a cleaner modern sans for smart-home/tech-forward positioning.",
    defaultCtaType: "call",
  },
  hvac: {
    label: "HVAC",
    template: "hvac",
    availableSections: [
      "hero", "stats", "services", "features", "process", "pricing", "reviews", "location", "contact",
    ],
    moodHints:
      "A budget repair-and-maintenance outfit should feel practical and reliable; a premium high-efficiency/smart-thermostat installer should feel more modern and comfort-focused; a commercial HVAC contractor should feel more corporate and technical. Let the description decide.",
    colorHints:
      "Budget repair/maintenance: warm confident blues/oranges (classic 'heating and cooling' cues), straightforward. Premium/smart-home installer: cleaner, more minimal palette (soft blue-gray, white, one accent) closer to a modern home-tech brand than a repair van. Commercial: deeper corporate blues/grays.",
    fontHints: "Bold clean heading for repair/maintenance; a more refined modern sans for premium/smart-home positioning.",
    defaultCtaType: "book",
  },
  cleaning: {
    label: "Cleaning Services",
    template: "cleaning",
    availableSections: [
      "hero", "stats", "services", "features", "pricing", "reviews", "contact",
    ],
    moodHints:
      "A residential home-cleaning service should feel warm and trustworthy-in-your-home; a commercial/office janitorial contractor should feel more corporate and reliable; an eco-friendly/green-products cleaner should feel natural and health-conscious; a move-out/deep-clean specialist can feel more efficient and no-nonsense. Match to what the description actually says.",
    colorHints:
      "Residential/home: crisp whites with soft blues, teals, or lavender — light and airy. Commercial/janitorial: more neutral grays/navy, feels professional rather than homey. Eco-friendly: soft greens and natural tones instead of clinical blues. Avoid defaulting to the same 'white + teal' combo for every cleaning business.",
    fontHints: "Friendly rounded heading for residential/home cleaning; a cleaner, more corporate sans for commercial/janitorial.",
    defaultCtaType: "quote",
  },
  dentist: {
    label: "Dental Practice",
    template: "dental",
    availableSections: [
      "hero", "stats", "about", "services", "features", "reviews", "faq", "location", "contact",
    ],
    moodHints:
      "A family general practice should feel calm, warm, and reassuring; a cosmetic/spa-style practice should feel more upscale and modern; a pediatric practice should feel bright, friendly, and a little playful (without being childish); an orthodontic specialist can feel more energetic/modern. Read the description for which fits.",
    colorHints:
      "Family/general practice: soft blues, mint/teal, clean whites — calm and reassuring. Cosmetic/spa-style: warmer neutrals, blush, or elegant near-monochrome with a soft gold accent, feels more boutique. Pediatric: brighter, friendlier colors (soft yellow, coral, sky blue) without becoming garish. Don't default to the same pastel-blue palette regardless of positioning.",
    fontHints: "Clean modern sans or soft serif for general/family practice; a more elegant serif or refined sans for cosmetic/spa positioning; a friendlier rounded font for pediatric.",
    defaultCtaType: "book",
  },
  lawyer: {
    label: "Legal Practice",
    template: "legal",
    availableSections: [
      "hero", "stats", "about", "services", "features", "reviews", "faq", "location", "contact",
    ],
    moodHints:
      "A corporate/litigation firm should feel authoritative and buttoned-up; a family-law or estate-planning practice should feel warmer and more approachable (clients are often going through something personal); a criminal-defense practice should feel bold and assertive; a solo/small-town practitioner should feel more personal and down-to-earth than a big-firm brand. Match to the description, not a single 'law firm' default.",
    colorHints:
      "Corporate/litigation: deep navy or charcoal with a muted gold or silver accent — understated power. Family law/estate planning: warmer tones (deep teal, soft burgundy, warm neutrals) — approachable, not cold. Criminal defense: bolder, higher-contrast (deep red or black with a sharp accent). Solo/small practice: can be simpler and warmer, less corporate-feeling.",
    fontHints: "Classic serif heading for corporate/traditional positioning; a slightly softer serif or clean sans for family-law/approachable positioning; a bolder condensed font for criminal defense.",
    defaultCtaType: "contact",
  },
  other: {
    label: "General Service Business",
    template: "service",
    availableSections: [
      "hero", "stats", "services", "features", "process", "pricing", "about",
      "reviews", "faq", "location", "contact",
    ],
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
