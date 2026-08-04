import {
  restaurantTemplate,
  serviceTemplate,
} from "./templates";

import { Business } from "@/features/businesses/types";


export function getWebsiteTemplate(
  business: Partial<Business>
) {

  if (business.type === "restaurant") {
    return restaurantTemplate;
  }

  return serviceTemplate;
}