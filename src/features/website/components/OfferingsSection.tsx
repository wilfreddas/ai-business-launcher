"use client";

import { ServiceItem, WebsiteThemeSpec } from "@/features/generation/types";
import { isRefinedStyle } from "../theme";
import OfferingsGrid from "./OfferingsGrid";

interface Props {
  services: ServiceItem[];
  style: WebsiteThemeSpec["style"];
  id: string;
  heading: string;
  subheading: string;
}

/**
 * Shared implementation behind ServicesSection and MenuSection -- those two
 * were previously 100%-identical files aside from id/heading/subheading
 * strings, so they now just supply their config to this one component.
 */
export default function OfferingsSection({ services, style, id, heading, subheading }: Props) {
  return (
    <section id={id} className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <OfferingsGrid
        items={services}
        heading={heading}
        subheading={subheading}
        variant={isRefinedStyle(style) ? "list" : "grid"}
      />
    </section>
  );
}
