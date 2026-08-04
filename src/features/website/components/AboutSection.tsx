"use client";

import { CheckCircle2 } from "lucide-react";
import { AboutContent } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass } from "../theme";

interface Props {
  about: AboutContent;
}

export default function AboutSection({ about }: Props) {
  if (!about) return null;

  return (
    <section id="about" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 style={headingStyle} className={sectionHeadingClass}>
          {about.heading}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-[var(--w-text)]/75 sm:text-lg">
          {about.body}
        </p>

        {about.highlights && about.highlights.length > 0 && (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {about.highlights.map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm font-medium text-[var(--w-text)]/85"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--w-primary)]" />
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
