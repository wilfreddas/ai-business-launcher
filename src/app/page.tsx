import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { COMPANY, STREAMS, PORTFOLIO } from "@/lib/company";
import CompanyContactForm from "@/components/CompanyContactForm";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const NAV_LINKS = [
  { href: "#streams", label: "What We Do" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

const FAQS = [
  {
    q: "How long does it actually take?",
    a: "Most sites are ready to share within minutes of finishing a short interview about the business — not days or weeks.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. Everything is generated for you, and any changes after launch are made through a simple no-code editor, not by writing code.",
  },
  {
    q: "What if I want to change something later?",
    a: "Prices, text, photos, and which sections show can all be updated anytime, without waiting on a developer.",
  },
  {
    q: "Is this just a template?",
    a: "No. Each site is designed and written fresh for that specific business — colors, layout, and copy are chosen individually, not pulled from a shared template.",
  },
  {
    q: "What's actually included?",
    a: "A real, working website with a live link, a working contact form, and SEO basics — plus ongoing help keeping it updated.",
  },
];

// The public front door. Everything specific to the company (name, tagline,
// services, portfolio) lives in src/lib/company.ts -- update that file, not
// this one, once branding is finalized. This page is always public even
// when the team login gate is on (see isPubliclyReachable in src/proxy.ts).
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-lg font-bold text-gray-900">{COMPANY.name}</span>

          <nav className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-gray-900">
                {link.label}
              </a>
            ))}
          </nav>

          <Link
            href="/login"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            Client Portal
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-gray-100/80 blur-3xl"
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Built with AI, launched in minutes
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              Real websites for local businesses, built by AI.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-600">
              A short interview in, a real, working website out — designed, written, and launched
              in minutes, not weeks.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#contact" className={buttonVariants({ size: "lg" })}>
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="#portfolio" className={buttonVariants({ size: "lg", variant: "outline" })}>
                See our work
              </Link>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="border-t border-gray-100 px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Rocket,
                title: "Fast turnaround",
                body: "A live website in minutes, not weeks of waiting on a design queue.",
              },
              {
                icon: Wand2,
                title: "No templates",
                body: "Every site is designed and written fresh by AI for that business specifically.",
              },
              {
                icon: ShieldCheck,
                title: "Actually works",
                body: "Real contact forms, working phone/email links, and SEO basics — not a mockup.",
              },
              {
                icon: Sparkles,
                title: "Easy to update",
                body: "Change prices, text, or sections yourself anytime — no code, no waiting on us.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center sm:text-left">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900 sm:mx-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The problem */}
        <section className="border-t border-gray-100 bg-gray-50/60 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Why this exists
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Most local businesses can&apos;t afford to wait months for a website.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              A freelancer or agency build usually means weeks of back-and-forth and a bill that
              doesn&apos;t make sense for a small shop. A DIY builder means the owner becomes a part-time
              web designer. We built a third option: a real site, built for you, live the same day.
            </p>
          </div>
        </section>

        {/* Streams / services */}
        <section id="streams" className="border-t border-gray-100 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Line of work
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">What we do</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              More ways to help a business grow are on the way — here&apos;s what&apos;s live today.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">
              {STREAMS.map((stream) => (
                <div
                  key={stream.name}
                  className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    {stream.status === "live" ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                        <Clock className="h-3 w-3" />
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{stream.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{stream.description}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-6 border-t border-gray-200 pt-10 text-left sm:grid-cols-3 sm:text-center">
              {[
                { step: "Step 1", label: "Quick interview" },
                { step: "Step 2", label: "AI designs & writes it" },
                { step: "Step 3", label: "Live, ready to share" },
              ].map((item) => (
                <div key={item.step}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {item.step}
                  </p>
                  <p className="mt-1 font-medium text-gray-900">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="border-t border-gray-100 bg-gray-50/60 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Example builds
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-gray-600">
              A look at what a generated site can actually look like, across different kinds of
              businesses.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PORTFOLIO.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Live, scaled-down preview of the real site -- not a
                      screenshot or a placeholder, the actual page. Falls
                      back to just being a normal link if a site's host
                      blocks framing. */}
                  <div className="relative h-48 overflow-hidden border-b border-gray-100 bg-gray-50">
                    <iframe
                      src={item.url}
                      title={item.name}
                      loading="lazy"
                      tabIndex={-1}
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-0 origin-top-left"
                      style={{ width: "1280px", height: "800px", transform: "scale(0.29)" }}
                    />
                    {/* Transparent overlay so the whole tile is clickable
                        instead of interactive elements inside the iframe. */}
                    <div className="absolute inset-0" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-gray-900" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{item.category}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-gray-100 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Common questions
            </h2>
            <div className="mt-10 space-y-3">
              {FAQS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-gray-200 bg-white p-5 open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA banner */}
        <section className="relative overflow-hidden bg-gray-950 px-6 py-16 text-center text-white sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to get your business online?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Tell us about your business and we&apos;ll follow up with next steps.
            </p>
            <a
              href="#contact"
              className={buttonVariants({ size: "lg", className: "mt-7 !bg-white !text-gray-900 hover:!bg-gray-100" })}
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-gray-100 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-md">
            <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Get in touch
            </h2>
            <p className="mt-3 text-center text-gray-600">
              Tell us about your business and we&apos;ll follow up.
            </p>
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <CompanyContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 px-6 py-10 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </p>
        <Link href="/login" className="mt-2 inline-block font-medium underline hover:text-gray-900">
          Client Portal
        </Link>
      </footer>

      <ScrollToTopButton />
    </div>
  );
}
