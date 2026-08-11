"use client";

import { HeroContent, BusinessInfo, WebsiteThemeSpec } from "@/features/generation/types";
import { headingStyle, isRefinedStyle } from "../theme";
import { stockPhotoUrl } from "../stockPhoto";
import HeroBadgeRow from "./HeroBadgeRow";
import HeroCTAGroup from "./HeroCTAGroup";

interface Props {
  hero: HeroContent;
  businessInfo: BusinessInfo;
  style: WebsiteThemeSpec["style"];
}

export default function HeroSection({ hero, businessInfo, style }: Props) {
  if (isRefinedStyle(style)) {
    return <SplitHero hero={hero} businessInfo={businessInfo} />;
  }
  return <PhotoBackdropHero hero={hero} businessInfo={businessInfo} />;
}

/** Bold/modern/friendly: full-bleed dimmed photo, centered text, decorative blobs. */
function PhotoBackdropHero({ hero, businessInfo }: Omit<Props, "style">) {
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

      {/* Decorative blurred accent blobs for extra visual depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: "var(--w-accent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: "var(--w-secondary)" }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <HeroBadgeRow hero={hero} businessInfo={businessInfo} tone="dark" />

        <h1
          style={headingStyle}
          className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
        >
          {hero.headline}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85 sm:text-xl">
          {hero.subheading}
        </p>

        <HeroCTAGroup
          businessInfo={businessInfo}
          primaryClassName="w-full !bg-white !text-[var(--w-primary)] sm:w-auto"
        />
      </div>
    </section>
  );
}

/** Professional/minimal/luxury: clean split layout, real (non-dimmed) photo in a card, left-aligned text. */
function SplitHero({ hero, businessInfo }: Omit<Props, "style">) {
  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--w-bg)] px-4 py-20 sm:py-28 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="text-center md:text-left">
          <HeroBadgeRow hero={hero} businessInfo={businessInfo} tone="light" justify="start" />

          <h1
            style={headingStyle}
            className="text-4xl font-bold leading-tight text-[var(--w-text)] sm:text-5xl md:text-6xl"
          >
            {hero.headline}
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg text-[var(--w-text)]/70 md:mx-0">
            {hero.subheading}
          </p>

          <HeroCTAGroup businessInfo={businessInfo} justify="start" />
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--w-radius)] shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stockPhotoUrl(businessInfo.businessName || "hero", 900, 675)}
            alt=""
            aria-hidden
            loading="eager"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
