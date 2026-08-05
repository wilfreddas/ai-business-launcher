"use client";

import { Check } from "lucide-react";
import { PricingTier } from "@/features/generation/types";
import {
  headingStyle,
  sectionHeadingClass,
  cardClass,
  primaryButtonClass,
  outlineButtonClass,
} from "../theme";

interface Props {
  tiers: PricingTier[];
}

// Deliberately never shows a dollar amount -- see PricingTier's docstring in
// features/generation/types.ts. priceLabel is CTA-style text ("Get a Custom
// Quote") shown in the same visual slot a price would normally occupy.
export default function PricingSection({ tiers }: Props) {
  if (!tiers || tiers.length === 0) return null;

  return (
    <section id="pricing" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 style={headingStyle} className={sectionHeadingClass}>
            Simple, Honest Pricing
          </h2>
          <p className="mt-3 text-base text-[var(--w-text)]/70">
            Reach out for a quote tailored to your needs.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`${cardClass} !bg-white relative flex flex-col ${
                tier.highlighted ? "border-2 !border-[var(--w-primary)] shadow-lg lg:-translate-y-2" : ""
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--w-primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {tier.badge}
                </span>
              )}

              <h3 style={headingStyle} className="text-lg font-semibold">
                {tier.name}
              </h3>
              <p style={headingStyle} className="mt-4 text-2xl font-bold text-[var(--w-primary)]">
                {tier.priceLabel}
              </p>
              {tier.priceNote && (
                <p className="mt-1 text-xs text-[var(--w-text)]/60">{tier.priceNote}</p>
              )}

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-primary)]" />
                    <span className="text-[var(--w-text)]/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-6 w-full ${tier.highlighted ? primaryButtonClass : outlineButtonClass}`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
