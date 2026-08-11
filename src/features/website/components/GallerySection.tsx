"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { GalleryItem } from "@/features/generation/types";
import { headingStyle, cardClass } from "../theme";
import { stockPhotoUrl } from "../stockPhoto";
import SectionHeading from "./SectionHeading";

interface Props {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: Props) {
  const [failed, setFailed] = useState<Set<number>>(new Set());

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="bg-[var(--w-secondary)]/40 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading heading="Gallery" subheading="A look at our work." />

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
          {gallery.map((item, idx) => (
            <figure
              key={idx}
              className={`${cardClass} group !p-0 overflow-hidden transition-shadow hover:shadow-lg`}
            >
              <div className="relative aspect-square overflow-hidden bg-[var(--w-secondary)]">
                {failed.has(idx) ? (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--w-primary), var(--w-accent))" }}
                  >
                    <ImageIcon className="h-8 w-8 text-white/70 sm:h-10 sm:w-10" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stockPhotoUrl(`${item.label}-${idx}`, 600, 600)}
                    alt={item.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() =>
                      setFailed((prev) => {
                        const next = new Set(prev);
                        next.add(idx);
                        return next;
                      })
                    }
                  />
                )}
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
