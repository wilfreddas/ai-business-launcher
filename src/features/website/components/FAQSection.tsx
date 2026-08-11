"use client";

import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/features/generation/types";
import { headingStyle, cardClass } from "../theme";
import SectionHeading from "./SectionHeading";

interface Props {
  faq: FAQItem[];
}

export default function FAQSection({ faq }: Props) {
  if (!faq || faq.length === 0) return null;

  return (
    <section id="faq" className="bg-[var(--w-secondary)]/30 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading heading="Frequently Asked Questions" />

        <div className="space-y-3">
          {faq.map((item, idx) => (
            <details key={idx} className={`${cardClass} !bg-white group`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                <span style={headingStyle}>{item.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[var(--w-primary)] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--w-text)]/75">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
