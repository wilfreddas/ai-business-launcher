"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { BusinessInfo } from "@/features/generation/types";
import { headingStyle, sectionHeadingClass, primaryButtonClass, formInputClass } from "../theme";
import ContactInfoList from "./ContactInfoList";

interface Props {
  businessInfo: BusinessInfo;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ContactSection({ businessInfo }: Props) {
  const [state, setState] = useState<SubmitState>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, business: businessInfo.businessName }),
      });

      if (!res.ok) throw new Error("Request failed");
      setState("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="bg-[var(--w-bg)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 style={headingStyle} className={`${sectionHeadingClass} text-center sm:text-left`}>
          Get In Touch
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
          {/* Contact Info */}
          <ContactInfoList businessInfo={businessInfo} />

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={formInputClass}
            />
            <input
              type="email"
              required
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={formInputClass}
            />
            <textarea
              required
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={formInputClass}
            />

            <button
              type="submit"
              disabled={state === "loading"}
              className={`${primaryButtonClass} w-full disabled:opacity-60`}
            >
              {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {state === "loading" ? "Sending..." : "Send Message"}
            </button>

            {state === "success" && (
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Message sent — we&apos;ll get back to you soon.
              </p>
            )}
            {state === "error" && (
              <p className="text-sm font-medium text-red-600">
                Something went wrong. Please try again or call us directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
