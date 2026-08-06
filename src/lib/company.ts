// src/lib/company.ts
//
// Single source of truth for the public marketing site's copy/branding
// (src/app/page.tsx). The company name isn't finalized yet -- change
// everything in this one file once it is; nothing else needs to change.
//
// STREAMS is the "different streams later" structure: each entry is a
// service line. Adding Social Media Boosting, Review Management, or
// anything else later is adding one object here, not building a new page.

export const COMPANY = {
  // TODO: swap once you + Aaron settle on a name.
  name: "Your Company Name",
  tagline: "AI-generated websites for local businesses, live in minutes.",
  // TODO: swap for a real inbox/number once you have one you want public.
  email: "hello@example.com",
  phone: "",
};

export interface Stream {
  name: string;
  description: string;
  status: "live" | "coming_soon";
}

// Add a new stream here whenever a new service actually launches -- the
// "coming soon" status still exists to support that, it's just not used to
// advertise anything unreleased yet.
export const STREAMS: Stream[] = [
  {
    name: "AI Website Generation",
    description:
      "A short interview in, a real, working website out — designed, written, and launched by AI in minutes, not weeks.",
    status: "live",
  },
];

export interface PortfolioItem {
  name: string;
  url: string;
  category: string;
}

// Example builds shown as proof of work. Swap or remove any of these --
// flag it if any shouldn't be public.
export const PORTFOLIO: PortfolioItem[] = [
  { name: "Bella Vista", url: "https://bella-vista-nu.vercel.app", category: "Restaurant" },
  { name: "RaceWash", url: "https://racewash.vercel.app", category: "Auto detailing" },
  { name: "Lawn King", url: "https://lawnking.vercel.app", category: "Lawn care" },
  { name: "Clearwater Medical", url: "https://clearwater-medical.vercel.app", category: "Medical practice" },
];
