import {
  modernTheme,
  outdoorTheme,
} from "./themes";


import { Business } from "@/features/businesses/types";


export function getWebsiteTheme(
  business: Partial<Business>
) {


  if (
    business.type === "lawn_care" ||
    business.type === "landscaping"
  ) {

    return outdoorTheme;

  }


  return modernTheme;

}