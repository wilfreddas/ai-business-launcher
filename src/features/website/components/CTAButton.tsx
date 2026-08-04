"use client";

import { Phone } from "lucide-react";
import type { BusinessInfo } from "@/features/generation/types";
import { primaryButtonClass, outlineButtonClass } from "../theme";
import { phoneHref } from "@/lib/format";

interface Props {
  businessInfo: BusinessInfo;
  variant?: "primary" | "outline";
  className?: string;
}

/**
 * Renders the business's main call-to-action as a real, working action:
 * - ctaType "call" -> tel: link (opens phone dialer)
 * - everything else -> smooth-scrolls to the contact section, since there's
 *   no real booking/ordering backend wired up yet.
 */
export default function CTAButton({ businessInfo, variant = "primary", className = "" }: Props) {
  const classes = `${variant === "primary" ? primaryButtonClass : outlineButtonClass} ${className}`;

  if (businessInfo.ctaType === "call" && businessInfo.phone) {
    return (
      <a href={`tel:${phoneHref(businessInfo.phone)}`} className={classes}>
        <Phone className="h-4 w-4" />
        {businessInfo.cta}
      </a>
    );
  }

  return (
    <a href="#contact" className={classes}>
      {businessInfo.cta}
    </a>
  );
}
