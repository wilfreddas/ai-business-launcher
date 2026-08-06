"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Loader2, Save } from "lucide-react";
import type {
  WebsiteContent,
  SectionName,
  HeroContent,
  AboutContent,
  ServiceItem,
  StatItem,
  FeatureItem,
  ProcessStep,
  PricingTier,
  FAQItem,
  ReviewItem,
  BusinessInfo,
} from "@/features/generation/types";
import { updateSiteContentAction } from "../../actions";
import SectionToggle from "./SectionToggle";
import EditableFields from "./EditableFields";
import EditableList from "./EditableList";
import EditorCard from "./EditorCard";
import type { FieldSchema } from "./fieldTypes";

// Field schemas live here, next to the one place they're used. Adding
// support for editing some new piece of content is "add a row to one of
// these arrays" -- not a new form component.

const HERO_FIELDS: FieldSchema<HeroContent>[] = [
  { key: "headline", label: "Headline", type: "text" },
  { key: "subheading", label: "Subheading", type: "textarea" },
  { key: "badge", label: "Trust badge", type: "text", placeholder: "e.g. Now Booking" },
];

const ABOUT_FIELDS: FieldSchema<AboutContent>[] = [
  { key: "heading", label: "Heading", type: "text" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "highlights", label: "Highlights", type: "stringlist" },
];

const BUSINESS_INFO_FIELDS: FieldSchema<BusinessInfo>[] = [
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "cta", label: "Call-to-action button text", type: "text" },
  { key: "ctaDescription", label: "CTA description", type: "text" },
  {
    key: "ctaType",
    label: "What the CTA button does",
    type: "select",
    options: [
      { label: "Call (tel: link)", value: "call" },
      { label: "Request a Quote", value: "quote" },
      { label: "Book", value: "book" },
      { label: "Order", value: "order" },
      { label: "Contact / scroll to form", value: "contact" },
    ],
  },
];

// Real facts, not marketing copy -- kept as a separate schema so it's
// obviously the "fix a typo'd phone number" section, not part of the AI's
// copywriting. Saving these updates both what's shown on the live site and
// the underlying business record (see updateSiteContentAction).
const CONTACT_FIELDS: FieldSchema<BusinessInfo>[] = [
  { key: "phone", label: "Phone", type: "text", placeholder: "(555) 123-4567" },
  { key: "email", label: "Email", type: "text", placeholder: "hello@yourbusiness.com" },
  { key: "address", label: "Address", type: "text", placeholder: "Albany, NY" },
  { key: "hours", label: "Hours", type: "text", placeholder: "Mon-Fri 9:00 AM - 5:00 PM" },
];

const SERVICE_FIELDS: FieldSchema<ServiceItem>[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "category", label: "Category (optional)", type: "text" },
  { key: "price", label: "Price (optional)", type: "text", placeholder: "e.g. $18 or From $89" },
];

const STAT_FIELDS: FieldSchema<StatItem>[] = [
  { key: "value", label: "Value", type: "text", placeholder: "e.g. 100%" },
  { key: "label", label: "Label", type: "text", placeholder: "e.g. Satisfaction Guaranteed" },
];

const FEATURE_FIELDS: FieldSchema<FeatureItem>[] = [
  { key: "icon", label: "Icon (emoji)", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
];

const PROCESS_FIELDS: FieldSchema<ProcessStep>[] = [
  { key: "title", label: "Step title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
];

const PRICING_FIELDS: FieldSchema<PricingTier>[] = [
  { key: "name", label: "Tier name", type: "text" },
  {
    key: "priceLabel",
    label: "Price / CTA text",
    type: "text",
    placeholder: "e.g. Get a Custom Quote — or a real price like $45/visit",
  },
  { key: "priceNote", label: "Price note (optional)", type: "text", placeholder: "e.g. no obligation" },
  { key: "badge", label: "Badge (optional)", type: "text", placeholder: "e.g. Most Popular" },
  { key: "features", label: "Features", type: "stringlist" },
  { key: "highlighted", label: "Highlight this tier", type: "boolean" },
];

const FAQ_FIELDS: FieldSchema<FAQItem>[] = [
  { key: "question", label: "Question", type: "text" },
  { key: "answer", label: "Answer", type: "textarea" },
];

const REVIEW_FIELDS: FieldSchema<ReviewItem>[] = [
  { key: "text", label: "Review text", type: "textarea" },
  { key: "author", label: "Author (first name)", type: "text" },
  { key: "rating", label: "Rating (1-5)", type: "number" },
];

export default function ContentEditor({
  slug,
  initialWebsite,
}: {
  slug: string;
  initialWebsite: WebsiteContent;
}) {
  const [website, setWebsite] = useState<WebsiteContent>(initialWebsite);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof WebsiteContent>(key: K, value: WebsiteContent[K]) {
    setWebsite((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        // stringlist fields can pick up a trailing blank line while typing
        // (see FieldInput) -- clean those up before persisting.
        const cleaned: WebsiteContent = {
          ...website,
          about: {
            ...website.about,
            highlights: (website.about.highlights || []).map((s) => s.trim()).filter(Boolean),
          },
          pricing: website.pricing.map((tier) => ({
            ...tier,
            features: (tier.features || []).map((s) => s.trim()).filter(Boolean),
          })),
        };
        await updateSiteContentAction(slug, cleaned);
        setWebsite(cleaned);
        setSaved(true);
      } catch (err) {
        setError("Failed to save changes. Please try again.");
        console.error(err);
      }
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold">Edit Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          Direct edits, no AI involved — change text, prices, or which sections show, then save.
        </p>
      </div>

      <EditorCard title="Sections" description="Turn sections on/off or reorder them.">
        <SectionToggle
          sections={website.sections as SectionName[]}
          onChange={(sections) => update("sections", sections)}
        />
      </EditorCard>

      <EditorCard title="Hero">
        <EditableFields value={website.hero} onChange={(v) => update("hero", v)} fields={HERO_FIELDS} />
      </EditorCard>

      <EditorCard title="Contact Info" description="Fixing a typo here doesn't require a full AI regenerate.">
        <EditableFields
          value={website.businessInfo}
          onChange={(v) => update("businessInfo", v)}
          fields={CONTACT_FIELDS}
        />
      </EditorCard>

      <EditorCard title="Business info & call-to-action">
        <EditableFields
          value={website.businessInfo}
          onChange={(v) => update("businessInfo", v)}
          fields={BUSINESS_INFO_FIELDS}
        />
      </EditorCard>

      <EditorCard title="About">
        <EditableFields value={website.about} onChange={(v) => update("about", v)} fields={ABOUT_FIELDS} />
      </EditorCard>

      <EditorCard title="Services / Menu Items">
        <EditableList
          items={website.services}
          onChange={(v) => update("services", v)}
          fields={SERVICE_FIELDS}
          itemLabel="Item"
          emptyItem={{ name: "", description: "" }}
        />
      </EditorCard>

      <EditorCard title="Stat Bar">
        <EditableList
          items={website.stats}
          onChange={(v) => update("stats", v)}
          fields={STAT_FIELDS}
          itemLabel="Stat"
          emptyItem={{ value: "", label: "" }}
        />
      </EditorCard>

      <EditorCard title="Why Choose Us">
        <EditableList
          items={website.features}
          onChange={(v) => update("features", v)}
          fields={FEATURE_FIELDS}
          itemLabel="Feature"
          emptyItem={{ icon: "✅", title: "", description: "" }}
        />
      </EditorCard>

      <EditorCard title="How It Works">
        <EditableList
          items={website.process}
          onChange={(v) => update("process", v)}
          fields={PROCESS_FIELDS}
          itemLabel="Step"
          emptyItem={{ title: "", description: "" }}
        />
      </EditorCard>

      <EditorCard
        title="Pricing"
        description="No fabricated dollar amounts by default — but you know your real prices, so feel free to type them in here directly."
      >
        <EditableList
          items={website.pricing}
          onChange={(v) => update("pricing", v)}
          fields={PRICING_FIELDS}
          itemLabel="Tier"
          emptyItem={{ name: "", priceLabel: "", features: [] }}
        />
      </EditorCard>

      <EditorCard title="FAQ">
        <EditableList
          items={website.faq}
          onChange={(v) => update("faq", v)}
          fields={FAQ_FIELDS}
          itemLabel="Question"
          emptyItem={{ question: "", answer: "" }}
        />
      </EditorCard>

      <EditorCard title="Reviews">
        <EditableList
          items={website.reviews}
          onChange={(v) => update("reviews", v)}
          fields={REVIEW_FIELDS}
          itemLabel="Review"
          emptyItem={{ text: "", author: "", rating: 5 }}
        />
      </EditorCard>

      <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 py-4 backdrop-blur-sm">
        <div className="text-sm">
          {saved && <span className="font-medium text-emerald-600">Saved.</span>}
          {error && <span className="font-medium text-red-600">{error}</span>}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/site/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            View Live
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
