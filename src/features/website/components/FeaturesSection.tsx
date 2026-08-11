"use client";

import { FeatureItem, WebsiteThemeSpec } from "@/features/generation/types";
import { headingStyle, isRefinedStyle, hoverCardClass } from "../theme";
import SectionHeading from "./SectionHeading";

interface Props {
  features: FeatureItem[];
  style: WebsiteThemeSpec["style"];
}

export default function FeaturesSection({ features, style }: Props) {
  if (!features || features.length === 0) return null;

  const refined = isRefinedStyle(style);

  return (
    <section id="features" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading="Why Choose Us" />

        {refined ? (
          <div className="mx-auto grid max-w-3xl gap-x-10 gap-y-8 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 border-l-2 border-[var(--w-primary)] pl-4">
                <div>
                  <h3 style={headingStyle} className="font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--w-text)]/75">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div key={idx} className={hoverCardClass}>
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-[var(--w-radius)] text-xl"
                  style={{ backgroundColor: "var(--w-secondary)" }}
                  aria-hidden
                >
                  {feature.icon}
                </div>
                <h3 style={headingStyle} className="mt-4 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--w-text)]/75">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
