"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { COMPANY } from "@/lib/company";

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * Lead capture for the company's own marketing homepage. Reuses the same
 * /api/contact route the generated client sites use -- it's already a
 * generic (name, email, message, business) endpoint, so there's no reason
 * for a second one.
 */
export default function CompanyContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, business: `${COMPANY.name} — marketing site lead` }),
      });

      if (!res.ok) throw new Error("Request failed");
      setState("success");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot -- hidden from real visitors, catches bots that auto-fill
          every field. */}
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
      <input
        type="text"
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none"
      />
      <input
        type="email"
        required
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none"
      />
      <textarea
        required
        placeholder="Tell us a bit about your business"
        rows={4}
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none"
      />

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {state === "loading" ? "Sending..." : "Get in touch"}
      </button>

      {state === "success" && (
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Thanks — we&apos;ll get back to you soon.
        </p>
      )}
      {state === "error" && (
        <p className="text-sm font-medium text-red-600">
          Something went wrong. Please try again{COMPANY.email ? ` or email us at ${COMPANY.email}` : ""}.
        </p>
      )}
    </form>
  );
}
