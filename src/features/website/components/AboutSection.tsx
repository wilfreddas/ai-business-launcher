"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AboutContent } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, cardClass } from "../theme";
import { stockPhotoUrl } from "../stockPhoto";

interface Props {
  about: AboutContent;
}

export default function AboutSection({ about }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!about) return null;

  return (
    <section id="about" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className={`${cardClass} !p-0 aspect-[4/3] overflow-hidden order-1 md:order-none`}>
          {imageFailed ? (
            <div
              className="h-full w-full"
              style={{ background: "linear-gradient(135deg, var(--w-primary), var(--w-secondary))" }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={stockPhotoUrl(about.heading || "about", 700, 525)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <div className="text-center md:text-left">
          <h2 style={headingStyle} className={sectionHeadingClass}>
            {about.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--w-text)]/75 sm:text-lg">
            {about.body}
          </p>

          {about.highlights && about.highlights.length > 0 && (
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
              {about.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--w-text)]/85"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--w-primary)]" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
