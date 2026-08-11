import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/features/website/storage";
import { listApprovedReviews } from "@/features/reviews/storage";
import WebsitePreview from "@/features/website/components/WebsitePreview";
import { buildLocalBusinessSchema } from "@/features/website/structuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    return { title: "Site not found" };
  }

  const { seo, title, description } = site.website;
  const pageTitle = seo?.title || title;
  const pageDescription = seo?.metaDescription || description;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.ogTitle || pageTitle,
      description: seo?.ogDescription || pageDescription,
      type: "website",
    },
  };
}

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Site not found</h1>
        <p className="max-w-sm text-gray-600">
          No saved site matches this link. It may have been deleted, or the server was restarted
          without persistent storage configured.
        </p>
        <Link href="/dashboard" className="text-sm font-semibold underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const schema = buildLocalBusinessSchema(site.website, slug);
  const reviews = await listApprovedReviews(slug);

  // Deliberately no app navbar/dashboard chrome here — this route is meant
  // to look and behave like the business's actual public website.
  return (
    <>
      {/* LocalBusiness structured data -- helps this business show up
          correctly in Google's local/map-style results. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <WebsitePreview website={site.website} slug={slug} reviews={reviews} />
    </>
  );
}
