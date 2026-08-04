// src/features/website/theme.ts
//
// Turns the AI-chosen WebsiteThemeSpec into CSS custom properties applied at
// the page wrapper, plus a few reusable Tailwind class helpers. Every section
// component reads colors/fonts through these CSS vars so a restaurant and a
// plumber actually render with different palettes/typography/shape language.

import type { CSSProperties } from "react";
import type { WebsiteThemeSpec } from "@/features/generation/types";

const HEADING_FONT_VARS: Record<WebsiteThemeSpec["headingFont"], string> = {
  serif: "var(--font-playfair)",
  display: "var(--font-oswald)",
  friendly: "var(--font-poppins)",
  sans: "var(--font-geist-sans)",
};

const BODY_FONT_VARS: Record<WebsiteThemeSpec["bodyFont"], string> = {
  serif: "var(--font-lora)",
  sans: "var(--font-geist-sans)",
};

// Card / section-level rounding
const RADIUS_VALUES: Record<WebsiteThemeSpec["radius"], string> = {
  none: "2px",
  soft: "0.875rem",
  round: "1.75rem",
};

// Button / pill rounding
const RADIUS_FULL_VALUES: Record<WebsiteThemeSpec["radius"], string> = {
  none: "2px",
  soft: "0.625rem",
  round: "9999px",
};

/**
 * CSS custom properties to spread onto the page wrapper's style prop.
 */
export function themeCssVars(theme: WebsiteThemeSpec): CSSProperties {
  const vars: Record<string, string> = {
    "--w-primary": theme.primaryColor,
    "--w-secondary": theme.secondaryColor,
    "--w-accent": theme.accentColor,
    "--w-bg": theme.backgroundColor,
    "--w-text": theme.textColor,
    "--w-heading-font": HEADING_FONT_VARS[theme.headingFont] ?? HEADING_FONT_VARS.sans,
    "--w-body-font": BODY_FONT_VARS[theme.bodyFont] ?? BODY_FONT_VARS.sans,
    "--w-radius": RADIUS_VALUES[theme.radius] ?? RADIUS_VALUES.soft,
    "--w-radius-full": RADIUS_FULL_VALUES[theme.radius] ?? RADIUS_FULL_VALUES.soft,
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: BODY_FONT_VARS[theme.bodyFont] ?? BODY_FONT_VARS.sans,
  };
  return vars as CSSProperties;
}

/** Apply to headings so they use the AI-chosen heading font. */
export const headingStyle: CSSProperties = {
  fontFamily: "var(--w-heading-font)",
};

/** Solid primary button (main CTA). */
export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[var(--w-radius-full)] bg-[var(--w-primary)] px-6 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90 active:opacity-80";

/** Outline button (secondary CTA), sits on dark or light backgrounds. */
export const outlineButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[var(--w-radius-full)] border-2 border-current px-6 py-3.5 font-semibold transition hover:bg-white/10 active:bg-white/20";

/** Card container used across sections (services, gallery, reviews, etc). */
export const cardClass =
  "rounded-[var(--w-radius)] border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur-sm";

/** Small pill/badge (category tags, trust highlights). */
export const badgeClass =
  "inline-flex items-center rounded-[var(--w-radius-full)] bg-[var(--w-secondary)] px-3 py-1 text-xs font-semibold text-[var(--w-primary)]";

/** Section heading, colored + industry font. */
export const sectionHeadingClass = "text-3xl md:text-4xl font-bold tracking-tight";
