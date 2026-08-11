import { ServiceItem, WebsiteThemeSpec } from "@/features/generation/types";
import OfferingsSection from "./OfferingsSection";

interface Props {
  services: ServiceItem[];
  style: WebsiteThemeSpec["style"];
}

export default function MenuSection({ services, style }: Props) {
  return (
    <OfferingsSection
      id="menu"
      services={services}
      style={style}
      heading="Our Menu"
      subheading="Made fresh, served with care."
    />
  );
}
