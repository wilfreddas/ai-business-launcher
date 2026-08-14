"use server";

import { deleteSite, duplicateSite, getSite, updateSite, updateSiteTracking, updateSiteAddOns } from "./storage";
import type { ClientStatus, SavedSite } from "./storage";
import type { WebsiteContent } from "@/features/generation/types";

export async function deleteSiteAction(slug: string): Promise<void> {
  await deleteSite(slug);
}

export async function duplicateSiteAction(slug: string): Promise<{ slug: string }> {
  const site = await duplicateSite(slug);
  if (!site) {
    throw new Error(`Site "${slug}" not found`);
  }
  return { slug: site.slug };
}

/** Internal Client Tracking edit (status/notes) -- no AI, no content change. */
export async function updateSiteTrackingAction(
  slug: string,
  patch: { status?: ClientStatus; notes?: string }
): Promise<void> {
  await updateSiteTracking(slug, patch);
}

/** Toggles opt-in add-ons (e.g. the scheduling demo) -- no AI, no content change. */
export async function updateSiteAddOnsAction(
  slug: string,
  addOns: SavedSite["addOns"]
): Promise<void> {
  await updateSiteAddOns(slug, addOns);
}

/**
 * Saves manually-edited content directly, with NO AI call involved. This is
 * the "no-code" editing path: toggling sections on/off, tweaking a price,
 * rewording a headline, removing a review -- anything that's a direct edit
 * to already-generated content rather than a full AI regeneration (that's
 * what /edit/[slug] + updateWebsiteAction is for).
 */
export async function updateSiteContentAction(
  slug: string,
  website: WebsiteContent
): Promise<{ slug: string }> {
  const site = await getSite(slug);
  if (!site) {
    throw new Error(`Site "${slug}" not found`);
  }

  // Contact fields are edited in the UI via website.businessInfo (what's
  // actually rendered on the live site), but the underlying business record
  // is the source of truth used if the site is ever AI-regenerated later --
  // keep them in sync here so a manual contact-info edit doesn't silently
  // get reverted by a future "Regenerate".
  const business = {
    ...site.business,
    phone: website.businessInfo.phone,
    email: website.businessInfo.email,
    address: website.businessInfo.address,
    hours: website.businessInfo.hours,
  };

  const saved = await updateSite(slug, business, website);
  return { slug: saved.slug };
}
