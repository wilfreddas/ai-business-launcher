import { Menu } from "lucide-react";
import type { SectionName, BusinessInfo } from "@/features/generation/types";
import { headingStyle } from "../../theme";
import { SECTION_LABELS } from "../../sectionMeta";
import CTAButton from "../CTAButton";

interface Props {
  businessName: string;
  sections: SectionName[];
  businessInfo: BusinessInfo;
}

/**
 * Navbar variant for the standalone HTML export. No React state — the
 * mobile menu uses a native <details>/<summary> disclosure so it still
 * works with zero JavaScript once this leaves the app.
 */
export default function NavbarExport({ businessName, sections, businessInfo }: Props) {
  const links = sections
    .filter((s) => s !== "hero" && SECTION_LABELS[s])
    .map((s) => ({ id: s, label: SECTION_LABELS[s]! }));

  return (
    <nav className="sticky top-0 z-40 border-b border-black/5 bg-[var(--w-bg)]/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#hero" style={headingStyle} className="shrink-0 text-lg font-bold">
          {businessName}
        </a>

        <div className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="hover:text-[var(--w-primary)]">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          {businessInfo.cta && <CTAButton businessInfo={businessInfo} variant="primary" />}
        </div>

        <details className="md:hidden">
          <summary className="flex list-none items-center rounded-md p-2 [&::-webkit-details-marker]:hidden">
            <Menu className="h-6 w-6" />
          </summary>
          <div className="absolute left-0 right-0 border-t border-black/5 bg-[var(--w-bg)] px-4 pb-5 pt-2">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a key={link.id} href={`#${link.id}`} className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-black/5">
                  {link.label}
                </a>
              ))}
            </div>
            {businessInfo.cta && (
              <CTAButton businessInfo={businessInfo} variant="primary" className="mt-3 w-full" />
            )}
          </div>
        </details>
      </div>
    </nav>
  );
}
