// src/features/website/storage.ts
//
// Server-only persistence for generated sites. If KV_REST_API_URL /
// KV_REST_API_TOKEN are set (added automatically when you connect "Upstash
// for Redis" via the Vercel Marketplace to this project), sites are stored
// in Redis and are reachable from any device. Without those env vars, this
// falls back to an in-process memory store -- fine for local dev, but it
// resets on every server restart and isn't shared across serverless
// instances, so it's not a substitute for Redis in production.
//
// This file must only ever be imported from server code (Server Actions,
// Server Components, Route Handlers) -- never from a "use client" component.

import "server-only";
import { cache } from "react";
import type { Business } from "@/features/businesses/types";
import type { WebsiteContent } from "@/features/generation/types";
import { getRedis } from "@/lib/redis";

export type ClientStatus = "lead" | "in_progress" | "live";

export interface SavedSite {
  slug: string;
  business: Partial<Business>;
  website: WebsiteContent;
  createdAt: string;
  /** Set the first time the site is edited/regenerated after creation. */
  updatedAt?: string;
  /** Internal pipeline status for the Client Tracking table. Defaults to "lead" if unset. */
  status?: ClientStatus;
  /** Free-text internal note, e.g. "waiting on logo" or "wants pricing removed". */
  notes?: string;
  /** Opt-in paid add-ons -- off by default, toggled per site. See features/accounts + features/scheduling. */
  addOns?: {
    /** Adds a client (business owner) login and a customer login/booking flow to this site. */
    scheduling?: boolean;
  };
}

const INDEX_KEY = "sites:index";

// In-memory fallback, used only when Redis isn't configured.
const memorySites = new Map<string, SavedSite>();

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "website"
  );
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base;
  let suffix = 2;
  while (taken.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function saveSite(
  business: Partial<Business>,
  website: WebsiteContent
): Promise<SavedSite> {
  const redis = getRedis();

  const taken = redis
    ? new Set(await redis.smembers(INDEX_KEY))
    : new Set(memorySites.keys());

  const slug = uniqueSlug(slugify(business.name || "website"), taken);
  const site: SavedSite = {
    slug,
    business,
    website,
    createdAt: new Date().toISOString(),
  };

  if (redis) {
    await redis.set(`site:${slug}`, site);
    await redis.sadd(INDEX_KEY, slug);
  } else {
    memorySites.set(slug, site);
  }

  return site;
}

/**
 * Regenerates and overwrites an existing site in place -- same slug, same
 * link, so a re-shared URL keeps working. Used by the "edit" flow (site
 * maintenance / adding features to an already-launched site), as opposed to
 * saveSite, which always mints a new slug for a brand-new site.
 */
export async function updateSite(
  slug: string,
  business: Partial<Business>,
  website: WebsiteContent
): Promise<SavedSite> {
  const redis = getRedis();
  const existing = redis ? await redis.get<SavedSite>(`site:${slug}`) : memorySites.get(slug);

  const site: SavedSite = {
    slug,
    business,
    website,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (redis) {
    await redis.set(`site:${slug}`, site);
    await redis.sadd(INDEX_KEY, slug);
  } else {
    memorySites.set(slug, site);
  }

  return site;
}

// Wrapped in React's request-level cache so calling getSite twice in one
// request (e.g. generateMetadata + the page component both need it) only
// hits Redis/memory once.
export const getSite = cache(async function getSite(slug: string): Promise<SavedSite | null> {
  const redis = getRedis();
  if (redis) {
    const site = await redis.get<SavedSite>(`site:${slug}`);
    return site ?? null;
  }
  return memorySites.get(slug) ?? null;
});

export async function listSites(): Promise<SavedSite[]> {
  const redis = getRedis();
  let sites: SavedSite[];

  if (redis) {
    const slugs = await redis.smembers(INDEX_KEY);
    if (slugs.length === 0) return [];
    const results = await Promise.all(
      slugs.map((slug) => redis.get<SavedSite>(`site:${slug}`))
    );
    sites = results.filter((s): s is SavedSite => Boolean(s));
  } else {
    sites = Array.from(memorySites.values());
  }

  return sites.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Clones an existing site's business + website content under a brand-new
 * slug -- a starting point for a similar client instead of running the full
 * AI interview again. Deliberately does NOT copy status/notes/updatedAt:
 * this is a new tracked site with its own fresh pipeline state.
 */
export async function duplicateSite(slug: string): Promise<SavedSite | null> {
  const existing = await getSite(slug);
  if (!existing) return null;
  return saveSite(existing.business, existing.website);
}

/**
 * Patches only the internal Client Tracking fields (status/notes) -- doesn't
 * touch content or the business record, and deliberately doesn't bump
 * `updatedAt` (that's reserved for actual content edits/regenerations, not
 * pipeline bookkeeping).
 */
export async function updateSiteTracking(
  slug: string,
  patch: { status?: ClientStatus; notes?: string }
): Promise<SavedSite | null> {
  const redis = getRedis();
  const existing = redis ? await redis.get<SavedSite>(`site:${slug}`) : memorySites.get(slug);
  if (!existing) return null;

  const site: SavedSite = { ...existing, ...patch };

  if (redis) {
    await redis.set(`site:${slug}`, site);
  } else {
    memorySites.set(slug, site);
  }

  return site;
}

/** Toggles opt-in add-ons (currently just scheduling) -- no AI, no content change. */
export async function updateSiteAddOns(
  slug: string,
  addOns: SavedSite["addOns"]
): Promise<SavedSite | null> {
  const redis = getRedis();
  const existing = redis ? await redis.get<SavedSite>(`site:${slug}`) : memorySites.get(slug);
  if (!existing) return null;

  const site: SavedSite = { ...existing, addOns };

  if (redis) {
    await redis.set(`site:${slug}`, site);
  } else {
    memorySites.set(slug, site);
  }

  return site;
}

export async function deleteSite(slug: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(`site:${slug}`);
    await redis.srem(INDEX_KEY, slug);
  } else {
    memorySites.delete(slug);
  }
}

/** Whether persistent (cross-device) storage is actually configured. */
export function isPersistentStorageConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}
