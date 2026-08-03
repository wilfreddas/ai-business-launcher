import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

import { WebsiteContent } from "@/features/generation";

export default function WebsitePreview({
  website,
}: {
  website: WebsiteContent;
}) {
  return (
    <div className="min-h-screen bg-white">

      <Navbar businessName={website.title} />

      <HeroSection
        title={website.title}
        headline={website.headline}
        description={website.description}
      />

      <ServicesSection
        description={website.description}
      />

      <AboutSection />

      <ContactSection />

      <Footer
        businessName={website.title}
      />

    </div>
  );
}