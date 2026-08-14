"use client";

import { WebsiteContent, SectionName } from "@/features/generation/types";
import type { CustomerReview } from "@/features/reviews/types";
import { themeCssVars } from "../theme";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import MenuSection from "./MenuSection";
import ServicesSection from "./ServicesSection";
import FeaturesSection from "./FeaturesSection";
import ProcessSection from "./ProcessSection";
import PricingSection from "./PricingSection";
import GallerySection from "./GallerySection";
import AboutSection from "./AboutSection";
import ReviewsSection from "./ReviewsSection";
import FAQSection from "./FAQSection";
import LocationSection from "./LocationSection";
import ContactSection from "./ContactSection";
import Reveal from "./Reveal";
import ScrollToTopButton from "@/components/ScrollToTopButton";

interface Props {
  website: WebsiteContent;
  /** Used to link the footer's Privacy Policy to /site/[slug]/privacy, and
   * to submit new reviews against the right site. */
  slug: string;
  /** Real, approved customer reviews -- fetched server-side by the page,
   * not part of WebsiteContent (see features/reviews). */
  reviews: CustomerReview[];
  /** Scheduling add-on -- see features/accounts + features/scheduling. Off by default. */
  schedulingEnabled?: boolean;
}

/**
 * Renders whichever sections the AI blueprint chose, in the order it chose,
 * so different businesses genuinely produce different page layouts instead
 * of the same fixed section list every time.
 *
 * Note: the live chat widget (ChatWidget.tsx + /api/site-chat) is built but
 * deliberately not rendered here -- it's a candidate paid add-on feature
 * rather than something every site gets by default.
 */
export default function WebsitePreview({ website, slug, reviews, schedulingEnabled }: Props) {
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
        return <ReviewsSection key={key} reviews={reviews} slug={slug} />;
      case "faq":
        return <FAQSection key={key} faq={website.faq} />;
      case "location":
        return <LocationSection key={key} businessInfo={website.businessInfo} />;
      case "contact":
        return <ContactSection key={key} businessInfo={website.businessInfo} />;
      default:
        return null;
    }
  };

  return (
    <div style={themeCssVars(website.theme)} className="min-h-screen">
      <Navbar businessName={website.title} sections={sections} businessInfo={website.businessInfo} />

      <main>
        {sections.map((section, idx) =>
          section === "hero" ? (
            renderSection(section, idx)
          ) : (
            <Reveal key={idx}>{renderSection(section, idx)}</Reveal>
          )
        )}
      </main>

      <Footer
        businessName={website.title}
        businessInfo={website.businessInfo}
        slug={slug}
        schedulingEnabled={schedulingEnabled}
      />

      <ScrollToTopButton className="bg-[var(--w-primary)] text-white" />
    </div>
  );
}
