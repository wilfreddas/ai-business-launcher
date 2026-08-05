"use client";

import { FeatureItem } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, cardClass } from "../theme";

interface Props {
  features: FeatureItem[];
}

export default function FeaturesSection({ features }: Props) {
  if (!features || features.length === 0) return null;

  return (
    <section id="features" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 style={headingStyle} className={sectionHeadingClass}>
            Why Choose Us
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`${cardClass} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
            >
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
      </div>
    </section>
  );
}
