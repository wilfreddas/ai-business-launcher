// src/lib/ai/generators.ts

import { Business } from "@/features/businesses/types";
import { callClaudeJSON } from "./client";
import { getIndustryProfile, resolveIndustryLabel } from "./industryProfiles";
import {
  blueprintPrompt,
  heroPrompt,
  servicesPrompt,
  businessInfoPrompt,
  hoursFormatPrompt,
  aboutPrompt,
  galleryPrompt,
  statsPrompt,
  featuresPrompt,
  processPrompt,
  pricingPrompt,
  faqPrompt,
  chatIntroPrompt,
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
  StatItem,
  FeatureItem,
  ProcessStep,
  PricingTier,
  FAQItem,
  ChatIntro,
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
  StatItem,
  FeatureItem,
  ProcessStep,
  PricingTier,
  FAQItem,
  ChatIntro,
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

// Reviews are no longer AI-generated -- see features/reviews for the real,
// customer-submitted review system that replaced this. (Removed rather than
// left dead: a generator that fabricates "authentic-sounding" testimonials
// is exactly the liability this replaced.)

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

  const [copy, hours] = await Promise.all([
    (async (): Promise<BusinessMarketingCopy> => {
      try {
        return await callClaudeJSON<BusinessMarketingCopy>(
          businessInfoPrompt(business),
          { system: CONTENT_GENERATION_SYSTEM }
        );
      } catch (error) {
        console.error("Business info generation failed:", error);
        return {
          tagline: business.description || "Professional services",
          description: business.description || "Welcome to our business",
          cta: "Get Started",
          ctaDescription: "Contact us today to learn more",
          ctaType: profile.defaultCtaType,
          emergencyAvailable: false,
        };
      }
    })(),
    formatBusinessHours(business.hours),
  ]);

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
    hours,
  };
}

/**
 * Cleans up whatever the owner typed for hours (e.g. "Mon to Fri 9 to 5")
 * into a standard readable format, without changing the actual days/times.
 * Falls back to the raw text on any failure — never blank, never invented.
 */
async function formatBusinessHours(rawHours?: string): Promise<string | undefined> {
  if (!rawHours || !rawHours.trim()) return undefined;
  try {
    const result = await callClaudeJSON<{ hours: string }>(
      hoursFormatPrompt(rawHours),
      { system: CONTENT_GENERATION_SYSTEM, maxTokens: 200 }
    );
    return result.hours?.trim() || rawHours;
  } catch (error) {
    console.error("Hours formatting failed:", error);
    return rawHours;
  }
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
 * Generate gallery captions. NOT called by generateAllContent -- "gallery"
 * was briefly reintroduced as a selectable section, but stockPhoto.ts
 * (Picsum, seeded but keyword-blind) has no way to return photos that
 * actually look like the business's industry, so a "gallery" of random
 * unrelated stock photos looked worse than not having one (this is the
 * second time this exact call has been made — see git history). Kept here
 * in case a real keyword-matched photo source (e.g. the Unsplash API with a
 * free key) gets wired into stockPhoto.ts later.
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

/** Generate the stat-bar entries shown just under the hero. */
export async function generateStats(
  business: Partial<Business>
): Promise<StatItem[]> {
  try {
    return await callClaudeJSON<StatItem[]>(statsPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("Stats generation failed:", error);
    return [
      { value: "100%", label: "Satisfaction Guaranteed" },
      { value: "Free", label: "No-Obligation Quotes" },
    ];
  }
}

/** Generate the "why choose us" feature cards. */
export async function generateFeatures(
  business: Partial<Business>
): Promise<FeatureItem[]> {
  try {
    return await callClaudeJSON<FeatureItem[]>(featuresPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("Features generation failed:", error);
    const industryLabel = resolveIndustryLabel(business);
    return [
      { icon: "✅", title: "Reliable Service", description: `We show up on time and get your ${industryLabel.toLowerCase()} needs done right the first time.` },
      { icon: "💬", title: "Clear Communication", description: "No surprises — you'll always know what to expect." },
      { icon: "⭐", title: "Customer Focused", description: "Your satisfaction is what we measure ourselves by." },
    ];
  }
}

/** Generate the "how it works" numbered process steps. */
export async function generateProcess(
  business: Partial<Business>
): Promise<ProcessStep[]> {
  try {
    return await callClaudeJSON<ProcessStep[]>(processPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("Process generation failed:", error);
    return [
      { title: "Reach Out", description: "Contact us with what you need." },
      { title: "We Confirm Details", description: "We'll follow up to schedule a time that works for you." },
      { title: "We Get It Done", description: "Our team takes care of everything, start to finish." },
    ];
  }
}

/** Generate the pricing tier cards (no fabricated dollar amounts — see pricingPrompt). */
export async function generatePricing(
  business: Partial<Business>
): Promise<PricingTier[]> {
  try {
    return await callClaudeJSON<PricingTier[]>(pricingPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("Pricing generation failed:", error);
    return [
      { name: "Basic", priceLabel: "Get a Custom Quote", features: ["Core service", "Flexible scheduling"], highlighted: false },
      { name: "Standard", priceLabel: "Get a Custom Quote", badge: "Most Popular", features: ["Everything in Basic", "Priority scheduling"], highlighted: true },
      { name: "Premium", priceLabel: "Get a Custom Quote", features: ["Everything in Standard", "Dedicated support"], highlighted: false },
    ];
  }
}

/** Generate the FAQ entries. */
export async function generateFAQ(
  business: Partial<Business>
): Promise<FAQItem[]> {
  try {
    return await callClaudeJSON<FAQItem[]>(faqPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
    });
  } catch (error) {
    console.error("FAQ generation failed:", error);
    return [
      {
        question: "How do I get started?",
        answer: "Reach out using the contact section and we'll follow up to schedule a time that works for you.",
      },
    ];
  }
}

/** Generate the live chat widget's opening greeting + quick replies. */
export async function generateChatIntro(
  business: Partial<Business>
): Promise<ChatIntro> {
  try {
    return await callClaudeJSON<ChatIntro>(chatIntroPrompt(business), {
      system: CONTENT_GENERATION_SYSTEM,
      maxTokens: 300,
    });
  } catch (error) {
    console.error("Chat intro generation failed:", error);
    return {
      greeting: `Hi there! 👋 Welcome to ${business.name || "our site"}. How can I help?`,
      quickReplies: ["What are your hours?", "Do you offer free quotes?", "How do I get in touch?"],
    };
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
 * Generate complete website content. The blueprint runs first (it's what
 * decides which sections this specific business gets), then every other
 * generator runs in parallel -- section-specific generators (stats,
 * features, process, pricing, faq) only actually fire if the blueprint
 * chose that section, so we're not spending tokens/time writing a pricing
 * table for a business whose page won't show one.
 */
export async function generateAllContent(business: Partial<Business>) {
  try {
    const blueprint = await generateBlueprint(business);
    const sections = new Set(blueprint.sections);

    const [
      hero,
      services,
      businessInfo,
      about,
      seo,
      stats,
      features,
      process,
      pricing,
      faq,
    ] = await Promise.all([
      generateHero(business),
      generateServices(business, 6),
      generateBusinessInfo(business),
      generateAbout(business),
      generateSEOMetadata(business),
      sections.has("stats") ? generateStats(business) : Promise.resolve([]),
      sections.has("features") ? generateFeatures(business) : Promise.resolve([]),
      sections.has("process") ? generateProcess(business) : Promise.resolve([]),
      sections.has("pricing") ? generatePricing(business) : Promise.resolve([]),
      sections.has("faq") ? generateFAQ(business) : Promise.resolve([]),
      // chatIntro (generateChatIntro) is deliberately NOT called here -- the
      // live chat widget isn't shown on sites by default (see
      // WebsitePreview's docstring), so there's no reason to spend an API
      // call generating its greeting/quick-replies right now.
    ]);

    return {
      blueprint,
      hero,
      services,
      // Kept as an always-empty array (not removed from the shape) so
      // service.ts/types.ts don't need a wider migration -- see
      // features/reviews for where real reviews actually live now.
      reviews: [] as ReviewItem[],
      businessInfo,
      about,
      gallery: [] as GalleryItem[],
      stats,
      features,
      process,
      pricing,
      faq,
      chatIntro: { greeting: "", quickReplies: [] as string[] },
      seo,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to generate content:", error);
    throw error;
  }
}
