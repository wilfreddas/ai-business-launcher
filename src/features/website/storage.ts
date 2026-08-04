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
import { Redis } from "@upstash/redis";
import type { Business } from "@/features/businesses/types";
import type { WebsiteContent } from "@/features/generation/types";

export interface SavedSite {
  slug: string;
  business: Partial<Business>;
  website: WebsiteContent;
  createdAt: string;
}

const INDEX_KEY = "sites:index";

// In-memory fallback, used only when Redis isn't configured.
const memorySites = new Map<string, SavedSite>();

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

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

export async function getSite(slug: string): Promise<SavedSite | null> {
  const redis = getRedis();
  if (redis) {
    const site = await redis.get<SavedSite>(`site:${slug}`);
    return site ?? null;
  }
  return memorySites.get(slug) ?? null;
}

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
