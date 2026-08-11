import { Phone, Mail, MapPin } from "lucide-react";
import { BusinessInfo } from "@/features/generation/types";
import { formatPhoneDisplay, phoneHref } from "@/lib/format";

interface Props {
  businessInfo: BusinessInfo;
}

/**
 * Description + phone/email/address links column, shared by the live
 * contact form (ContactSection) and the standalone export's contact section
 * (ContactSectionExport) -- previously byte-identical JSX duplicated across
 * both files.
 */
export default function ContactInfoList({ businessInfo }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-base leading-relaxed text-[var(--w-text)]/75">{businessInfo.description}</p>

      <div className="space-y-3 text-sm">
        {businessInfo.phone && (
          <a
            href={`tel:${phoneHref(businessInfo.phone)}`}
            className="flex items-center gap-2.5 font-medium hover:text-[var(--w-primary)]"
          >
            <Phone className="h-4 w-4 shrink-0 text-[var(--w-primary)]" />
            {formatPhoneDisplay(businessInfo.phone)}
          </a>
        )}
        {businessInfo.email && (
          <a
            href={`mailto:${businessInfo.email}`}
            className="flex items-center gap-2.5 font-medium hover:text-[var(--w-primary)]"
          >
            <Mail className="h-4 w-4 shrink-0 text-[var(--w-primary)]" />
            {businessInfo.email}
          </a>
        )}
        {businessInfo.address && (
          <p className="flex items-center gap-2.5 font-medium">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--w-primary)]" />
            {businessInfo.address}
          </p>
        )}
      </div>
    </div>
  );
}
