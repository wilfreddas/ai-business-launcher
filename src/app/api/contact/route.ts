import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  business?: string;
  /**
   * Honeypot: a field real visitors never see (hidden off-screen in the
   * form), so a non-empty value here means whatever submitted this filled
   * out every field it could find -- a bot, not a person.
   */
  website?: string;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Handles contact-form submissions from generated business websites.
 * No email/CRM provider is wired up yet, so this validates the payload and
 * logs it server-side, returning a real success/error response the form can
 * react to. Swap the console.log for an email/CRM integration when one is
 * connected.
 */
export async function POST(request: NextRequest) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot tripped -- report success so the bot has no signal to adapt
  // to, but silently drop the submission instead of logging/forwarding it.
  if (body.website?.trim()) {
    return NextResponse.json({ success: true });
  }

  if (isRateLimited(`contact:${getClientIp(request)}`)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const { name, email, message, business } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  console.log("📬 New contact form submission:", {
    business,
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
