import { Phone } from "lucide-react";
import { WebsiteContent, SectionName } from "@/features/generation/types";
import { themeCssVars } from "../../theme";
import Footer from "../layout/Footer";
import HeroSection from "../HeroSection";
import StatsSection from "../StatsSection";
import MenuSection from "../MenuSection";
import ServicesSection from "../ServicesSection";
import FeaturesSection from "../FeaturesSection";
import ProcessSection from "../ProcessSection";
import PricingSection from "../PricingSection";
import GallerySection from "../GallerySection";
import AboutSection from "../AboutSection";
import ReviewsSection from "../ReviewsSection";
import FAQSection from "../FAQSection";
import LocationSection from "../LocationSection";
import NavbarExport from "./NavbarExport";
import ContactSectionExport from "./ContactSectionExport";
import { formatPhoneDisplay, phoneHref } from "@/lib/format";
import { primaryButtonClass } from "../../theme";

interface Props {
  website: WebsiteContent;
}

/**
 * Same page structure as WebsitePreview, but built entirely from
 * server-render-safe pieces (no useState/fetch) so it can be flattened to
 * static HTML for the downloadable export.
 */
export default function WebsiteExportDocument({ website }: Props) {
  const sections = (website.sections?.length
    ? website.sections
    : ["hero", "services", "reviews", "contact"]) as SectionName[];

  const renderSection = (section: SectionName, key: number) => {
    switch (section) {
      case "hero":
        return (
          <HeroSection
            key={key}
            hero={website.hero}
            businessInfo={website.businessInfo}
            style={website.theme.style}
          />
        );
      case "stats":
        return <StatsSection key={key} stats={website.stats} />;
      case "menu":
        return <MenuSection key={key} services={website.services} style={website.theme.style} />;
      case "services":
        return <ServicesSection key={key} services={website.services} style={website.theme.style} />;
      case "features":
        return <FeaturesSection key={key} features={website.features} style={website.theme.style} />;
      case "process":
        return <ProcessSection key={key} steps={website.process} />;
      case "pricing":
        return <PricingSection key={key} tiers={website.pricing} />;
      case "gallery":
        return <GallerySection key={key} gallery={website.gallery} />;
      case "about":
        return <AboutSection key={key} about={website.about} />;
      case "reviews":
        return <ReviewsSection key={key} reviews={website.reviews} />;
      case "faq":
        return <FAQSection key={key} faq={website.faq} />;
      case "location":
        return <LocationSection key={key} businessInfo={website.businessInfo} />;
      case "contact":
        return <ContactSectionExport key={key} businessInfo={website.businessInfo} />;
      default:
        return null;
    }
  };

  return (
    <div id="website-root" style={themeCssVars(website.theme)}>
      <NavbarExport businessName={website.title} sections={sections} businessInfo={website.businessInfo} />
      <main>{sections.map((section, idx) => renderSection(section, idx))}</main>
      <Footer businessName={website.title} businessInfo={website.businessInfo} />

      {/* Downloaded exports have no server behind them, so there's no live
          chat here (see ChatWidget) -- a direct call button instead. */}
      {website.businessInfo?.phone && (
        <a
          href={`tel:${phoneHref(website.businessInfo.phone)}`}
          className={`${primaryButtonClass} fixed bottom-5 right-5 z-50 !rounded-full !px-5 !py-3.5 shadow-lg`}
        >
          <Phone className="h-4 w-4" />
          {formatPhoneDisplay(website.businessInfo.phone)}
        </a>
      )}
    </div>
  );
}
