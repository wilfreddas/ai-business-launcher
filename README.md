# AI Business Launcher

AI Business Launcher turns a short interview about a small business into a real, working website: a business owner describes their business, Claude designs and writes a full site around it (colors, fonts, section layout, copy — all chosen per-business, not from a fixed template), and the result is a live page they can share immediately or download as a standalone HTML file.

## What it does

1. **Interview** (`/create`) — collects business name, type (or a free-text custom type), description, phone, email, address, and optional hours.
2. **Generate** — a Next.js Server Action calls the Anthropic API to produce, in parallel: a design blueprint (section order, color palette, font pairing, style), hero copy, services/menu items, customer reviews, an About section, marketing copy/CTA, and SEO metadata. Real contact details (phone/email/address/hours) always come from what the owner typed — the AI never invents them.
3. **Publish** — the generated site is saved server-side and immediately reachable at `/site/[slug]`, a clean page with no builder UI, meant to look like the business's actual website (working `tel:`/`mailto:` links, a Google Maps "Get Directions" link, a real contact form).
4. **Manage** (`/dashboard`) — lists every generated site with a link, a "Download HTML" export (a self-contained file you can host anywhere), delete, and an internal client-tracking table (sortable by category, created date, and state) for keeping track of who a site was built for.

## Tech stack

- **Next.js 16** (App Router, Server Actions, Middleware)
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

# Optional — shared password gate for the whole app (src/middleware.ts).
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
  app/                    Routes: /, /create, /dashboard, /site/[slug], /login, /api/contact
  features/
    businesses/           Interview questions, form state, Business type
    generation/            AI pipeline entry point (Server Action) + content types
    website/               Section components, theming, storage, static HTML export
  lib/
    ai/                    Prompts, generators, Claude client, industry profiles
    auth/                  Password-gate helpers used by middleware
    format.ts              Phone/address display formatting
```

## Current limitations

- No per-user accounts — the password gate is a single shared password, not individual logins.
- Without Redis configured, saved sites don't survive a server restart or scale across multiple instances.
- Photos are generic stock imagery (Picsum, no signup required), not literal photos of the business — swapping in the Unsplash API for industry-relevant images is a small, isolated change in `src/features/website/stockPhoto.ts` if wanted later.
- Downloaded HTML exports are static: the contact form falls back to a `mailto:` link since there's no server once the file leaves the app.
