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
 * Call Claude API with structured prompts
 * Handles fallback mode for local development
 */
export async function callClaude(
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
    system?: string;
  }
): Promise<string> {
  // Fallback mode if no API key (local development)
  if (!anthropic) {
    console.log("📝 Using fallback response (no API key)");
    return getFallbackResponse(prompt);
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: options?.maxTokens || 2048,
    temperature: options?.temperature || 0.7,
    system: options?.system || "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  if (message.content[0].type === "text") {
    return message.content[0].text;
  }

  throw new Error("Unexpected response format from Claude");
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
    temperature: 0.3,
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
      temperature: 0.1,
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