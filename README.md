# AI Business Launcher

AI Business Launcher turns a short interview about a small business into a real, working website: a business owner describes their business, Claude designs and writes a full site around it (colors, fonts, section layout, copy — all chosen per-business, not from a fixed template), and the result is a live page they can share immediately or download as a standalone HTML file.

## What it does

1. **Log in** — an optional shared password gate (`SITE_PASSWORD`); once past it, the app shell has two tabs: **Home** (dashboard) and **Create Website**.
2. **Interview** (`/create`) — collects business name, type (or a free-text custom type), description, phone, email, address, and optional hours.
3. **Generate** — a Next.js Server Action calls the Anthropic API. The design blueprint runs first (it decides which 6-9 sections this specific business gets, from a 12-section vocabulary: hero, stats, menu/services, features, process, pricing, about, reviews, faq, location, contact), then every section's content generates in parallel — hero copy, services/menu items, reviews, About, a stat bar, a "Why Choose Us" grid, a "How It Works" process, pricing tiers, an FAQ, and SEO metadata. Real contact details (phone/email/address/hours) always come from what the owner typed — the AI never invents them, and neither pricing dollar amounts nor specific stats/credentials are fabricated (see "Design principle" below).
4. **Publish** — after generation, you land on a success screen with a "View Live Site" link (opens in a new tab) and a link back to the dashboard. The site itself is saved server-side and immediately reachable at `/site/[slug]`, a clean page with no builder UI, meant to look like the business's actual website (working `tel:`/`mailto:` links, a Google Maps "Get Directions" link, a real contact form).
5. **Manage** (`/dashboard`) — lists every generated site with a link, two edit modes (see below), a "Download HTML" export (a self-contained file you can host anywhere), delete, and an internal client-tracking table (sortable by category, created date, and state) for keeping track of who a site was built for.

### Two ways to edit a site

- **Edit Content** (`/edit/[slug]/content`) — direct, no-AI edits: toggle sections on/off and reorder them, edit any text/price/list field. This is the one to reach for when a client asks to remove a section, change a price, or reword something — it's data-only, so it never touches code. Built on three reusable primitives (`EditableFields`, `EditableList`, `SectionToggle` in `src/features/website/components/manage/`) driven by field schemas, so adding editing support for some new piece of content later is "add a schema row," not "write a new form."
- **Regenerate** (`/edit/[slug]`) — reopens the AI interview pre-filled with the business's info; saving regenerates the whole site (design, copy, everything) and overwrites the same live link. Use this for a from-scratch redo, not small tweaks (it can change things you didn't ask it to).

### Design principle: no fabricated facts

Nothing the AI writes is allowed to invent a fact a real customer might rely on. Concretely: contact info is always the owner's real input, never AI text; the stat bar and "Why Choose Us" section only use qualitative claims/guarantees, never invented numbers (client counts, years in business) unless stated in the description; pricing tiers never show a fabricated dollar amount — each tier gets a "Get a Custom Quote"-style label instead (the business owner can type in real prices themselves via Edit Content, since that's no longer the AI guessing); the FAQ is only allowed to answer from the business's actual saved info.

## Tech stack

- **Next.js 16** (App Router, Server Actions, Proxy)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Anthropic API** (`@anthropic-ai/sdk`, model `claude-sonnet-5`) for all content/design generation
- **Upstash Redis** (optional, via Vercel Marketplace) for cross-device site persistence
- **lucide-react** for icons

## Getting started

```bash
npm install
```

Create `.env.local` in the project root:

```bash
# Required — without this, generation silently falls back to placeholder content.
ANTHROPIC_API_KEY=sk-ant-...

# Optional — shared password gate for the whole app (src/proxy.ts).
# Leave unset to keep the app open.
# SITE_PASSWORD=choose-a-password

# Optional — cross-device site storage (src/features/website/storage.ts).
# Set up "Upstash for Redis" via the Vercel Marketplace to get these.
# Without them, sites are kept in memory only (reset on server restart,
# not shared across serverless instances) — fine for local dev, not prod.
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
```

Then:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deploying (Vercel)

1. Import the repo into Vercel (auto-detects Next.js, no config needed).
2. Project Settings → Environment Variables: add `ANTHROPIC_API_KEY` (and `SITE_PASSWORD` if you want the gate) for Production.
3. Project → Storage tab → Create Database → **Upstash** (Redis), so `KV_REST_API_URL`/`KV_REST_API_TOKEN` get set automatically — this is what makes `/site/[slug]` links work from any device, not just the one that created them.
4. Redeploy after adding env vars — they don't apply retroactively.
5. In Settings → Deployment Protection, turn off Vercel's own "Vercel Authentication" for Production if you're using the app's own password gate instead — otherwise visitors hit Vercel's login before ever reaching yours.

## Project structure

```
src/
  app/
    (app)/                Logged-in app shell (shared nav): /dashboard, /create, /edit/[slug], /edit/[slug]/content
    site/[slug]/          Live published site (no app chrome — looks like the business's own site)
    api/contact/          Contact form submission handler
    api/site-chat/        Live chat backend -- built, currently unused (see "Not currently enabled" below)
    login/                Password-gate login page
  features/
    businesses/           Interview questions, form state, Business type
    generation/            AI pipeline entry point (Server Action) + content types
    website/
      components/manage/  Reusable no-code content editor (EditableFields, EditableList, SectionToggle)
      ...                 Section components, theming, storage, static HTML export, ChatWidget (unused)
  lib/
    ai/                    Prompts, generators, Claude client, chat system prompt, industry profiles
    auth/                  Password-gate helpers used by src/proxy.ts
    format.ts              Phone/address display formatting
    rateLimit.ts            In-memory rate limiter for the (currently unused) chat endpoint
```

## Current limitations

- No per-user accounts — the password gate is a single shared password, not individual logins.
- Without Redis configured, saved sites don't survive a server restart or scale across multiple instances.
- Photos are generic stock imagery (Picsum, no signup required), not literal photos of the business — swapping in the Unsplash API for industry-relevant images is a small, isolated change in `src/features/website/stockPhoto.ts` if wanted later.
- Downloaded HTML exports are static: the contact form falls back to a `mailto:` link, since there's no server once the file leaves the app.
- Pricing tiers deliberately never show an AI-invented dollar amount — tiers use "Get a Custom Quote"-style CTAs by default. The business owner can type in real prices via **Edit Content**.
- **Live chat is built but not enabled on any site** (`src/features/website/components/ChatWidget.tsx` + `/api/site-chat`, grounded only in that site's real saved info, with basic per-visitor rate limiting). It's a candidate paid add-on — re-enabling it for a specific site is a small change (render `<ChatWidget>` in `WebsitePreview.tsx` and call `generateChatIntro` again in `generateAllContent`), not a rebuild.
