"use client";

import { Phone } from "lucide-react";
import { HeroContent, BusinessInfo } from "@/features/generation/types";
import { headingStyle, outlineButtonClass } from "../theme";
import { stockPhotoUrl } from "../stockPhoto";
import { formatPhoneDisplay, phoneHref } from "@/lib/format";
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
      {/* Photo backdrop, dimmed and tinted with the brand color so text stays legible */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={stockPhotoUrl(businessInfo.businessName || "hero", 1600, 900)}
        alt=""
        aria-hidden
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--w-primary) 88%, transparent), var(--w-primary)), radial-gradient(circle at 80% 70%, var(--w-secondary), transparent 40%)",
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
              href={`tel:${phoneHref(businessInfo.phone)}`}
              className={`w-full sm:w-auto ${outlineButtonClass}`}
            >
              <Phone className="h-4 w-4" />
              {formatPhoneDisplay(businessInfo.phone)}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
