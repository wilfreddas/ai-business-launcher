"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import type { SectionName, BusinessInfo } from "@/features/generation/types";
import { headingStyle, primaryButtonClass } from "../../theme";

const SECTION_LABELS: Partial<Record<SectionName, string>> = {
  menu: "Menu",
  services: "Services",
  gallery: "Gallery",
  about: "About",
  reviews: "Reviews",
  location: "Location",
  contact: "Contact",
};

interface Props {
  businessName: string;
  sections: SectionName[];
  businessInfo: BusinessInfo;
}

export default function Navbar({ businessName, sections, businessInfo }: Props) {
  const [open, setOpen] = useState(false);

  const links = sections
    .filter((s) => s !== "hero" && SECTION_LABELS[s])
    .map((s) => ({ id: s, label: SECTION_LABELS[s]! }));

  return (
    <nav className="sticky top-0 z-40 border-b border-black/5 bg-[var(--w-bg)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#hero" style={headingStyle} className="text-lg font-bold shrink-0">
          {businessName}
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="hover:text-[var(--w-primary)]">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          {businessInfo.phone && (
            <a href={`tel:${businessInfo.phone.replace(/[^\d+]/g, "")}`} className={primaryButtonClass}>
              <Phone className="h-4 w-4" />
              {businessInfo.phone}
            </a>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-md p-2 text-[var(--w-text)] md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-black/5 px-4 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-black/5"
              >
                {link.label}
              </a>
            ))}
          </div>
          {businessInfo.phone && (
            <a
              href={`tel:${businessInfo.phone.replace(/[^\d+]/g, "")}`}
              onClick={() => setOpen(false)}
              className={`${primaryButtonClass} mt-3 w-full`}
            >
              <Phone className="h-4 w-4" />
              {businessInfo.phone}
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
