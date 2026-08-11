import { Phone } from "lucide-react";
import { BusinessInfo } from "@/features/generation/types";
import { outlineButtonClass } from "../theme";
import { formatPhoneDisplay, phoneHref } from "@/lib/format";
import CTAButton from "./CTAButton";

interface Props {
  businessInfo: BusinessInfo;
  primaryClassName?: string;
  justify?: "center" | "start";
}

/**
 * Primary CTA button + optional "call" outline button, shared by both Hero
 * layouts -- previously duplicated verbatim aside from the primary button's
 * className.
 */
export default function HeroCTAGroup({ businessInfo, primaryClassName, justify = "center" }: Props) {
  return (
    <div
      className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row ${
        justify === "start" ? "md:justify-start" : ""
      }`}
    >
      <CTAButton businessInfo={businessInfo} variant="primary" className={primaryClassName ?? "w-full sm:w-auto"} />

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
  );
}
