"use client";

import { ServiceItem } from "@/features/generation/types";
import OfferingsGrid from "./OfferingsGrid";

interface Props {
  services: ServiceItem[];
}

export default function ServicesSection({ services }: Props) {
  return (
    <section id="services" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <OfferingsGrid
        items={services}
        heading="Our Services"
        subheading="What we can do for you."
      />
    </section>
  );
}
