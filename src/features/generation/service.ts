// src/features/generation/service.ts
// REPLACE this file completely

import { Business } from "@/features/businesses/types";
import { generateAllContent } from "@/lib/ai/generators";
import type { WebsiteContent } from "./types";

export type { WebsiteContent } from "./types";

/**
 * Main entry point: Generate complete website content from business info
 */
export async function generateWebsite(
  business: Partial<Business>
): Promise<WebsiteContent> {
  console.log("🚀 Starting website generation for:", business.name);

  try {
    // Generate all content via Claude
    const generatedContent = await generateAllContent(business);

    console.log("✅ Content generation complete");

    // Construct final website content object
    const website: WebsiteContent = {
      // Metadata
      title: business.name || "My Business",
      description: business.description || "",
      
      // Generated content sections
      hero: generatedContent.hero,
      services: generatedContent.services,
      reviews: generatedContent.reviews,
      businessInfo: generatedContent.businessInfo,
      about: generatedContent.about,
      gallery: generatedContent.gallery,
      stats: generatedContent.stats,
      features: generatedContent.features,
      process: generatedContent.process,
      pricing: generatedContent.pricing,
      faq: generatedContent.faq,
      chatIntro: generatedContent.chatIntro,
      blueprint: generatedContent.blueprint,
      seo: generatedContent.seo,
      
      // Theme and structure from blueprint
      sections: generatedContent.blueprint.sections,
      theme: generatedContent.blueprint.theme,
      
      // Metadata
      generatedAt: generatedContent.generatedAt,
      businessType: business.type || "general",
    };

    return website;
  } catch (error) {
    console.error("❌ Website generation failed:", error);
    throw new Error("Failed to generate website content. Please try again.");
  }
}

/**
 * Regenerate specific section (for editing/updates)
 */
export async function regenerateSection(
  business: Partial<Business>,
  section: "hero" | "services" | "reviews" | "businessInfo" | "about" | "gallery"
): Promise<
  WebsiteContent["hero"] | WebsiteContent["services"] | WebsiteContent["reviews"] |
  WebsiteContent["businessInfo"] | WebsiteContent["about"] | WebsiteContent["gallery"]
> {
  switch (section) {
    case "hero": {
      const { generateHero } = await import("@/lib/ai/generators");
      return await generateHero(business);
    }
    case "services": {
      const { generateServices } = await import("@/lib/ai/generators");
      return await generateServices(business, 4);
    }
    case "reviews": {
      const { generateReviews } = await import("@/lib/ai/generators");
      return await generateReviews(business, 3);
    }
    case "businessInfo": {
      const { generateBusinessInfo } = await import("@/lib/ai/generators");
      return await generateBusinessInfo(business);
    }
    case "about": {
      const { generateAbout } = await import("@/lib/ai/generators");
      return await generateAbout(business);
    }
    case "gallery": {
      const { generateGallery } = await import("@/lib/ai/generators");
      return await generateGallery(business, 6);
    }
    default:
      throw new Error(`Unknown section: ${section}`);
  }
}
