"use client";

import { ServiceItem, WebsiteThemeSpec } from "@/features/generation/types";
import { isRefinedStyle } from "../theme";
import OfferingsGrid from "./OfferingsGrid";

interface Props {
  services: ServiceItem[];
  style: WebsiteThemeSpec["style"];
}

export default function ServicesSection({ services, style }: Props) {
  return (
    <section id="services" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <OfferingsGrid
        items={services}
        heading="Our Services"
        subheading="What we can do for you."
        variant={isRefinedStyle(style) ? "list" : "grid"}
      />
    </section>
  );
}
