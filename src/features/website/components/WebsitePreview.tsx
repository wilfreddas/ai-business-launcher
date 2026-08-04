import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import MenuSection from "./MenuSection";
import ReviewsSection from "./ReviewsSection";
import LocationSection from "./LocationSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import GallerySection from "./GallerySection";

import { WebsiteContent } from "@/features/generation";

export default function WebsitePreview({
    website,
}: {
    website: WebsiteContent;
}) {

    return (
        <div className="min-h-screen">

            <Navbar businessName={website.title} />

            <HeroSection
                title={website.title}
                headline={website.headline}
                description={website.description}
            />


            {website.sections.map((section, index) => {

                switch (section.type) {

                    case "menu":
                        return (
                            <MenuSection key={index} />
                        );

                    case "gallery":
                        return (
                            <GallerySection key={index} />
                        );

                    case "services":
                        return (
                            <ServicesSection
                                key={index}
                                description={section.content}
                            />
                        );

                    case "reviews":
                        return (
                            <ReviewsSection key={index} />
                        );

                    case "location":
                        return (
                            <LocationSection
                                key={index}
                                address={section.content}
                            />
                        );

                    case "contact":
                        return (
                            <ContactSection key={index} />
                        );

                    default:
                        return null;
                }

            })}


            <Footer businessName={website.title} />

        </div>
    );
}