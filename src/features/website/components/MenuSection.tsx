"use client";

import { ServiceItem } from "@/features/generation/types";
import OfferingsGrid from "./OfferingsGrid";

interface Props {
  services: ServiceItem[];
}

export default function MenuSection({ services }: Props) {
  return (
    <section id="menu" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <OfferingsGrid
        items={services}
        heading="Our Menu"
        subheading="Made fresh, served with care."
      />
    </section>
  );
}
