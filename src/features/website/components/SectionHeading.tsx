import { headingStyle, sectionHeadingClass } from "../theme";

interface Props {
  heading: string;
  subheading?: string;
  className?: string;
}

/**
 * Centered section title + optional subheading. Every section (Services,
 * Features, Gallery, Reviews, Pricing, Process, FAQ...) rendered this exact
 * markup independently before -- pulled out once so future sections don't
 * re-copy it.
 */
export default function SectionHeading({ heading, subheading, className }: Props) {
  return (
    <div className={`mx-auto mb-10 max-w-2xl text-center sm:mb-14 ${className ?? ""}`}>
      <h2 style={headingStyle} className={sectionHeadingClass}>
        {heading}
      </h2>
      {subheading && <p className="mt-3 text-base text-[var(--w-text)]/70">{subheading}</p>}
    </div>
  );
}
