"use client";

import { ServiceItem } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, cardClass, badgeClass } from "../theme";

interface Props {
  items: ServiceItem[];
  heading: string;
  subheading?: string;
  /** "list" gives a cleaner editorial row layout instead of a card grid --
   * see isRefinedStyle in theme.ts for which AI-chosen styles map to which. */
  variant?: "grid" | "list";
}

export default function OfferingsGrid({ items, heading, subheading, variant = "grid" }: Props) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  if (variant === "list") {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 style={headingStyle} className={sectionHeadingClass}>
            {heading}
          </h2>
          {subheading && <p className="mt-3 text-base text-[var(--w-text)]/70">{subheading}</p>}
        </div>

        <div className="divide-y divide-[var(--w-text)]/10 border-y border-[var(--w-text)]/10">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-6 py-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 style={headingStyle} className="text-lg font-semibold">
                    {item.name}
                  </h3>
                  {item.category && <span className={badgeClass}>{item.category}</span>}
                </div>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--w-text)]/75">
                  {item.description}
                </p>
              </div>
              {item.price && (
                <span className="shrink-0 whitespace-nowrap font-semibold text-[var(--w-primary)]">
                  {item.price}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
          <div
            key={idx}
            className={`${cardClass} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
          >
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
