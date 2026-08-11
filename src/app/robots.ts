import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/siteUrl";

// Public marketing site + every generated client site should be crawlable;
// the internal tool itself (dashboard, create/edit flows, login) should
// not -- there's nothing there for a search engine to index, and no reason
// to advertise its existence.
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/site/"],
        disallow: ["/dashboard", "/create", "/edit", "/login", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
