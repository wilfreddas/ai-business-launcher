import { BusinessInfo, HeroContent } from "@/features/generation/types";

interface Props {
  hero: HeroContent;
  businessInfo: BusinessInfo;
  /** "dark" for hero photo backdrops (white/blur pill), "light" for the split/refined hero (brand-colored pill). */
  tone: "dark" | "light";
  justify?: "center" | "start";
}

/**
 * Badge + "24/7 Emergency Service" pill row, shared by both Hero layouts
 * (PhotoBackdropHero and SplitHero) -- previously duplicated verbatim aside
 * from color treatment.
 */
export default function HeroBadgeRow({ hero, businessInfo, tone, justify = "center" }: Props) {
  if (!hero.badge && !businessInfo.emergencyAvailable) return null;

  const pillClass =
    tone === "dark"
      ? "inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm"
      : "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide";
  const pillStyle = tone === "light" ? { backgroundColor: "var(--w-secondary)", color: "var(--w-primary)" } : undefined;

  return (
    <div
      className={`mb-5 flex flex-wrap items-center justify-center gap-2 ${
        justify === "start" ? "md:justify-start" : ""
      }`}
    >
      {hero.badge && (
        <span className={pillClass} style={pillStyle}>
          {hero.badge}
        </span>
      )}
      {businessInfo.emergencyAvailable && (
        <span className={pillClass} style={pillStyle}>
          24/7 Emergency Service
        </span>
      )}
    </div>
  );
}
