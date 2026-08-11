import { BusinessInfo } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, primaryButtonClass } from "../../theme";
import ContactInfoList from "../ContactInfoList";

interface Props {
  businessInfo: BusinessInfo;
}

/**
 * Contact section for the standalone HTML export. There's no server to post
 * to once this file leaves the app, so the form submits via a mailto: form
 * action instead of fetch — it opens the visitor's email client pre-filled
 * with their message rather than silently doing nothing.
 */
export default function ContactSectionExport({ businessInfo }: Props) {
  return (
    <section id="contact" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 style={headingStyle} className={`${sectionHeadingClass} text-center sm:text-left`}>
          Get In Touch
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
          <ContactInfoList businessInfo={businessInfo} />

          <form
            action={businessInfo.email ? `mailto:${businessInfo.email}` : undefined}
            method="post"
            encType="text/plain"
            className="space-y-4"
          >
            <input type="text" name="Name" required placeholder="Your Name" className="w-full rounded-[var(--w-radius)] border border-black/10 px-4 py-3 text-sm" />
            <input type="email" name="Email" required placeholder="Your Email" className="w-full rounded-[var(--w-radius)] border border-black/10 px-4 py-3 text-sm" />
            <textarea name="Message" required placeholder="Your Message" rows={4} className="w-full rounded-[var(--w-radius)] border border-black/10 px-4 py-3 text-sm" />
            <button type="submit" className={`${primaryButtonClass} w-full`}>
              Send Message
            </button>
            <p className="text-center text-xs text-[var(--w-text)]/50">
              Opens your email app with this message pre-filled.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
