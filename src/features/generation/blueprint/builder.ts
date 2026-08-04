import { Business } from "@/features/businesses/types";

import {
  WebsiteBlueprint,
} from "./types";


export function buildWebsiteBlueprint(
  business: Partial<Business>
): WebsiteBlueprint {

  const isRestaurant =
    business.type === "restaurant";


  if (isRestaurant) {
    return {
      template: "restaurant",

      sections: [
        "hero",
        "menu",
        "gallery",
        "reviews",
        "location",
        "contact",
      ],

      theme: {
        style: "modern",
        primaryColor: "#111111",
      },
    };
  }


  return {
    template: "service",

    sections: [
      "hero",
      "services",
      "about",
      "reviews",
      "contact",
    ],

    theme: {
      style: "classic",
      primaryColor: "#111111",
    },
  };
}