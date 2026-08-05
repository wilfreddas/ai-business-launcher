"use server";

import { deleteSite, getSite, updateSite } from "./storage";
import type { WebsiteContent } from "@/features/generation/types";

export async function deleteSiteAction(slug: string): Promise<void> {
  await deleteSite(slug);
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
  const saved = await updateSite(slug, site.business, website);
  return { slug: saved.slug };
}
