import { ServiceItem, WebsiteThemeSpec } from "@/features/generation/types";
import OfferingsSection from "./OfferingsSection";

interface Props {
  services: ServiceItem[];
  style: WebsiteThemeSpec["style"];
}

export default function ServicesSection({ services, style }: Props) {
  return (
    <OfferingsSection
      id="services"
      services={services}
      style={style}
      heading="Our Services"
      subheading="What we can do for you."
    />
  );
}
