import { WebsiteContent, SectionName } from "@/features/generation/types";
import { themeCssVars } from "../../theme";
import Footer from "../layout/Footer";
import HeroSection from "../HeroSection";
import MenuSection from "../MenuSection";
import ServicesSection from "../ServicesSection";
import GallerySection from "../GallerySection";
import AboutSection from "../AboutSection";
import ReviewsSection from "../ReviewsSection";
import LocationSection from "../LocationSection";
import NavbarExport from "./NavbarExport";
import ContactSectionExport from "./ContactSectionExport";

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
        return <HeroSection key={key} hero={website.hero} businessInfo={website.businessInfo} />;
      case "menu":
        return <MenuSection key={key} services={website.services} />;
      case "services":
        return <ServicesSection key={key} services={website.services} />;
      case "gallery":
        return <GallerySection key={key} gallery={website.gallery} />;
      case "about":
        return <AboutSection key={key} about={website.about} />;
      case "reviews":
        return <ReviewsSection key={key} reviews={website.reviews} />;
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
    </div>
  );
}
