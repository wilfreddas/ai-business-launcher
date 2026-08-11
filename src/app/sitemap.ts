import type { MetadataRoute } from "next";
import { listSites } from "@/features/website/storage";
import { getBaseUrl } from "@/lib/siteUrl";

// Every generated client site currently lives under this one app's domain
// (no custom-domain support yet -- see the roadmap), so one sitemap covering
// the marketing homepage plus every /site/[slug] is correct today. Once
// custom domains ship, a site using one should be excluded here (it'll have
// its own sitemap on its own domain instead).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const sites = await listSites();

  const siteEntries: MetadataRoute.Sitemap = sites.map((site) => ({
    url: `${baseUrl}/site/${site.slug}`,
    lastModified: new Date(site.updatedAt || site.createdAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...siteEntries,
  ];
}
