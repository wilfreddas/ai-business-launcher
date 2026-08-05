"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, PartyPopper } from "lucide-react";
// Imported directly (not through the shared "@/features/generation" barrel)
// so the client bundle only ever touches the "use server" boundary file,
// never the real generation pipeline that pulls in the Anthropic SDK.
import { generateWebsiteAction, updateWebsiteAction } from "@/features/generation/actions";
import { Business } from "@/features/businesses/types";
import { buttonVariants } from "@/components/ui/Button";

export default function WebsitePreviewWrapper({
  business,
  editSlug,
}: {
  business: Partial<Business>;
  /** When set, regenerates and overwrites this existing site instead of creating a new one. */
  editSlug?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [doneSlug, setDoneSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    startTransition(async () => {
      try {
        const { slug } = editSlug
          ? await updateWebsiteAction(editSlug, business)
          : await generateWebsiteAction(business);
        // Landing here instead of auto-redirecting so "open in a new tab"
        // can be a real link -- browsers silently block window.open() calls
        // that don't happen synchronously inside a click handler, and this
        // fires after an async API call, so a blind auto-popup wouldn't
        // reliably work.
        setDoneSlug(slug);
      } catch (err) {
        setError(
          editSlug
            ? "Failed to update website. Please try again."
            : "Failed to generate website. Please try again."
        );
        console.error(err);
      }
    });
  }, [business, editSlug]);

  if (error) {
    return (
      <div className="py-12 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (doneSlug) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <PartyPopper className="h-8 w-8 text-[var(--w-primary,theme(colors.emerald.500))]" />
        <h2 className="text-xl font-bold">
          {editSlug ? "Your website has been updated!" : "Your website is ready!"}
        </h2>
        <p className="max-w-sm text-sm text-gray-500">
          Take a look, then head back to the dashboard whenever you&apos;re ready.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/site/${doneSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            <ExternalLink className="h-4 w-4" />
            View Live Site
          </Link>
          <Link href="/dashboard" className={buttonVariants({ size: "lg", variant: "outline" })}>
            <LayoutDashboard className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <p className="text-lg">
        ✨ {isPending ? (editSlug ? "Updating your website..." : "Creating your AI website...") : "Preparing..."}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        {editSlug
          ? "Regenerating the site with your changes — this takes a few seconds."
          : "Designing a layout, colors, and copy for your business — this takes a few seconds."}
      </p>
    </div>
  );
}
