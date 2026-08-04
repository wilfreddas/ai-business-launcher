"use client";

import { ImageIcon } from "lucide-react";
import { GalleryItem } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, cardClass } from "../theme";

interface Props {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: Props) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="bg-[var(--w-secondary)]/40 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 style={headingStyle} className={sectionHeadingClass}>
            Gallery
          </h2>
          <p className="mt-3 text-base text-[var(--w-text)]/70">A look at our work.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
          {gallery.map((item, idx) => (
            <figure key={idx} className={`${cardClass} group !p-0 overflow-hidden`}>
              <div
                className="flex aspect-square items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--w-primary), var(--w-accent))",
                }}
              >
                <ImageIcon className="h-8 w-8 text-white/70 sm:h-10 sm:w-10" />
              </div>
              <figcaption className="p-3 sm:p-4">
                <p style={headingStyle} className="text-sm font-semibold">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--w-text)]/60 line-clamp-2">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
