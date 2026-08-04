// src/lib/ai/generators.ts

import { Business } from "@/features/businesses/types";
import { callClaudeJSON } from "./client";
import { getIndustryProfile } from "./industryProfiles";
import {
  blueprintPrompt,
  heroPrompt,
  servicesPrompt,
  reviewsPrompt,
  businessInfoPrompt,
  aboutPrompt,
  galleryPrompt,
  seoPrompt,
  CONTENT_GENERATION_SYSTEM,
} from "./prompts";
import type {
  WebsiteBlueprint,
  HeroContent,
  ServiceItem,
  ReviewItem,
  BusinessInfo,
  AboutContent,
  GalleryItem,
  SEOMetadata,
} from "@/features/generation/types";

export type {
  WebsiteBlueprint,
  HeroContent,
  ServiceItem,
  ReviewItem,
  BusinessInfo,
  AboutContent,
  GalleryItem,
  SEOMetadata,
};

function fallbackBlueprint(business: Partial<Business>): WebsiteBlueprint {
  const profile = getIndustryProfile(business.type);
  return {
    template: profile.template,
    sections: profile.availableSections.slice(0, 6) as WebsiteBlueprint["sections"],
    theme: {
      style: "professional",
      primaryColor: "#1F2937",
      secondaryColor: "#F3F4F6",
      accentColor: "#2563EB",
      backgroundColor: "#FFFFFF",
      textColor: "#111827",
      headingFont: "sans",
      bodyFont: "sans",
      radius: "soft",
    },
    reasoning: "Fallback design used because AI generation was unavailable.",
  };
}

/**
 * Generate website blueprint (structure and theme)
 */
export async function generateBlueprint(
  business: Partial<Business>
): Promise<WebsiteBlueprint> {
  try {
    return await callClaudeJSON<WebsiteBlueprint>(
      blueprintPrompt(business),
      { system: CONTENT_GENERATION_SYSTEM }
    );
  } catch (error) {
    console.error("Blueprint generation failed:", error);
    return fallbackBlueprint(business);
  }
}

/**
 * Generate hero section (headline + subheading)
 */
export async function generateHero(
  business: Partial<Business>
): Promise<HeroContent> {
  try {
    return await callClaudeJSON<HeroContent>(heroPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("Hero generation failed:", error);
    return {
      headline: `Welcome to ${business.name}`,
      subheading: business.description || "Professional services for your needs",
    };
  }
}

/**
 * Generate service/menu items
 */
export async function generateServices(
  business: Partial<Business>,
  count: number = 4
): Promise<ServiceItem[]> {
  try {
    return await callClaudeJSON<ServiceItem[]>(
      servicesPrompt(business, count),
      {
        system: CONTENT_GENERATION_SYSTEM,
      }
    );
  } catch (error) {
    console.error("Services generation failed:", error);
    return Array.from({ length: count }, (_, i) => ({
      name: `Service ${i + 1}`,
      description: "Professional and reliable service",
    }));
  }
}

/**
 * Generate customer reviews
 */
export async function generateReviews(
  business: Partial<Business>,
  count: number = 3
): Promise<ReviewItem[]> {
  try {
    return await callClaudeJSON<ReviewItem[]>(
      reviewsPrompt(business, count),
      {
        system: CONTENT_GENERATION_SYSTEM,
      }
    );
  } catch (error) {
    console.error("Reviews generation failed:", error);
    return Array.from({ length: count }, (_, i) => ({
      text: "Excellent service! Highly recommend.",
      author: `Customer ${i + 1}`,
      rating: 5,
    }));
  }
}

/** What we actually ask the AI to write — marketing copy only. */
interface BusinessMarketingCopy {
  tagline: string;
  description: string;
  cta: string;
  ctaDescription: string;
  ctaType: BusinessInfo["ctaType"];
  emergencyAvailable?: boolean;
}

/**
 * Generate business info (marketing copy from AI + real contact details
 * from what the business owner actually entered — never fabricated).
 */
export async function generateBusinessInfo(
  business: Partial<Business>
): Promise<BusinessInfo> {
  const profile = getIndustryProfile(business.type);

  let copy: BusinessMarketingCopy;
  try {
    copy = await callClaudeJSON<BusinessMarketingCopy>(
      businessInfoPrompt(business),
      { system: CONTENT_GENERATION_SYSTEM }
    );
  } catch (error) {
    console.error("Business info generation failed:", error);
    copy = {
      tagline: business.description || "Professional services",
      description: business.description || "Welcome to our business",
      cta: "Get Started",
      ctaDescription: "Contact us today to learn more",
      ctaType: profile.defaultCtaType,
      emergencyAvailable: false,
    };
  }

  return {
    businessName: business.name || "My Business",
    tagline: copy.tagline,
    description: copy.description,
    cta: copy.cta,
    ctaDescription: copy.ctaDescription,
    ctaType: copy.ctaType || profile.defaultCtaType,
    emergencyAvailable: Boolean(copy.emergencyAvailable),
    // Real, user-provided contact info — never AI-generated.
    address: business.address || "",
    phone: business.phone || "",
    email: business.email || "",
    hours: business.hours,
  };
}

/**
 * Generate About section content
 */
export async function generateAbout(
  business: Partial<Business>
): Promise<AboutContent> {
  try {
    return await callClaudeJSON<AboutContent>(aboutPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("About generation failed:", error);
    return {
      heading: "Who We Are",
      body:
        business.description ||
        "We provide reliable, professional service to our customers.",
      highlights: ["Trusted locally", "Professional service", "Customer focused"],
    };
  }
}

/**
 * Generate gallery captions
 */
export async function generateGallery(
  business: Partial<Business>,
  count: number = 6
): Promise<GalleryItem[]> {
  try {
    return await callClaudeJSON<GalleryItem[]>(
      galleryPrompt(business, count),
      { system: CONTENT_GENERATION_SYSTEM }
    );
  } catch (error) {
    console.error("Gallery generation failed:", error);
    return Array.from({ length: count }, (_, i) => ({
      label: `Photo ${i + 1}`,
      caption: "Our work in action.",
    }));
  }
}

/**
 * Generate SEO metadata
 */
export async function generateSEOMetadata(
  business: Partial<Business>
): Promise<SEOMetadata> {
  try {
    return await callClaudeJSON<SEOMetadata>(seoPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("SEO generation failed:", error);
    return {
      title: `${business.name} - Professional Services`,
      metaDescription: business.description || "Professional business services",
      keywords: [
        business.name || "business",
        business.type || "services",
        business.address || "local",
      ],
      ogTitle: `${business.name} - Professional Services`,
      ogDescription: business.description || "Professional business services",
    };
  }
}

/**
 * Generate complete website content (all sections in parallel)
 */
export async function generateAllContent(business: Partial<Business>) {
  try {
    // Run all generators in parallel for speed
    const [blueprint, hero, services, reviews, businessInfo, about, gallery, seo] =
      await Promise.all([
        generateBlueprint(business),
        generateHero(business),
        generateServices(business, 4),
        generateReviews(business, 3),
        generateBusinessInfo(business),
        generateAbout(business),
        generateGallery(business, 6),
        generateSEOMetadata(business),
      ]);

    return {
      blueprint,
      hero,
      services,
      reviews,
      businessInfo,
      about,
      gallery,
      seo,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to generate content:", error);
    throw error;
  }
}
