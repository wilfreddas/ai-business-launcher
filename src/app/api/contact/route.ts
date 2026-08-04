import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  business?: string;
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
