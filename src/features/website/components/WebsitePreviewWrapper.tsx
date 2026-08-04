"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
// Imported directly (not through the shared "@/features/generation" barrel)
// so the client bundle only ever touches the "use server" boundary file,
// never the real generation pipeline that pulls in the Anthropic SDK.
import { generateWebsiteAction } from "@/features/generation/actions";
import { Business } from "@/features/businesses/types";

export default function WebsitePreviewWrapper({
  business,
}: {
  business: Partial<Business>;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    startTransition(async () => {
      try {
        const { slug } = await generateWebsiteAction(business);
        router.push(`/site/${slug}`);
      } catch (err) {
        setError("Failed to generate website. Please try again.");
        console.error(err);
      }
    });
  }, [business, router]);

  if (error) {
    return (
      <div className="py-12 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <p className="text-lg">✨ {isPending ? "Creating your AI website..." : "Preparing..."}</p>
      <p className="mt-2 text-sm text-gray-500">
        Designing a layout, colors, and copy for your business — this takes a few seconds.
      </p>
    </div>
  );
}
