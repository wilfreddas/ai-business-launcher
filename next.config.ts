import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the floating "N" dev tools indicator (bottom-left) that Next.js
  // shows during local development. Dev-only -- it was never visible to
  // real site visitors in production, but no reason to see it locally either.
  devIndicators: false,
};

export default nextConfig;
