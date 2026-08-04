import { Business } from "@/features/businesses/types";

import {
  WebsiteBlueprint,
} from "./types";

import {
  askAI,
} from "@/lib/ai/client";

import {
  websitePrompt,
} from "@/lib/ai/prompts";


export async function buildWebsiteBlueprint(
  business: Partial<Business>
): Promise<WebsiteBlueprint> {


const prompt =
  websitePrompt(
    business.name ?? "",
    business.description ?? "",
    business.type ?? ""
  );


const response =
  await askAI(prompt);



try {

  return JSON.parse(response);

}
catch {

  return {

    template: "service",

    sections: [
      "hero",
      "services",
      "contact",
    ],

    theme: {
      style: "modern",
      primaryColor:"#000000",
    },

  };

}

}