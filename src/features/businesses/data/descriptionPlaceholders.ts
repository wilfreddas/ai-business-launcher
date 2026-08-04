import { BusinessType } from "../types";

/**
 * Example placeholder text for the "describe your business" question,
 * shown based on whichever business type the user just picked so the form
 * doesn't show a lawn-care example to someone building a restaurant site.
 */
export const DESCRIPTION_PLACEHOLDERS: Record<BusinessType, string> = {
  restaurant:
    "We're a family-owned Italian spot serving wood-fired pizza and fresh pasta in a cozy dining room...",
  lawn_care:
    "We provide lawn mowing, edging, and yard maintenance for homeowners across the area...",
  landscaping:
    "We design and install custom gardens, patios, and outdoor living spaces...",
  plumber:
    "We handle emergency repairs, drain cleaning, and full re-pipes for homes and businesses...",
  electrician:
    "We do panel upgrades, wiring, and emergency electrical repairs for homes and businesses...",
  hvac:
    "We install and repair heating and air conditioning systems, plus offer seasonal maintenance plans...",
  cleaning:
    "We provide recurring and one-time home and office cleaning with eco-friendly products...",
  dentist:
    "We offer general and cosmetic dentistry in a calm, modern office focused on patient comfort...",
  lawyer:
    "We represent clients in family law and estate planning matters with personalized attention...",
  other: "Tell us what your business does, who it serves, and what makes it different...",
};

export function getDescriptionPlaceholder(type?: string): string {
  if (type && type in DESCRIPTION_PLACEHOLDERS) {
    return DESCRIPTION_PLACEHOLDERS[type as BusinessType];
  }
  return DESCRIPTION_PLACEHOLDERS.other;
}
