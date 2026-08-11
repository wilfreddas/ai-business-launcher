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

CRITICAL: two different businesses of the SAME type must NOT end up looking the same — this applies to every industry, not just restaurants. A budget mow-and-go lawn crew and a premium landscape design studio are both "lawn care," but should look nothing alike. A 24/7 emergency plumber and a boutique high-end bathroom-remodel plumber are both "plumbing," but should look nothing alike. A solo family-law attorney and a corporate litigation firm are both "legal," but should look nothing alike. Read the actual Business Name and Description above closely for cues about price point, formality, personality, and specialty, and let THOSE specific details drive your choices, not a generic default for the industry. If the description doesn't give you much to go on, make a specific, opinionated choice anyway (not the safest/most average one) rather than converging on whatever a typical business in this industry would pick.

IMPORTANT about color specifically: the "Color direction" hint above names a few example colors to illustrate the STYLE of choice for different sub-types (e.g. bold/saturated vs. muted/refined, warm vs. cool) — it is NOT a menu to literally pick from. Do not default to whichever named color happens to appear in that hint just because it was mentioned. Invent your own specific hex value that fits THIS business's actual name and description, and feel free to land somewhere the hint didn't explicitly name if that's genuinely the better fit.

Make real design decisions:
1. Choose 6-9 sections, in the order they should appear on the page, from this exact vocabulary only: hero, stats, menu, services, features, process, pricing, about, reviews, faq, location, contact. "menu" is ONLY for food businesses. Always start with "hero" and end with "contact". Pick sections that genuinely fit this business — lean on "Sections commonly used for this industry" below, but you're not limited to it if this business calls for something else.
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
Also write a very short trust badge (2-5 words) shown above the headline, e.g. "Now Booking", "Free Estimates", "Family Owned & Operated", or "Serving ${business.address || "the area"}" — something safe and true by design (a service commitment, a location, an offer), never a specific unverifiable claim like a year founded or a client count that isn't stated in the description.

Return ONLY this JSON structure. No other text. No markdown. No explanation:
{
  "headline": "Compelling headline here (8-12 words)",
  "subheading": "Supporting subheading that builds on the headline (1-2 sentences)",
  "badge": "Short trust badge (2-5 words)"
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
 * Reformat whatever the owner typed for business hours into a clean,
 * standard, readable format. This must NOT change or invent days/times —
 * only reformat the ones actually given.
 */
export function hoursFormatPrompt(rawHours: string): string {
  return `Reformat this business hours text into a clean, standard, human-readable format.

Raw input: "${rawHours}"

Rules:
- Do NOT change, add, or remove any days or times — only reformat what's given.
- Abbreviate day names (Mon, Tue, Wed, Thu, Fri, Sat, Sun) and use en-dash ranges like "Mon-Fri".
- Format times as e.g. "9:00 AM - 5:00 PM". Assume typical business hours when a bare number is ambiguous (e.g. "9 to 5" means 9:00 AM - 5:00 PM).
- If multiple day groups have different hours, separate them with a comma.
- If the input is empty, unclear, or already well formatted, return it unchanged.

Return ONLY this JSON. No markdown, no explanation:
{ "hours": "the cleanly formatted hours string" }`;
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
 * Generate a stat bar (3-4 punchy trust indicators shown right under the
 * hero). Deliberately NOT allowed to invent specific numbers (client counts,
 * years in business, jobs completed) that this business never told us —
 * same non-fabrication rule as aboutPrompt's highlights, just formatted as a
 * bold stat-bar entry instead of a bullet.
 */
export function statsPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are writing a stat bar for a small business website — the row of 3-4 bold callouts usually placed right under the hero (like "100% · Satisfaction Guarantee" or "24/7 · Emergency Service").

Business: ${business.name}
Type: ${industryLabel}
Description: ${business.description}

Generate 3-4 stat entries. CRITICAL RULE: do NOT invent a specific unverifiable number (e.g. do not make up "500+ clients", "15 years experience", "1,000 jobs completed") unless that exact fact is stated in the description above. Instead use short, punchy claims that are true by design or genuinely implied by the description — guarantees, commitments, service qualities (e.g. "100%" / "Satisfaction Guaranteed", "Free" / "No-Obligation Quotes", "24/7" / "Emergency Service" [only if description mentions it], "Licensed" / "& Insured" [only if implied]).

Return ONLY this JSON array. No markdown. No explanation:
[
  { "value": "Short bold value (1-4 words, e.g. '100%' or 'Free')", "label": "Short label under it (2-4 words)" }
]`;
}

/**
 * Generate a "why choose us" feature grid (4-6 cards, icon + title + short
 * description). Same non-fabrication posture as About's highlights.
 */
export function featuresPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are writing the "Why Choose Us" section for a ${industryLabel} business website.

Business: ${business.name}
Description: ${business.description}

Generate 4-6 feature/differentiator cards explaining why a customer should choose this business. Keep claims genuinely grounded in the description or in universally-true service commitments (responsiveness, transparency, guarantees) — don't invent specific credentials, certifications, or years of experience that aren't stated.

Return ONLY this JSON array. No markdown. No explanation:
[
  { "icon": "single relevant emoji", "title": "Short title (2-5 words)", "description": "One sentence, benefit-focused" }
]`;
}

/**
 * Generate a "how it works" process section (3-5 numbered steps).
 */
export function processPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are writing a "How It Works" section for a ${industryLabel} business website — the simple numbered steps a customer goes through, from first contact to the job being done.

Business: ${business.name}
Description: ${business.description}

Generate 3-5 steps, in order, describing the customer's actual journey with this specific kind of business.

Return ONLY this JSON array. No markdown. No explanation:
[
  { "title": "Short step title (2-5 words)", "description": "One sentence describing what happens in this step" }
]`;
}

/**
 * Generate pricing tier cards. CRITICAL: the business owner never told us
 * real prices, so this deliberately never asks for (or accepts) a dollar
 * figure — a made-up "$45" a real customer might rely on would be actively
 * misleading. Instead each tier gets a CTA-style priceLabel shown in the
 * same visual slot a price normally occupies.
 */
export function pricingPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are structuring a pricing section for a ${industryLabel} business website.

Business: ${business.name}
Description: ${business.description}

Design 3 tiers (e.g. Basic/Standard/Premium, or names that fit this business better) that clearly communicate different service levels, each with 3-5 feature bullets. CRITICAL: you do NOT know this business's real prices — never invent a dollar amount. Instead, for "priceLabel" use short CTA-style text shown where a price normally would be (e.g. "Get a Custom Quote", "Free Estimate", "Contact for Pricing"), and use "priceNote" for a short qualifier under it if useful (e.g. "no obligation", "response within 24hrs") — omit priceNote if not useful. Mark exactly one tier as the recommended one.

Return ONLY this JSON array of exactly 3 tiers. No markdown. No explanation:
[
  {
    "name": "Tier name",
    "priceLabel": "CTA-style text, never a dollar amount",
    "priceNote": "optional short qualifier",
    "badge": "optional short badge, e.g. 'Most Popular' — only on the recommended tier",
    "features": ["short feature bullet", "..."],
    "highlighted": true or false
  }
]`;
}

/**
 * Generate an FAQ section. Answers must stay grounded in what we actually
 * know (name/type/description/address/hours) plus generic, non-factual
 * reassurance — never invented policies like insurance/warranty/payment
 * terms that weren't stated.
 */
export function faqPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are writing an FAQ section for a ${industryLabel} business website.

Business: ${business.name}
Description: ${business.description}
Location: ${business.address}
Hours: ${business.hours || "not provided"}

Generate 4-6 genuinely useful questions a prospective customer would ask, with concise answers. Only state facts that are given above (location, hours, services implied by the description) or are safe generic reassurance about the process (e.g. "reach out and we'll schedule a time that works for you"). Do NOT invent specific policies this business never mentioned — no fabricated insurance coverage, warranty terms, payment methods, or certifications.

Return ONLY this JSON array. No markdown. No explanation:
[
  { "question": "Question text", "answer": "Concise, helpful answer (1-3 sentences)" }
]`;
}

/**
 * Generate the live chat widget's opening greeting + suggested quick-reply
 * questions. Generated once at site-creation time (cheap, no ongoing cost);
 * the actual conversation replies come from a separate live call per message.
 */
export function chatIntroPrompt(business: Partial<Business>): string {
  const industryLabel = resolveIndustryLabel(business);
  return `You are writing the opening greeting for a website chat widget for a ${industryLabel} business called ${business.name}.

Description: ${business.description}

Write a short, warm one-sentence greeting (as if from a friendly staff member) and 3-4 short quick-reply question buttons a visitor is likely to want answered (e.g. "What are your hours?", "Do you offer free quotes?").

Return ONLY this JSON structure. No markdown. No explanation:
{
  "greeting": "Short warm greeting, 1 sentence, can include one relevant emoji",
  "quickReplies": ["short question", "short question", "short question"]
}`;
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
