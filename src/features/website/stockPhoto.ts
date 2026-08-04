// src/features/website/stockPhoto.ts
//
// Real photography with zero setup: Picsum Photos is a long-running, free,
// no-API-key image service. It doesn't support keyword search (so a
// restaurant won't specifically get food photos), but seeding by a stable
// string keeps each business's images consistent across reloads instead of
// changing every visit, and it's dramatically less "bland" than flat color
// placeholder tiles. If industry-accurate photography matters later, this
// is the single place to swap in the Unsplash API (needs a free key).

export function stockPhotoUrl(seed: string, width = 800, height = 600): string {
  const safeSeed = encodeURIComponent(seed).replace(/%/g, "").slice(0, 60) || "site";
  return `https://picsum.photos/seed/${safeSeed}/${width}/${height}`;
}
