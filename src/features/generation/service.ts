import { Business } from "../businesses/types";

import {
 WebsiteContent,
} from "./types";

import {
 buildWebsiteBlueprint,
} from "./blueprint";


export async function generateWebsite(
 business: Partial<Business>
): Promise<WebsiteContent> {


const blueprint =
 await buildWebsiteBlueprint(
   business
 );


return {

 title:
  business.name ??
  "My Business",


 headline:
  "Welcome to our website",


 description:
  business.description ?? "",


 sections:
 blueprint.sections.map(
 section => ({

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
 )

};


}