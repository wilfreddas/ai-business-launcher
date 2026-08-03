"use client";

import { useEffect, useState } from "react";

import { generateWebsite } from "@/features/generation";
import { WebsiteContent } from "@/features/generation";

import WebsitePreview from "./WebsitePreview";

import { Business } from "@/features/businesses/types";

export default function WebsitePreviewWrapper({
  business,
}: {
  business: Partial<Business>;
}) {
  const [website, setWebsite] =
    useState<WebsiteContent | null>(null);

  useEffect(() => {
    async function createWebsite() {
      const result = await generateWebsite(
        business
      );

      setWebsite(result);
    }

    createWebsite();
  }, [business]);

  if (!website) {
    return (
      <div className="text-center">
        Creating your AI website...
      </div>
    );
  }

  return (
    <WebsitePreview website={website} />
  );
}