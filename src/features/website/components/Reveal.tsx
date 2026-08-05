"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Lightweight fade + slide-up entrance as a section scrolls into view. Pure
 * client-side polish for the live preview -- deliberately NOT used in
 * WebsiteExportDocument, which needs to render correctly with zero
 * JavaScript once downloaded.
 */
export default function Reveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
