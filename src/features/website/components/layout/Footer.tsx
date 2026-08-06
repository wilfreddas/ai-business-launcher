"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import type { BusinessInfo } from "@/features/generation/types";
import { headingStyle } from "../../theme";
import { formatPhoneDisplay, phoneHref } from "@/lib/format";

interface Props {
  businessName: string;
  businessInfo: BusinessInfo;
  /**
   * Only set for the live-hosted preview (WebsitePreview), never for the
   * downloadable static export -- a "/site/[slug]/privacy" link wouldn't
   * resolve once a client hosts the downloaded HTML file somewhere else.
   */
  slug?: string;
}

export default function Footer({ businessName, businessInfo, slug }: Props) {
  return (
    <footer className="border-t border-black/5 bg-[var(--w-bg)] px-4 py-10 text-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <p style={headingStyle} className="text-base font-bold">
          {businessName}
        </p>

        <div className="flex flex-col items-center gap-2 text-[var(--w-text)]/70 sm:items-end">
          {businessInfo?.phone && (
            <a href={`tel:${phoneHref(businessInfo.phone)}`} className="flex items-center gap-2 hover:text-[var(--w-primary)]">
              <Phone className="h-3.5 w-3.5" />
              {formatPhoneDisplay(businessInfo.phone)}
            </a>
          )}
          {businessInfo?.email && (
            <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-2 hover:text-[var(--w-primary)]">
              <Mail className="h-3.5 w-3.5" />
              {businessInfo.email}
            </a>
          )}
          {businessInfo?.address && (
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              {businessInfo.address}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 text-center text-xs text-[var(--w-text)]/50">
        <span>
          © {new Date().getFullYear()} {businessName}. All rights reserved.
        </span>
        {slug && (
          <Link href={`/site/${slug}/privacy`} className="underline hover:text-[var(--w-text)]/80">
            Privacy Policy
          </Link>
        )}
      </p>
    </footer>
  );
}
