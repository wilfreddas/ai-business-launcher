"use client";

import { MapPin, Clock, ExternalLink } from "lucide-react";
import { BusinessInfo } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, primaryButtonClass } from "../theme";

interface Props {
  businessInfo: BusinessInfo;
}

export default function LocationSection({ businessInfo }: Props) {
  const address = businessInfo?.address;
  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : undefined;

  return (
    <section id="location" className="bg-[var(--w-bg)] px-4 py-16 text-center sm:py-24">
      <div className="mx-auto max-w-xl">
        <h2 style={headingStyle} className={sectionHeadingClass}>
          Find Us
        </h2>

        <div className="mt-6 flex flex-col items-center gap-2 text-[var(--w-text)]/80">
          {address && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[var(--w-primary)]" />
              {address}
            </p>
          )}
          {businessInfo?.hours && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-[var(--w-primary)]" />
              {businessInfo.hours}
            </p>
          )}
        </div>

        {mapsHref && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryButtonClass} mt-7`}
          >
            Get Directions
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </section>
  );
}
