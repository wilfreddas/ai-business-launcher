"use client";

import { StatItem } from "@/features/generation/types";
import { headingStyle } from "../theme";

interface Props {
  stats: StatItem[];
}

export default function StatsSection({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  return (
    <section id="stats" className="border-y border-black/5 bg-[var(--w-secondary)]/30 px-4 py-10 sm:py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <p style={headingStyle} className="text-3xl font-bold text-[var(--w-primary)] sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--w-text)]/60 sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
