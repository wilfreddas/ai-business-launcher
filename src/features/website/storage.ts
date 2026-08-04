// src/features/website/storage.ts
//
// Lightweight browser-local persistence for generated sites. There's no
// backend/database in this project yet, so a saved site's live link
// (/site/[slug]) works reliably on the computer/browser that created it.
// Sharing that link on another device won't resolve until real server-side
// storage is added — the "Download Website" export exists specifically to
// give people a way to get a truly portable copy in the meantime.

"use client";

import type { Business } from "@/features/businesses/types";
import type { WebsiteContent } from "@/features/generation/types";

const STORAGE_KEY = "ai-business-launcher:sites";

export interface SavedSite {
  slug: string;
  business: Partial<Business>;
  website: WebsiteContent;
  createdAt: string;
}

function readAll(): SavedSite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read saved sites:", error);
    return [];
  }
}

function writeAll(sites: SavedSite[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "website";
}

function uniqueSlug(base: string, existing: SavedSite[]): string {
  let slug = base;
  let suffix = 2;
  const taken = new Set(existing.map((s) => s.slug));
  while (taken.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

/** Save a generated website, returning the slug it was saved under. */
export function saveSite(business: Partial<Business>, website: WebsiteContent): SavedSite {
  const sites = readAll();
  const slug = uniqueSlug(slugify(business.name || "website"), sites);

  const site: SavedSite = {
    slug,
    business,
    website,
    createdAt: new Date().toISOString(),
  };

  writeAll([site, ...sites]);
  return site;
}

export function listSites(): SavedSite[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getSite(slug: string): SavedSite | null {
  return readAll().find((s) => s.slug === slug) ?? null;
}

export function deleteSite(slug: string): void {
  writeAll(readAll().filter((s) => s.slug !== slug));
}
