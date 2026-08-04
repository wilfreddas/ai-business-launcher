// src/lib/ai/prompts.ts

import { Business } from "@/features/businesses/types";
import { getIndustryProfile, resolveIndustryLabel } from "./industryProfiles";

/**
 * Generate website blueprint (structure, sections, full theme).
 * This is the single most important prompt: it's what makes a restaurant
 * website and a plumber website actually look different from each other.
 */
export function blueprintPrompt(business: Partial<Business>): string {
  const profile = getIndustryProfile(business.type);
  const industryLabel = resolveIndustryLabel(business);

  return `You are a senior web designer who specializes in small-business websites. You are designing the website for ONE specific business, not a generic template.

Business Name: ${business.name}
Business Type: ${industryLabel}
Description: ${business.description}
Location: ${business.address}

Industry context (use as inspiration, not a rulebook — deviate if this specific business calls for it):
- Sections commonly used for this industry: ${profile.availableSections.join(", ")}
- Mood: ${profile.moodHints}
- Color direction: ${profile.colorHints}
- Font direction: ${profile.fontHints}
- Typical primary call-to-action: ${profile.defaultCtaType}

Make real design decisions:
1. Choose 4-7 sections, in the order they should appear on the page, from this exact vocabulary only: hero, menu, services, gallery, about, reviews, location, contact. "menu" is ONLY for food businesses. Always start with "hero" and end with "contact".
2. Pick a full color palette as hex codes: a primaryColor (main brand color, used for buttons/accents), a secondaryColor (supporting color, often a light neutral or tint), an accentColor (a pop color for highlights/badges, can equal primary if that's the best choice), a backgroundColor (page background, usually white or a very light tint — must have strong contrast with textColor), and a textColor (body text color, near-black or near-white depending on backgroundColor). All hex codes must be valid 6-digit hex like "#1F3A2E". Ensure primaryColor has enough contrast against white text to be used on solid buttons.
3. Pick headingFont: one of "serif" (elegant/traditional), "display" (bold/industrial/condensed), "friendly" (rounded/approachable), or "sans" (clean/modern/minimal) — pick whichever actually fits this business.
4. Pick bodyFont: "serif" or "sans" — usually "sans" for readability unless the brand is distinctly editorial/literary.
5. Pick radius: "none" (sharp corners, formal/legal), "soft" (default, most businesses), or "round" (very rounded, playful/friendly).
6. Pick style: one word summary — "modern", "professional", "friendly", "luxury", "bold", or "minimal".
7. Write a one-sentence "reasoning" explaining the design choice in plain English, referencing this specific business.

Return ONLY valid JSON (no markdown, no explanation outside the JSON):
{
  "template": "restaurant" | "lawn_care" | "plumbing" | "electrical" | "hvac" | "cleaning" | "dental" | "legal" | "service" | "generic",
  "sections": ["hero", "...", "contact"],
  "theme": {
    "style": "modern" | "professional" | "friendly" | "luxury" | "bold" | "minimal",
    "primaryColor": "#hexcode",
    "secondaryColor": "#hexcode",
    "accentColor": "#hexcode",
    "backgroundColor": "#hexcode",
    "textColor": "#hexcode",
    "headingFont": "serif" | "sans" | "display" | "friendly",
    "bodyFont": "serif" | "sans",
    "radius": "none" | "soft" | "round"
  },
  "reasoning": "One sentence explaining why this design fits this specific business."
}`;
}

/**
 * Generate hero headline and subheading
 * CRITICAL: Must return JSON
 */
export function heroPrompt(business: Partial<Business>): string {
  const profile = getIndustryProfile(business.type);
  const industryLabel = resolveIndustryLabel(business);
  return `You are a copywriter specializing in small business websites.

Business: ${business.name}
Type: ${industryLabel}
Description: ${business.description}
Location: ${business.address}

Write an attention-grabbing hero headline (8-12 words max) for this business's website.
Follow with a 1-2 sentence supporting subheading that emphasizes their unique value.

Return ONLY this JSON structure. No other text. No markdown. No explanation:
{
  "headline": "Compelling headline here (8-12 words)",
  "subheading": "Supporting subheading that builds on the headline (1-2 sentences)"
}

Be specific to THIS business (use details from the description, not generic filler). Make it memorable and action-oriented. Mood: ${profile.moodHints}`;
}

/**
 * Generate service/menu items with descriptions
 * CRITICAL: Must return JSON array
 */
export function servicesPrompt(
  business: Partial<Business>,
  count: number = 4
): string {
  const isRestaurant = business.type === "restaurant";
  const industryLabel = resolveIndustryLabel(business);

  const itemType = isRestaurant ? "menu items" : "services";
  const itemLabel = isRestaurant ? "dish" : "service";

  return `You are a marketing writer for small businesses.

Business: ${business.name}
Type: ${industryLabel}
Description: ${business.description}

Generate ${count} realistic ${itemType} that this business offers.
Each should have a compelling name, a 1-2 sentence description, and if natural, a short "category" label${isRestaurant ? ' (e.g. "Starters", "Mains", "Desserts", "Drinks")' : ' (e.g. "Most Popular", "Maintenance", "Emergency", "Add-on")'} and an approximate "price" string (e.g. "$18" or "From $89") when it's realistic to show a price for this kind of business — omit price if it genuinely wouldn't be shown publicly.

Return ONLY this JSON array. No markdown. No explanation:
[
  {
    "name": "${itemLabel} name",
    "description": "Brief, compelling description",
    "category": "optional category label",
    "price": "optional price string"
  }
]

${isRestaurant ? "Include items that showcase real variety in cuisine/preparation, across more than one category." : "Include services that address the specific needs described for this business, not generic filler."}
Make descriptions benefit-focused, not feature-focused.`;
}

/**
 * Generate customer reviews (social proof)
 * CRITICAL: Must return JSON array
 */
export function reviewsPrompt(
  business: Partial<Business>,
  count: number = 3
): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are a marketing specialist. Generate realistic customer reviews for a ${industryLabel} business.

Business: ${business.name}
Description: ${business.description}

Create ${count} positive, authentic-sounding customer reviews that highlight different benefits.
Each review should be 1-2 sentences.

Return ONLY this JSON array. No markdown. No explanation:
[
  {
    "text": "Customer review here (1-2 sentences)",
    "author": "First name only",
    "rating": 5
  }
]

Make reviews specific and credible - mention actual benefits, not generic praise.
Vary the review themes (quality, service speed, customer service, value, etc) and vary ratings slightly (mostly 5, the occasional 4 reads as more credible).`;
}

/**
 * Generate business marketing copy (tagline, description, CTA).
 * CRITICAL: Must return JSON
 *
 * Deliberately does NOT ask the model to invent phone/email/address/hours —
 * those come from what the business owner actually entered, since a fake
 * phone number on a real customer-facing website would be actively harmful.
 */
export function businessInfoPrompt(business: Partial<Business>): string {
  const profile = getIndustryProfile(business.type);
  const industryLabel = resolveIndustryLabel(business);
  return `You are creating marketing copy for a business profile.

Business: ${business.name}
Type: ${industryLabel}
Description: ${business.description}

Generate marketing copy and call-to-action text.
The typical CTA type for this industry is "${profile.defaultCtaType}" but choose whichever of call/quote/book/order/contact is genuinely the best fit for this specific business.

Return ONLY this JSON structure. No markdown. No explanation:
{
  "tagline": "One-line tagline describing the business",
  "description": "2-3 sentence business description used in the contact section",
  "cta": "Call to action button text (e.g., 'Get a Free Quote', 'Book a Table', 'Call Now', 'Order Online')",
  "ctaDescription": "Brief description of what happens when they click CTA",
  "ctaType": "call" | "quote" | "book" | "order" | "contact",
  "emergencyAvailable": true or false — set true ONLY if the business description itself mentions 24/7, emergency, or urgent/same-day service. Default to false otherwise; do not guess.
}

Make everything professional and specific to the business type. Do not invent contact details — none are requested here.`;
}

/**
 * Generate the About section content
 */
export function aboutPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are a brand copywriter.

Business: ${business.name}
Type: ${industryLabel}
Description: ${business.description}
Location: ${business.address}

Write the "About" section for this business's website.

Return ONLY this JSON structure. No markdown. No explanation:
{
  "heading": "Short section heading (3-6 words, not literally 'About Us')",
  "body": "2-4 sentence story/description building trust and credibility, specific to this business",
  "highlights": ["3-4 short trust badges/highlights, e.g. 'Licensed & Insured', '15+ Years Experience', 'Locally Owned'"]
}

Keep highlights genuinely relevant to a ${industryLabel} business, and don't state anything as fact (like years in business or certifications) that isn't implied by the description.`;
}

/**
 * Generate gallery captions (used for styled placeholder imagery until real
 * photo/image generation is wired up).
 */
export function galleryPrompt(
  business: Partial<Business>,
  count: number = 6
): string {
  const industryLabel = resolveIndustryLabel(business);
  const isBeforeAfter = business.type === "lawn_care" || business.type === "landscaping" || business.type === "cleaning";
  return `You are curating a website photo gallery for a ${industryLabel} business called ${business.name}.
Description: ${business.description}

Generate ${count} short captions describing photos this business would realistically show on their website${isBeforeAfter ? " (favor before/after transformation shots where relevant)" : ""}.

Return ONLY this JSON array. No markdown. No explanation:
[
  {
    "label": "Very short label, 2-4 words, e.g. 'Fresh Cut Lawn' or 'Dining Room'",
    "caption": "One short descriptive sentence about what the photo shows"
  }
]`;
}

/**
 * Generate SEO metadata
 * CRITICAL: Must return JSON
 */
export function seoPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are an SEO specialist.

Business: ${business.name}
Type: ${industryLabel}
Location: ${business.address}
Description: ${business.description}

Generate SEO metadata for this business website.

Return ONLY this JSON structure. No markdown. No explanation:
{
  "title": "SEO title (50-60 chars)",
  "metaDescription": "Meta description (155-160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "ogTitle": "Open Graph title",
  "ogDescription": "Open Graph description"
}

Include location-based keywords where relevant.
Make titles and descriptions compelling for click-through in search results.`;
}

/**
 * System prompt for all content generation
 */
export const CONTENT_GENERATION_SYSTEM = `You are an expert website copywriter and designer for small businesses.
Your goal is to create compelling, professional content and design decisions that make each business's website feel genuinely different from every other business's website, tailored to their specific industry and description.
You MUST return ONLY valid JSON when asked.
You MUST NOT include any markdown code blocks like \`\`\`json.
You MUST NOT include any explanation or extra text.
Always:
- Be specific and benefit-focused, referencing real details from the business description
- Use active voice and power words
- Create urgency and trust
- Adapt tone, color, and structure to the business type
- Keep content concise and scannable
- Never default to the same generic choices across different businesses
- Never invent factual claims (contact details, credentials, years in business) that aren't supported by what you were told`;
