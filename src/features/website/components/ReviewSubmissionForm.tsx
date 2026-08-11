"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { formInputClass, primaryButtonClass } from "../theme";

interface Props {
  slug: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * The actual review-collection mechanism -- posts to /api/site-review,
 * which stores the submission unapproved until someone on the team reviews
 * it (see Edit Content -> Reviews). This replaces the old AI-fabricated
 * testimonials with something real, even if that means a new site starts
 * out with zero reviews shown instead of four fake five-star ones.
 */
export default function ReviewSubmissionForm({ slug }: Props) {
  const [state, setState] = useState<SubmitState>("idle");
  const [form, setForm] = useState({ author: "", rating: 5, text: "", website: "" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    try {
      const res = await fetch("/api/site-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug }),
      });

      if (!res.ok) throw new Error("Request failed");
      setState("success");
      setForm({ author: "", rating: 5, text: "", website: "" });
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        <p className="text-sm font-medium text-[var(--w-text)]">
          Thanks for sharing your experience — it&apos;ll show up here once it&apos;s reviewed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3">
      {/* Honeypot -- see /api/contact's ContactSection for the same pattern. */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0"
      />

      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: value }))}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 ${
                  value <= form.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      <input
        type="text"
        required
        placeholder="Your name"
        value={form.author}
        onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
        className={formInputClass}
      />
      <textarea
        required
        placeholder="Tell us about your experience"
        rows={3}
        value={form.text}
        onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
        className={formInputClass}
      />

      <button
        type="submit"
        disabled={state === "loading"}
        className={`${primaryButtonClass} w-full disabled:opacity-60`}
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {state === "loading" ? "Sending..." : "Submit Review"}
      </button>

      {state === "error" && (
        <p className="text-center text-sm font-medium text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
