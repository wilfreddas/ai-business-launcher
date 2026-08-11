// src/features/website/structuredData.ts
//
// Builds the LocalBusiness JSON-LD block embedded on every generated site --
// this is what actually helps a business show up correctly in Google's
// local/map-style results, as opposed to just being indexed as a generic
// page. Deliberately conservative about what it claims:
//   - No `image`: hero/gallery photos come from a random stock-photo seed
//     (see stockPhoto.ts), not real photos of the business, so claiming one
//     as "the business's image" would be inaccurate.
//   - No `aggregateRating`/`review`: the reviews shown on generated sites
//     are AI-written placeholders, not real customer reviews. Marking them
//     up as structured review data would misrepresent them to Google as
//     real ratings -- a real liability risk, and something search engines
//     actively penalize once caught. Revisit this once real review
//     collection (see roadmap) exists.
//   - No `openingHours`: businessInfo.hours is freeform text (e.g. "Mon-Fri
//     9am-5pm"), not the strict machine-readable format schema.org expects,
//     and a wrong automated parse would be worse than omitting it.

import type { WebsiteContent } from "@/features/generation/types";
import { getBaseUrl } from "@/lib/siteUrl";

// Only mapped where schema.org has a real, specific type -- anything else
// (including "other") falls back to plain LocalBusiness rather than
// guessing at a type that doesn't fit.
const SCHEMA_TYPE_BY_BUSINESS_TYPE: Record<string, string> = {
  plumber: "Plumber",
  electrician: "Electrician",
  hvac: "HVACBusiness",
  landscaping: "HomeAndConstructionBusiness",
  lawn_care: "HomeAndConstructionBusiness",
  restaurant: "Restaurant",
  dentist: "Dentist",
  lawyer: "LegalService",
};

export function buildLocalBusinessSchema(
  website: WebsiteContent,
  slug: string
): Record<string, unknown> {
  const { businessInfo, businessType } = website;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/site/${slug}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE_BY_BUSINESS_TYPE[businessType] || "LocalBusiness",
    name: businessInfo.businessName,
    description: businessInfo.description,
    url,
  };

  if (businessInfo.phone) {
    schema.telephone = businessInfo.phone;
  }
  if (businessInfo.email) {
    schema.email = businessInfo.email;
  }
  if (businessInfo.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: businessInfo.address,
    };
  }

  return schema;
}
