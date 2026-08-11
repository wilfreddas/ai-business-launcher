// src/lib/redis.ts
//
// Shared Redis client factory. Site storage and review storage both need
// the same "Upstash if configured, else fall back to memory" resolution --
// this is the one place that decides that, instead of two separate copies
// of the same check drifting apart over time.

import "server-only";
import { Redis } from "@upstash/redis";

let warnedAboutMemoryFallback = false;

export function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    if (!warnedAboutMemoryFallback) {
      warnedAboutMemoryFallback = true;
      console.warn(
        "⚠️  KV_REST_API_URL/KV_REST_API_TOKEN not set — using in-memory storage. " +
          "Data won't survive a server restart, and in dev this isn't guaranteed to be " +
          "shared across every route depending on how Next bundles them. Set up Upstash " +
          "Redis for reliable behavior."
      );
    }
    return null;
  }
  return new Redis({ url, token });
}
