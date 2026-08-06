"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Fixed "back to top" button -- hidden until the page has scrolled down a
 * bit, hidden again once you're back near the top. Reusable across both the
 * app's own pages and generated client sites (pass a className to match a
 * site's theme color; defaults to plain black/white otherwise).
 */
export default function ScrollToTopButton({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition hover:opacity-90 ${
        className || "bg-black text-white"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
