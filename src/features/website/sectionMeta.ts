// src/features/website/sectionMeta.ts
//
// Single source of truth for section display labels, used by the live
// Navbar, the static-export Navbar, and the manual content editor's section
// toggle. Previously this map was duplicated in two Navbar components --
// centralizing it here means a future section type only needs a label added
// in one place.

import type { SectionName } from "@/features/generation/types";

export const SECTION_LABELS: Partial<Record<SectionName, string>> = {
  menu: "Menu",
  services: "Services",
  features: "Why Us",
  process: "How It Works",
  pricing: "Pricing",
  gallery: "Gallery",
  about: "About",
  reviews: "Reviews",
  faq: "FAQ",
  location: "Location",
  contact: "Contact",
};

/**
 * Every section a business can toggle on/off, in the order they'd
 * canonically appear if all were enabled. "hero" and "contact" aren't
 * included -- every site always has them, so they're not toggle-able.
 */
export const TOGGLEABLE_SECTIONS: SectionName[] = [
  "stats",
  "menu",
  "services",
  "features",
  "process",
  "pricing",
  "gallery",
  "about",
  "reviews",
  "faq",
  "location",
];
