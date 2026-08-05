import { NextRequest, NextResponse } from "next/server";
import { getSite } from "@/features/website/storage";
import { callClaudeChat, type ChatMessage } from "@/lib/ai/client";
import { buildSiteChatSystemPrompt } from "@/lib/ai/chat";
import { isRateLimited } from "@/lib/rateLimit";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 8; // most recent turns kept for context

interface ChatRequestBody {
  slug?: string;
  messages?: { role: string; content: string }[];
}

/**
 * Live chat endpoint for a published site's ChatWidget. Deliberately does
 * NOT trust any business/service info the client might send -- it looks up
 * the real saved site by slug and builds the system prompt server-side, so
 * a visitor can't manipulate what the assistant is told about the business.
 */
export async function POST(request: NextRequest) {
  let body: ChatRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { slug, messages } = body;

  if (!slug || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Missing slug or messages" }, { status: 400 });
  }

  const site = await getSite(slug);
  if (!site) {
    // Most common cause locally: in-memory storage (no Upstash configured)
    // isn't guaranteed to be shared across every route in dev -- see
    // isPersistentStorageConfigured() / storage.ts. Logged here so it's
    // obvious in server logs whether this is that, vs. a genuinely bad slug.
    console.warn(`Site chat: no saved site found for slug "${slug}"`);
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`${ip}:${slug}`)) {
    return NextResponse.json(
      { error: "You're sending messages a little too quickly — please try again in a few minutes." },
      { status: 429 }
    );
  }

  const history: ChatMessage[] = messages
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "Last message must be from the visitor" }, { status: 400 });
  }

  try {
    const reply = await callClaudeChat(history, {
      system: buildSiteChatSystemPrompt(site),
      maxTokens: 400,
    });
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Site chat failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
