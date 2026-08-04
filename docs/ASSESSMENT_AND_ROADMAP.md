# AI Business Launcher - End of Week Launch Plan

## CURRENT STATE ASSESSMENT

### ✅ What's Working
- **Interview flow** — Well-structured questionnaire with 4 questions ✓
- **Architecture** — Clean separation of concerns (businesses → generation → website)
- **UI/UX foundation** — Question cards, progress bar, clean interface
- **TypeScript setup** — Good type safety throughout
- **Component structure** — Modular, maintainable website components

### ❌ Critical Gaps
1. **AI Integration is Broken**
   - Using OpenAI SDK but calling it wrong (`client.responses.create` doesn't exist)
   - Falls back to hardcoded JSON when API key missing
   - No actual Claude API integration
   - **STATUS: Needs complete replacement**

2. **Content Generation is a Stub**
   - No actual copy/menu/reviews generated
   - `service.ts` just echoes business description
   - `buildWebsiteBlueprint` returns basic JSON only
   - **No content pipeline at all**

3. **Website Rendering is Incomplete**
   - Components exist but don't render real content
   - MenuSection, ReviewsSection, GallerySection are empty shells
   - No data flow from AI → sections → rendered HTML
   - **Will look broken to users**

4. **No Publishing**
   - No database to save websites
   - No hosting/deployment story
   - No unique URLs for published sites
   - **No monetization path**

5. **Design System**
   - No real theme system working
   - Hardcoded colors (green for lawn care, black for restaurants)
   - No image generation (listed as "future")
   - **Looks unfinished**

---

## MVP DEFINITION FOR END-OF-WEEK

### Must-Have (Launch Requirements)
1. ✅ Interview questions work (already done)
2. ✅ Business data captured (already done)
3. **Replace OpenAI → Claude API**
4. **Generate real website content**
   - Headline + hero copy
   - 2-3 service/menu items with descriptions
   - 2-3 customer reviews (AI-generated, realistic)
   - Business info (address, phone, CTA)
5. **Website preview renders actual content**
6. **Deploy to Vercel** with working Claude API calls
7. **Basic save/share** (at minimum, screenshot export or simple URL)

### Nice-to-Have (Post-Launch)
- Editing UI
- Database persistence
- Authentication
- Multi-vertical support (plumber, HVAC, etc.)
- Image generation

---

## TECHNICAL TASKS (PRIORITY ORDER)

### Phase 1: AI Integration (24 hours)
**Goal: Swap OpenAI → Claude, build content generation pipeline**

```
1. Replace AI client
   - Install @anthropic-ai/sdk
   - Write new client.ts for Claude API
   - Add ANTHROPIC_API_KEY env var

2. Rebuild prompts (for Claude)
   - Website blueprint selection prompt
   - Hero copy prompt
   - Menu/services prompt
   - Reviews generation prompt
   - SEO metadata prompt

3. Build content generator functions
   - generateHeadline(business)
   - generateHeroCopy(business)
   - generateServices(business, count=3)
   - generateReviews(business, count=3)
   - generateBusinessInfo(business)

4. Wire into generation pipeline
   - Update buildWebsiteBlueprint to return full content
   - Update service.ts to call all generators
   - Handle streaming/async properly
```

**Estimated time: 8-10 hours**

---

### Phase 2: Website Rendering (12 hours)
**Goal: Make website sections display real AI-generated content**

```
1. Update WebsiteContent type
   - Add hero: { headline, copy, cta }
   - Add services: { name, description }[]
   - Add reviews: { text, author, rating }[]
   - Add business: { name, phone, email, address }

2. Refactor section components
   - HeroSection: Use hero.headline + hero.copy
   - MenuSection: Map over menu items array
   - ReviewsSection: Map over reviews array
   - ContactSection: Use business contact info

3. Wire data flow
   - WebsitePreviewWrapper → generateWebsite() → setWebsite()
   - WebsitePreview maps website.sections to components
   - Each component receives typed data

4. Add loading states
   - Show "Generating..." while Claude creates content
   - Progress indicator (content by content)
   - Spinner for smooth UX
```

**Estimated time: 6-8 hours**

---

### Phase 3: Deployment & Polish (12 hours)
**Goal: Live product on Vercel, working end-to-end**

```
1. Environment setup
   - Add ANTHROPIC_API_KEY to Vercel
   - Test API calls in production
   - Add error handling/retry logic

2. Basic persistence (lightweight)
   - Supabase free tier OR Firebase
   - Save website data (business input + generated content)
   - Generate shareable URL (e.g. /website/[id])
   - Simple read-only view for sharing

3. Publishing
   - Add "Copy as HTML" button
   - Users can download standalone HTML
   - Or host on Vercel: auto-create /sites/[id] routes

4. Polish
   - Error messages (API failures, timeouts)
   - Loading animations
   - Mobile responsiveness
   - Footer with branding

5. Deploy
   - Push to Vercel
   - Test full flow end-to-end
   - Prepare demo/landing page
```

**Estimated time: 8-10 hours**

---

## SPECIFIC CODE CHANGES NEEDED

### 1. Replace `src/lib/ai/client.ts`
```typescript
// NEW: Use Anthropic SDK
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callClaude(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5", // Fast + smart
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].type === "text" 
    ? message.content[0].text 
    : "";
}
```

### 2. Rebuild `src/lib/ai/prompts.ts`
```typescript
// BLUEPRINT PROMPT
export function blueprintPrompt(business) {
  return `You are a website architect for small businesses.
  
Business: ${business.name}
Type: ${business.type}
Description: ${business.description}
Location: ${business.address}

Decide the website structure. Return ONLY JSON:
{
  "template": "restaurant|service|other",
  "sections": ["hero", "services", "reviews", "contact"],
  "theme": { "style": "modern|professional|friendly", "color": "#hexcode" }
}`;
}

// HERO COPY PROMPT
export function heroCopyPrompt(business) {
  return `Write a compelling 2-3 sentence hero headline for this business.
  
Business: ${business.name}
Type: ${business.type}
Description: ${business.description}

Return ONLY the headline text, no quotes or explanation.`;
}

// SERVICES PROMPT
export function servicesPrompt(business) {
  return `For a ${business.type} business called "${business.name}", generate 3 services/offerings.
  
Description: ${business.description}

Return ONLY JSON array:
[
  { "name": "Service 1", "description": "One-line description" },
  { "name": "Service 2", "description": "One-line description" },
  { "name": "Service 3", "description": "One-line description" }
]`;
}

// REVIEWS PROMPT
export function reviewsPrompt(business) {
  return `Generate 3 realistic, positive customer reviews for "${business.name}", a ${business.type}.
  
Description: ${business.description}

Return ONLY JSON:
[
  { "text": "Review text", "author": "Name", "rating": 5 },
  ...
]`;
}
```

### 3. New content generation layer
```typescript
// src/lib/ai/generators.ts
import { callClaude } from "./client";
import { blueprintPrompt, heroCopyPrompt, servicesPrompt, reviewsPrompt } from "./prompts";

export async function generateBlueprint(business) {
  const response = await callClaude(blueprintPrompt(business));
  return JSON.parse(response);
}

export async function generateHero(business) {
  return await callClaude(heroCopyPrompt(business));
}

export async function generateServices(business) {
  const response = await callClaude(servicesPrompt(business));
  return JSON.parse(response);
}

export async function generateReviews(business) {
  const response = await callClaude(reviewsPrompt(business));
  return JSON.parse(response);
}
```

### 4. Update generation service
```typescript
// src/features/generation/service.ts
import { generateBlueprint, generateHero, generateServices, generateReviews } from "@/lib/ai/generators";

export async function generateWebsite(business) {
  // Generate all content in parallel
  const [blueprint, hero, services, reviews] = await Promise.all([
    generateBlueprint(business),
    generateHero(business),
    generateServices(business),
    generateReviews(business),
  ]);

  return {
    title: business.name,
    headline: hero,
    description: business.description,
    services,
    reviews,
    blueprint,
    sections: blueprint.sections,
  };
}
```

### 5. Update website components to use data
```typescript
// Example: HeroSection.tsx
export function HeroSection({ data }) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4">{data.headline}</h1>
        <button className="bg-white text-blue-600 px-6 py-3 rounded font-semibold">
          Get Started
        </button>
      </div>
    </section>
  );
}
```

---

## DEPENDENCIES TO ADD

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "supabase": "^2.38.0"  // or Firebase, your choice
  }
}
```

Remove `"openai"` from dependencies.

---

## DEPLOYMENT CHECKLIST

- [ ] Replace OpenAI → Claude
- [ ] All prompts tested + working
- [ ] Content generators return valid JSON
- [ ] Website preview renders real content
- [ ] Error handling for API failures
- [ ] Timeouts + retries for Claude calls
- [ ] Add ANTHROPIC_API_KEY to `.env.local`
- [ ] Test full flow locally (interview → generation → preview)
- [ ] Deploy to Vercel
- [ ] Add env var to Vercel project settings
- [ ] Test live on production URL
- [ ] Basic sharing (URL or HTML export)

---

## TIMELINE

- **Today (6-8 hours):** AI integration + prompts + generators
- **Tomorrow (6-8 hours):** Website rendering + data flow
- **Day 3 (4-6 hours):** Deployment + polish + testing
- **Buffer: 1 day** for fixes/iteration

**Launch window: End of week ✓**

---

## WHAT I'LL BUILD FIRST

I'll start with:
1. New AI client with Anthropic SDK
2. All prompts tested with Claude
3. Content generator functions
4. Integration into `service.ts`

Then hand off sections to you for:
- Component updates
- Deployment configuration
- QA testing

This keeps us moving fast.

---

## QUESTIONS FOR YOU

1. **Database preference?** Supabase, Firebase, or skip for MVP?
2. **How should users save/share?** Unique URL, HTML download, or both?
3. **Launch scope:** Restaurant + lawn care only, or all 6 verticals?
4. **Pricing post-launch:** SaaS subscription, or just free to test?
5. **Design preference:** Modern minimalist, or colorful/branded per business?

Answer these and I'll start building immediately.
