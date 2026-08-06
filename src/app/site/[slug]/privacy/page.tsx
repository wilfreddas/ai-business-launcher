import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/features/website/storage";
import { themeCssVars, headingStyle } from "@/features/website/theme";
import Footer from "@/features/website/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  const name = site?.website.title || "this website";
  return { title: `Privacy Policy | ${name}` };
}

/**
 * A real, per-business privacy policy, not boilerplate -- it describes what
 * this specific site's contact form actually collects and does with it
 * (see /api/contact and /api/site-chat). Reflects true current behavior:
 * submissions are delivered to the business but not kept in a persistent
 * database by this platform. Update the wording here if that ever changes
 * (e.g. once leads start being saved for the dashboard).
 *
 * Not included in the downloadable static HTML export -- see Footer.tsx,
 * which only links here when it has a live `slug` to link to.
 */
export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Site not found</h1>
        <Link href="/" className="text-sm font-semibold underline">
          Back home
        </Link>
      </div>
    );
  }

  const { website } = site;
  const { businessInfo, theme, title } = website;
  const updated = new Date(site.updatedAt ?? site.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={themeCssVars(theme)} className="flex min-h-screen flex-col">
      <header className="border-b border-black/5 px-4 py-5">
        <div className="mx-auto max-w-3xl">
          <Link href={`/site/${slug}`} style={headingStyle} className="text-lg font-bold hover:opacity-80">
            {title}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
        <h1 style={headingStyle} className="text-3xl font-bold sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--w-text)]/60">Last updated {updated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--w-text)]/85 sm:text-base">
          <section>
            <h2 style={headingStyle} className="text-lg font-semibold">
              Who this covers
            </h2>
            <p className="mt-2">
              This page explains what {title} collects through this website and what happens to it.
              {businessInfo.email && (
                <>
                  {" "}
                  If you have questions, contact us at{" "}
                  <a className="underline" href={`mailto:${businessInfo.email}`}>
                    {businessInfo.email}
                  </a>
                  .
                </>
              )}
            </p>
          </section>

          <section>
            <h2 style={headingStyle} className="text-lg font-semibold">
              Information we collect
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Contact form: the name, email address, and message you submit to reach us.</li>
              <li>
                If this site includes a chat assistant, the messages you send it while using that
                feature.
              </li>
              <li>
                Basic technical logs any web host automatically records (like IP address and browser
                type), used only for security and troubleshooting.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={headingStyle} className="text-lg font-semibold">
              How we use it
            </h2>
            <p className="mt-2">
              We use what you submit only to respond to your inquiry. We do not sell your
              information, and we do not use it for advertising or share it with third parties for
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 style={headingStyle} className="text-lg font-semibold">
              How it&apos;s stored
            </h2>
            <p className="mt-2">
              Messages submitted through this site&apos;s contact form are delivered to {title} and
              are not kept in a persistent, searchable database by this website. {title} may keep a
              copy of your message directly (for example, in email) in order to respond to you.
            </p>
          </section>

          <section>
            <h2 style={headingStyle} className="text-lg font-semibold">
              Third parties
            </h2>
            <p className="mt-2">
              This website was built using AI Business Launcher, which uses Anthropic&apos;s Claude
              API to help generate site content. If this site includes a chat assistant, messages you
              send to it are processed by Anthropic solely to generate a reply, and are not stored in
              a persistent database by us.
            </p>
          </section>

          <section>
            <h2 style={headingStyle} className="text-lg font-semibold">
              Your choices
            </h2>
            <p className="mt-2">
              You can contact {title} at any time using the details below to ask what information we
              have about you or to request it be deleted.
            </p>
          </section>
        </div>
      </main>

      <Footer businessName={title} businessInfo={businessInfo} slug={slug} />
    </div>
  );
}
