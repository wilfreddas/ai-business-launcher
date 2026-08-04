import { Business } from "../businesses/types";

import {
  WebsiteContent,
} from "./types";

import {
  buildWebsiteBlueprint,
} from "./blueprint";


export function generateWebsite(
  business: Partial<Business>
): WebsiteContent {


  const blueprint =
    buildWebsiteBlueprint(business);


  return {

    title:
      business.name ??
      "My Business",


    headline:
      blueprint.template === "restaurant"
        ? "Fresh food made with passion"
        : "Professional service you can trust",


    description:
      business.description ??
      "",


    sections:
      blueprint.sections.map(
        (section) => ({
          type: section,

          heading:
            section
              .charAt(0)
              .toUpperCase()
              +
            section.slice(1),

          content:
            business.description ?? "",
        })
      ),
  };
}