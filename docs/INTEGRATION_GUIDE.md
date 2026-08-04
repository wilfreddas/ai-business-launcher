# Integration Guide: Claude AI Implementation

## Step 1: Install Dependencies

```bash
npm install @anthropic-ai/sdk
```

Remove OpenAI:
```bash
npm remove openai
```

Update your `package.json` dependencies section to include:
```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0"
  }
}
```

---

## Step 2: Set Up Environment Variables

Create/update `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

Get your key from: https://console.anthropic.com/

For development, you can also test without the key (falls back to local responses).

---

## Step 3: File Replacements

### 3a. Replace `src/lib/ai/client.ts`

Copy the complete file from `claude-client.ts` to your project:
```
src/lib/ai/client.ts
```

This replaces the entire file with Anthropic SDK integration.

**Key changes:**
- Uses Anthropic SDK instead of OpenAI
- Exports `callClaude()` and `callClaudeJSON()` functions
- Built-in fallback mode for local development
- Automatic JSON parsing and error recovery

### 3b. Replace `src/lib/ai/prompts.ts`

Copy the complete file from `claude-prompts.ts`:
```
src/lib/ai/prompts.ts
```

**Key changes:**
- 6 specialized prompts (blueprint, hero, services, reviews, business info, SEO)
- System prompt for consistent tone
- Structured JSON output expectations
- Business-type-specific guidance

### 3c. Create `src/lib/ai/generators.ts` (NEW FILE)

Copy the complete file from `generators.ts`:
```
src/lib/ai/generators.ts
```

**This is the new layer that:**
- Calls Claude for each content section
- Returns typed data structures
- Runs all generators in parallel
- Includes error handling and fallbacks

**Exports these functions:**
- `generateBlueprint(business)` → WebsiteBlueprint
- `generateHero(business)` → HeroContent
- `generateServices(business, count)` → ServiceItem[]
- `generateReviews(business, count)` → ReviewItem[]
- `generateBusinessInfo(business)` → BusinessInfo
- `generateSEOMetadata(business)` → SEOMetadata
- `generateAllContent(business)` → All of the above

### 3d. Replace `src/features/generation/service.ts`

Copy from `generation-service.ts`:
```
src/features/generation/service.ts
```

**Key changes:**
- Uses new `generateAllContent()` from generators
- Returns complete `WebsiteContent` object with all sections
- Includes proper error handling
- Has `regenerateSection()` for partial updates

---

## Step 4: Update Type Files

Update `src/features/generation/types.ts` to export the new types:

```typescript
// src/features/generation/types.ts

export interface WebsiteContent {
  title: string;
  description: string;
  hero: HeroContent;
  services: ServiceItem[];
  reviews: ReviewItem[];
  businessInfo: BusinessInfo;
  blueprint: WebsiteBlueprint;
  seo: SEOMetadata;
  sections: string[];
  theme: {
    style: string;
    primaryColor: string;
  };
  generatedAt: string;
  businessType: string;
}

export interface HeroContent {
  headline: string;
  subheading: string;
}

export interface ServiceItem {
  name: string;
  description: string;
}

export interface ReviewItem {
  text: string;
  author: string;
  rating: number;
}

export interface BusinessInfo {
  businessName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  cta: string;
  ctaDescription: string;
}

export interface WebsiteBlueprint {
  template: "restaurant" | "service" | "generic";
  sections: string[];
  theme: {
    style: string;
    primaryColor: string;
  };
  reasoning?: string;
}

export interface SEOMetadata {
  title: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}
```

---

## Step 5: Update Website Components

Update your website rendering components to use the real data.

### Example: HeroSection

**Before (current):**
```typescript
// Renders nothing useful
export function HeroSection() {
  return <h1>Hero Placeholder</h1>;
}
```

**After (with real data):**
```typescript
// Copy from component-examples.tsx
import { HeroContent, BusinessInfo } from "@/lib/ai/generators";

export function HeroSection({ hero, businessInfo }: {
  hero: HeroContent;
  businessInfo: BusinessInfo;
}) {
  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold">{hero.headline}</h1>
          <p className="text-xl text-slate-300">{hero.subheading}</p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold">
            {businessInfo.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
```

Do this for:
- `src/features/website/components/HeroSection.tsx`
- `src/features/website/components/MenuSection.tsx` (same as ServicesSection)
- `src/features/website/components/ServicesSection.tsx`
- `src/features/website/components/ReviewsSection.tsx`
- `src/features/website/components/ContactSection.tsx`

Use the examples in `component-examples.tsx` as reference.

---

## Step 6: Update Website Preview

Update `src/features/website/components/WebsitePreview.tsx` to use real data:

```typescript
import { WebsiteContent } from "@/features/generation/types";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import ReviewsSection from "./ReviewsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

export default function WebsitePreview({ website }: { website: WebsiteContent }) {
  return (
    <div className="bg-white">
      {/* Render meta tags */}
      <head>
        <title>{website.seo.title}</title>
        <meta name="description" content={website.seo.metaDescription} />
        <meta property="og:title" content={website.seo.ogTitle} />
        <meta property="og:description" content={website.seo.ogDescription} />
      </head>

      {/* Render sections dynamically */}
      {website.sections.includes("hero") && (
        <HeroSection hero={website.hero} businessInfo={website.businessInfo} />
      )}

      {website.sections.includes("services") && (
        <ServicesSection services={website.services} />
      )}

      {website.sections.includes("reviews") && (
        <ReviewsSection reviews={website.reviews} />
      )}

      {website.sections.includes("contact") && (
        <ContactSection businessInfo={website.businessInfo} />
      )}

      <Footer businessInfo={website.businessInfo} />
    </div>
  );
}
```

---

## Step 7: Test Locally

### Test without API key (fallback mode):
```bash
# .env.local should NOT have ANTHROPIC_API_KEY
npm run dev
# Visit http://localhost:3000/create
# Go through interview
# Should see fallback content (but it will work!)
```

### Test with API key:
```bash
# Add to .env.local:
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

npm run dev
# Visit http://localhost:3000/create
# Go through interview
# Should see real Claude-generated content
```

### Expected flow:
1. Fill in questionnaire (name, type, description, address)
2. Click "Next" after last question
3. See loading state: "Creating your AI website..."
4. Claude API calls run in parallel
5. Website preview loads with real content

---

## Step 8: Deploy to Vercel

### Add environment variable:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `ANTHROPIC_API_KEY` = your key
5. Redeploy

### Verify:
```bash
git push
# Vercel auto-deploys
# Visit production URL
# Test full flow end-to-end
```

---

## Step 9: Monitor and Debug

### Check Claude API usage:
- https://console.anthropic.com/ → Usage
- Monitor token usage
- Adjust prompts if needed

### Common issues:

**"Invalid JSON response"**
- Claude sometimes adds markdown ``` blocks
- `callClaudeJSON()` strips these automatically
- If still failing, check prompt format

**"API timeout"**
- Claude usually responds in 1-3 seconds
- Check Anthropic status: https://status.anthropic.com/
- Implement client-side timeout UI

**"Empty content sections"**
- Check logs: `console.error()` in generators
- Fallback responses activate if Claude call fails
- Add better error messages to UI

---

## Step 10: Next Steps Post-Launch

### Immediately after launch:
1. ✅ Test all business types (restaurant, lawn care, etc.)
2. ✅ Monitor Claude API costs
3. ✅ Gather user feedback on content quality
4. ✅ Fix any broken sections

### Soon after:
1. Add database persistence (Supabase/Firebase)
2. Implement website saving/publishing
3. Add editing interface
4. Add image generation
5. Add more business verticals

---

## File Summary

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/ai/client.ts` | Anthropic SDK integration | **REPLACE** |
| `src/lib/ai/prompts.ts` | Claude prompts | **REPLACE** |
| `src/lib/ai/generators.ts` | Content generators | **NEW** |
| `src/features/generation/service.ts` | Website generation pipeline | **REPLACE** |
| `src/features/generation/types.ts` | TypeScript interfaces | **UPDATE** |
| Website components | Render real content | **UPDATE** |

---

## Troubleshooting

### Question: Can I test without an API key?
**Answer:** Yes! Fallback mode activates when `ANTHROPIC_API_KEY` is missing. Content will be generic but the flow works.

### Question: Will this work on Vercel?
**Answer:** Yes. Just add the env var to Vercel project settings and redeploy.

### Question: What's the cost?
**Answer:** Claude API costs ~$0.003 per website generation (blueprint + hero + services + reviews + info + SEO in parallel). ~$1 per 333 websites.

### Question: Can users edit the generated content?
**Answer:** Not yet. Post-launch feature. For now, regenerate from settings.

### Question: What if Claude fails?
**Answer:** Falls back to generic content. Users see "Generating..." then generic website instead of error.

---

## Quick Start Checklist

- [ ] Install `@anthropic-ai/sdk`
- [ ] Remove `openai` package
- [ ] Copy `claude-client.ts` → `src/lib/ai/client.ts`
- [ ] Copy `claude-prompts.ts` → `src/lib/ai/prompts.ts`
- [ ] Copy `generators.ts` → `src/lib/ai/generators.ts` (NEW)
- [ ] Copy `generation-service.ts` → `src/features/generation/service.ts`
- [ ] Update component types in `src/features/generation/types.ts`
- [ ] Update HeroSection, ServicesSection, ReviewsSection, ContactSection
- [ ] Update WebsitePreview to render all sections with real data
- [ ] Add `ANTHROPIC_API_KEY` to `.env.local`
- [ ] Test locally: `npm run dev`
- [ ] Test full flow (interview → generation → preview)
- [ ] Deploy to Vercel
- [ ] Add env var to Vercel project
- [ ] Test production URL
- [ ] ✅ Launch!
