// src/lib/ai/client.ts

import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️  ANTHROPIC_API_KEY not found. Using fallback mode (local testing only)"
  );
}

export const anthropic = apiKey
  ? new Anthropic({ apiKey })
  : null;

/**
 * Pulls the first text block out of a Claude response. Looks across all
 * returned content blocks rather than assuming content[0] is text -- with
 * several generators now running in parallel per site, being defensive here
 * avoids failing a whole section (falling back to placeholder content) over
 * an ordering quirk.
 */
function extractText(message: Anthropic.Message): string {
  const textBlock = message.content.find(
    (block): block is Extract<typeof block, { type: "text" }> => block.type === "text"
  );
  if (textBlock) {
    return textBlock.text;
  }

  const blockTypes = message.content.map((block) => block.type).join(", ") || "none";
  throw new Error(
    `Unexpected response format from Claude (stop_reason: ${message.stop_reason}, content block types: ${blockTypes})`
  );
}

/**
 * Call Claude API with structured prompts
 * Handles fallback mode for local development
 */
export async function callClaude(
  prompt: string,
  options?: {
    maxTokens?: number;
    system?: string;
  }
): Promise<string> {
  // Fallback mode if no API key (local development)
  if (!anthropic) {
    console.log("📝 Using fallback response (no API key)");
    return getFallbackResponse(prompt);
  }

  // Note: claude-sonnet-5 rejects the `temperature` param outright (400
  // invalid_request_error), so it's deliberately not sent here.
  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: options?.maxTokens || 2048,
    system: options?.system || "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return extractText(message);
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Multi-turn chat completion for the live per-site chat widget. Unlike
 * callClaude/callClaudeJSON (a single one-off prompt), this sends real
 * conversation history so follow-up questions have context, and returns
 * plain conversational text rather than JSON.
 */
export async function callClaudeChat(
  messages: ChatMessage[],
  options: { system: string; maxTokens?: number }
): Promise<string> {
  if (!anthropic) {
    return "Thanks for reaching out! Live chat isn't fully configured on this preview yet — please use the contact section below to reach us directly.";
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: options.maxTokens || 500,
    system: options.system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  return extractText(message);
}

/**
 * Call Claude with JSON output guarantee
 * Automatically retries with stricter prompt if JSON parsing fails
 */
export async function callClaudeJSON<T>(
  prompt: string,
  options?: { maxTokens?: number; system?: string }
): Promise<T> {
  const jsonSystemPrompt =
    "You are a JSON generator. You MUST return ONLY valid JSON, no markdown, no explanation, no extra text. Just the JSON object.";

  let response = await callClaude(prompt, {
    maxTokens: options?.maxTokens || 2048,
    system: jsonSystemPrompt,
  });

  response = response.replace(/```json\n?|\n?```/g, "").trim();

  try {
    return JSON.parse(response) as T;
  } catch {
    console.error("JSON parsing failed on first try:", response);

    const strictPrompt = `${prompt}\n\n🚨 CRITICAL: Return ONLY this JSON structure. No text before or after. No markdown. No explanation:`;

    response = await callClaude(strictPrompt, {
      maxTokens: options?.maxTokens || 2048,
      system: "Return ONLY valid JSON. Nothing else.",
    });

    response = response.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(response) as T;
    } catch {
      console.error("JSON parsing failed on retry:", response);
      throw new Error(
        `Failed to parse JSON response after retry. Got: ${response.substring(0, 100)}`
      );
    }
  }
}

/**
 * Fallback responses for local development (no API key)
 */
function getFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (
    lower.includes("blueprint") ||
    lower.includes("website structure") ||
    lower.includes("web designer")
  ) {
    return JSON.stringify({
      template: "service",
      sections: ["hero", "services", "about", "reviews", "contact"],
      theme: {
        style: "professional",
        primaryColor: "#1F2937",
        secondaryColor: "#F3F4F6",
        accentColor: "#2563EB",
        backgroundColor: "#FFFFFF",
        textColor: "#111827",
        headingFont: "sans",
        bodyFont: "sans",
        radius: "soft",
      },
      reasoning: "Fallback design (no API key configured).",
    });
  }

  // Checked before the generic "hero"/"headline" branch below since these
  // prompts happen to mention "hero" in passing (e.g. "placed under the hero").
  if (lower.includes("stat bar")) {
    return JSON.stringify([
      { value: "100%", label: "Satisfaction Guaranteed" },
      { value: "Free", label: "No-Obligation Quotes" },
      { value: "Fast", label: "Response Times" },
    ]);
  }

  if (lower.includes("why choose us")) {
    return JSON.stringify([
      { icon: "✅", title: "Reliable Service", description: "We show up on time and do it right the first time." },
      { icon: "💬", title: "Clear Communication", description: "No surprises — you'll always know what to expect." },
      { icon: "⭐", title: "Customer Focused", description: "Your satisfaction is what we measure ourselves by." },
      { icon: "🤝", title: "Fair, Honest Pricing", description: "Transparent quotes with no hidden fees." },
    ]);
  }

  if (lower.includes("how it works")) {
    return JSON.stringify([
      { title: "Reach Out", description: "Contact us with what you need." },
      { title: "We Confirm Details", description: "We'll follow up to schedule a time that works for you." },
      { title: "We Get It Done", description: "Our team takes care of everything, start to finish." },
    ]);
  }

  if (lower.includes("pricing section")) {
    return JSON.stringify([
      { name: "Basic", priceLabel: "Get a Custom Quote", features: ["Core service", "Flexible scheduling"], highlighted: false },
      { name: "Standard", priceLabel: "Get a Custom Quote", badge: "Most Popular", features: ["Everything in Basic", "Priority scheduling", "Extended coverage"], highlighted: true },
      { name: "Premium", priceLabel: "Get a Custom Quote", features: ["Everything in Standard", "Dedicated support", "Custom add-ons"], highlighted: false },
    ]);
  }

  if (lower.includes("faq section")) {
    return JSON.stringify([
      { question: "How do I get started?", answer: "Reach out using the contact section and we'll follow up to schedule a time that works for you." },
      { question: "What areas do you serve?", answer: "Contact us with your location and we'll confirm we cover your area." },
    ]);
  }

  if (lower.includes("chat widget")) {
    return JSON.stringify({
      greeting: "Hi there! 👋 How can I help you today?",
      quickReplies: ["What are your hours?", "Do you offer free quotes?", "How do I book?"],
    });
  }

  if (lower.includes("business hours") && lower.includes("reformat")) {
    const match = prompt.match(/Raw input: "([^"]*)"/);
    return JSON.stringify({ hours: match?.[1] ?? "" });
  }

  if (lower.includes("about") && lower.includes("section")) {
    return JSON.stringify({
      heading: "Who We Are",
      body: "We provide reliable, professional service to our customers.",
      highlights: ["Trusted locally", "Professional service", "Customer focused"],
    });
  }

  if (lower.includes("gallery") || lower.includes("photo")) {
    return JSON.stringify([
      { label: "Our Work", caption: "A look at our recent work." },
      { label: "Our Team", caption: "The people behind the service." },
      { label: "Happy Customers", caption: "Results our customers love." },
    ]);
  }

  if (lower.includes("headline") || lower.includes("hero")) {
    return JSON.stringify({
      headline: "Welcome to your professional business website",
      subheading:
        "We provide top-quality services for your needs. Get started today.",
      badge: "Now Booking",
    });
  }

  if (lower.includes("service") && lower.includes("generate")) {
    return JSON.stringify([
      {
        name: "Service 1",
        description: "Professional and reliable service",
      },
      {
        name: "Service 2",
        description: "Expert solutions tailored to your needs",
      },
      {
        name: "Service 3",
        description: "Quality service with customer satisfaction",
      },
    ]);
  }

  if (lower.includes("review") && lower.includes("customer")) {
    return JSON.stringify([
      {
        text: "Excellent service! Very professional and timely.",
        author: "John D.",
        rating: 5,
      },
      {
        text: "Highly recommend. Great attention to detail.",
        author: "Sarah M.",
        rating: 5,
      },
      {
        text: "Outstanding work. Will definitely use again!",
        author: "Mike T.",
        rating: 5,
      },
    ]);
  }

  if (lower.includes("marketing copy") || (lower.includes("business") && lower.includes("call-to-action"))) {
    return JSON.stringify({
      tagline: "Professional services for your needs",
      description: "Welcome to our business. We provide excellent service.",
      cta: "Get Started",
      ctaDescription: "Contact us today to learn more",
      ctaType: "contact",
      emergencyAvailable: false,
    });
  }

  if (lower.includes("seo") || lower.includes("meta")) {
    return JSON.stringify({
      title: "Professional Business Services",
      metaDescription: "High-quality professional services for your needs",
      keywords: ["business", "services", "professional"],
      ogTitle: "Professional Business Services",
      ogDescription: "High-quality professional services for your needs",
    });
  }

  return JSON.stringify({ message: "Service information coming soon" });
}