"use client";

import { ServiceItem } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, cardClass, badgeClass } from "../theme";

interface Props {
  items: ServiceItem[];
  heading: string;
  subheading?: string;
}

export default function OfferingsGrid({ items, heading, subheading }: Props) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
        <h2 style={headingStyle} className={sectionHeadingClass}>
          {heading}
        </h2>
        {subheading && <p className="mt-3 text-base text-[var(--w-text)]/70">{subheading}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <div key={idx} className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <h3 style={headingStyle} className="text-lg font-semibold">
                {item.name}
              </h3>
              {item.price && (
                <span className="shrink-0 whitespace-nowrap font-semibold text-[var(--w-primary)]">
                  {item.price}
                </span>
              )}
            </div>
            {item.category && <span className={`${badgeClass} mt-2`}>{item.category}</span>}
            <p className="mt-3 text-sm leading-relaxed text-[var(--w-text)]/75">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
