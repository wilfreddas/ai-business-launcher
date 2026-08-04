"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSite, SavedSite } from "@/features/website";
import { WebsitePreview } from "@/features/website";

export default function SitePage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");
  const [site, setSite] = useState<SavedSite | null>(null);

  useEffect(() => {
    if (!slug) return;
    const found = getSite(slug);
    // Reading localStorage (a browser-only external store) must happen
    // after mount to avoid a server/client hydration mismatch.
    if (found) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSite(found);
      setStatus("found");
    } else {
      setStatus("not-found");
    }
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading site...</p>
      </div>
    );
  }

  if (status === "not-found" || !site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Site not found</h1>
        <p className="max-w-sm text-gray-600">
          This site isn&apos;t saved in this browser. Saved sites currently only work on the
          device/browser that created them.
        </p>
        <Link href="/dashboard" className="text-sm font-semibold underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  // Deliberately no app navbar/dashboard chrome here — this route is meant
  // to look and behave like the business's actual public website.
  return <WebsitePreview website={site.website} />;
}
