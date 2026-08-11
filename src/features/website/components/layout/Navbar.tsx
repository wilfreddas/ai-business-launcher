"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { SectionName, BusinessInfo } from "@/features/generation/types";
import { headingStyle } from "../../theme";
import { buildNavLinks } from "../../sectionMeta";
import CTAButton from "../CTAButton";

interface Props {
  businessName: string;
  sections: SectionName[];
  businessInfo: BusinessInfo;
}

export default function Navbar({ businessName, sections, businessInfo }: Props) {
  const [open, setOpen] = useState(false);

  const links = buildNavLinks(sections);

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
          {businessInfo.cta && <CTAButton businessInfo={businessInfo} variant="primary" />}
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
          {businessInfo.cta && (
            <div onClick={() => setOpen(false)}>
              <CTAButton businessInfo={businessInfo} variant="primary" className="mt-3 w-full" />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
