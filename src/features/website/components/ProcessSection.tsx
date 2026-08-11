"use client";

import { ProcessStep } from "@/features/generation/types";
import { headingStyle } from "../theme";
import SectionHeading from "./SectionHeading";

interface Props {
  steps: ProcessStep[];
}

export default function ProcessSection({ steps }: Props) {
  if (!steps || steps.length === 0) return null;

  return (
    <section id="process" className="bg-[var(--w-secondary)]/30 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading="How It Works" />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <span
                style={headingStyle}
                className="text-4xl font-bold text-[var(--w-primary)]/25"
                aria-hidden
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 style={headingStyle} className="mt-2 text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--w-text)]/75">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
