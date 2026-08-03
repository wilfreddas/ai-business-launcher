import { Business } from "../businesses/types";
import { WebsiteContent } from "./types";

import { askAI } from "@/lib/ai/client";
import { websitePrompt } from "@/lib/ai/prompts";

export async function generateWebsite(
  business: Partial<Business>
): Promise<WebsiteContent> {
  const prompt = websitePrompt(
    business.name ?? "Business",
    business.description ?? ""
  );

  const aiResponse = await askAI({
    prompt,
  });

  console.log("AI Response:", aiResponse);

  return {
    title: business.name ?? "My Business",

    headline: "Your professional website",

    description:
      business.description ??
      "Professional services you can trust.",

    sections: [
      {
        type: "hero",
        heading: "Welcome",
        content: aiResponse.content,
      },
      {
        type: "contact",
        heading: "Contact Us",
        content:
          business.address ?? "",
      },
    ],
  };
}