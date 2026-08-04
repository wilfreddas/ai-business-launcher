"use client";

import { Phone } from "lucide-react";
import { HeroContent, BusinessInfo } from "@/features/generation/types";
import { headingStyle, outlineButtonClass } from "../theme";
import CTAButton from "./CTAButton";

interface Props {
  hero: HeroContent;
  businessInfo: BusinessInfo;
}

export default function HeroSection({ hero, businessInfo }: Props) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[var(--w-primary)] px-4 py-20 text-white sm:py-28 md:py-36"
    >
      {/* Subtle layered background using the theme accent, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, var(--w-accent), transparent 45%), radial-gradient(circle at 80% 70%, var(--w-secondary), transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {businessInfo.emergencyAvailable && (
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
            24/7 Emergency Service
          </span>
        )}

        <h1
          style={headingStyle}
          className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
        >
          {hero.headline}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85 sm:text-xl">
          {hero.subheading}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton
            businessInfo={businessInfo}
            variant="primary"
            className="w-full !bg-white !text-[var(--w-primary)] sm:w-auto"
          />

          {businessInfo.phone && businessInfo.ctaType !== "call" && (
            <a
              href={`tel:${businessInfo.phone.replace(/[^\d+]/g, "")}`}
              className={`w-full sm:w-auto ${outlineButtonClass}`}
            >
              <Phone className="h-4 w-4" />
              {businessInfo.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
